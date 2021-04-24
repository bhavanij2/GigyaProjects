import {
  zipObject,
  chain,
} from 'lodash';
import {
  getLocations,
  getLocationDetails,
  getCu360Hierarchy,
  getLocationPayerStatus,
} from './location.service.utils';
import {
  getPortalParamsByPortal,
} from './portal.parameters';
import {
  readTransaction,
} from '../neo4j.utils';
import {
  getUserAdminLocationsQuery,
} from '../queries.util';
import { padSapAccount } from '../../util';
import {
  TypedError,
  ErrorTypes,
} from '../../errors';

export const HIERARCHY = {
  1: 'HQ',
  2: 'Region',
  3: 'Division',
  4: 'Location',
};

export const HQ_PARENT_ID = '0';

export const getAccountData = (data, lob) => ({
  id: padSapAccount(data.sapAccountId.toString()),
  name: data.accountName,
  level: HIERARCHY[data.level],
  lob: [lob],
});

export const iterateChildAccounts = (init, account, lob) => {
  if (account && account.children && account.children.length !== 0) {
    const accountsArr = account.children.map(c => iterateChildAccounts(
      getAccountData(c, lob), c, lob,
    ));
    return {
      ...init,
      children: accountsArr,
    };
  }
  return getAccountData(account, lob);
};

function setChildren(location, flatLocations) {
  // get all of location's children from flat locations
  const children = flatLocations.filter(l => l.parentID === location.id);

  // combine the children by LOB
  const combinedChildren = [];
  children.forEach(child => {
    // if the child already exists
    if (combinedChildren.filter(cChild => cChild.id === child.id).length) {
      // just add lob
      combinedChildren.filter(cChild => cChild.id === child.id)[0].lob.push(child.lob[0]);
    }
    else {
      // add the child
      combinedChildren.push(child);
    }
  });

  // remove children from flat locations array
  flatLocations = flatLocations.filter(loc => loc.parentID !== loc.id);


  // if there are children on self, repeat
  if (combinedChildren.length) {
    combinedChildren.forEach(child => {
      child.children = setChildren(child, flatLocations);
    });
  }

  return combinedChildren;
}

// flatten hierarchy, without recursion
export function flattenLocations(hierarchyLocations) {
  const flatLocations = [];
  let locationsCopy = JSON.parse(JSON.stringify(hierarchyLocations));
  // while there are locations to process
  while (locationsCopy.length) {
    // get the first location
    const location = locationsCopy[0];
    // if it has children
    if (location.children) {
      // assign the children the parentID
      const newLoc = location.children.map(child => ({
        ...child,
        parentID: location.id,
      }));
      location.children = newLoc;
      // move the children to the end of the processing list
      locationsCopy = locationsCopy.concat(JSON.parse(JSON.stringify(location.children)));
      location.children = null;
    }
    // if the location is an HQ
    if (location.parentID === undefined) {
      // give it a parentID
      location.parentID = HQ_PARENT_ID;
    }
    // move the current location to the flat locations list
    flatLocations.push(locationsCopy.shift());
  }

  return flatLocations;
}

function traverse(node, childrenName, processCB) {
  // do the processing on the current node
  processCB(node);

  if (node[childrenName].length) {
    node[childrenName].forEach(child => {
      traverse(child, childrenName, processCB);
    });
  }
}

export const combinedHierarchyByLob = hierlob => {
  // flatten hierarchy, adding `parentID`
  const combinedHierarchy = [];
  const flatLocations = flattenLocations(hierlob);
  const HQs = flatLocations.filter(l => l.parentID === HQ_PARENT_ID);
  // for each flat HQ
  HQs.forEach(HQ => {
    // if the location is already in combined hierarchy
    if (combinedHierarchy.filter(cHQ => cHQ.id === HQ.id).length) {
      // add LOB to existing combined hierarchy entry
      combinedHierarchy.filter(cHQ => cHQ.id === HQ.id)[0].lob.push(HQ.lob[0]);
    }
    else {
      // add item to combined hierarchy
      combinedHierarchy.push(HQ);
    }
  });

  // for each combined HQ
  combinedHierarchy.forEach(HQ => {
    // set it's (combined) children, recursively
    HQ.children = setChildren(HQ, flatLocations);
  });

  // remove extra props
  // transform lob names
  combinedHierarchy.forEach(HQ => {
    traverse(
      HQ,
      'children',
      location => {
        delete location.parentID;
        location.lob = location.lob.join('|').toLowerCase().split('|');
      },
    );
  });

  return combinedHierarchy;
};

export const getLocationHierarchy = async (locationId, lobArr) => {
  try {
    const locationHierarchy = await getLocations(locationId);
    const validlobLocations = locationHierarchy.data.accounts.filter(account => lobArr.includes(account.key));
    const hierlob = validlobLocations.map(account => {
      const init = getAccountData(account.value, account.key);
      return iterateChildAccounts(init, account.value, account.key);
    });

    return combinedHierarchyByLob(hierlob);
  }
  catch (e) {
    console.log(`error ${JSON.stringify(e)}`);
    throw e;
  }
};

const isValidIdentifier = (identifiers, sapAccountNumber, sourceSystem) => {
  const numIdentifiers = chain(identifiers)
    .filter(identifier => identifier.type === sourceSystem && identifier.value === sapAccountNumber)
    .value().length;
  return numIdentifiers > 0 ? 1 : 0;
};

const getValidLocations = (locationDetail, paddedSapAccountNumber, sourceSystem, hierarchySourceSystem) => chain(locationDetail.data)
  .filter(location => location.provenance.sourceSystem === hierarchySourceSystem)
  .filter(location => isValidIdentifier(location.identifiers, paddedSapAccountNumber, sourceSystem))
  .value();

const getAddressFields = (streetAddresses, postOfficeBoxes) => {
  const stAddress = chain(streetAddresses)
    .filter(addr => addr.usageType === 'shipping' || addr.usageType === 'shipping-address' || addr.usageType === 'street-address')
    .value()[0];
  return stAddress !== undefined ? stAddress : postOfficeBoxes[0];
};

const getHqNode = hierarchyDetail => chain(hierarchyDetail.data.nodes)
  .filter(node => node.levels[0] === 1)
  .value();

const getHqSapAccountId = hqNode => {
  if (hqNode.length === 0) {
    throw new TypedError(
      ErrorTypes.RESOURCE_NOT_FOUND,
      'Error Code: CU105 - Could not find parent node',
    );
  }
  const hierarchyNodes = chain(hqNode[0].identifiers)
    .filter(node => node.type === 'sap-customer-number')
    .value();
  if (hierarchyNodes.length === 0) {
    throw new TypedError(
      ErrorTypes.RESOURCE_NOT_FOUND,
      'Error Code: CU105 - Found parent node but could not get the corresponding sap customer number node',
    );
  }
  return hierarchyNodes[0].value;
};

const getPayerStatus = (isCornState, paddedSapAccountNumber, sourceSystem, country) => {
  const isHierarcyValidForCountry = country === 'US';
  if (!isCornState && isHierarcyValidForCountry) {
    return getLocationPayerStatus(paddedSapAccountNumber, sourceSystem);
  }
  return [];
};

const getHQBasedOnPortalParameters = async (isCornState, paddedSapAccountNumber, globalPartyIdentifier, country, isHierarchy) => {
  if (!isCornState && isHierarchy) {
    const hierarchyDetail = await getCu360Hierarchy(globalPartyIdentifier);
    if (hierarchyDetail.data.nodes === 0) {
      throw new TypedError(
        ErrorTypes.RESOURCE_NOT_FOUND,
        `Error Code: CU103 Could not find details of ${paddedSapAccountNumber}, using the global party Identifier ${globalPartyIdentifier}`,
      );
    }
    const hqNode = getHqNode(hierarchyDetail);
    return getHqSapAccountId(hqNode);
  }
  return paddedSapAccountNumber;
};

export const getLocationInfo = async (sapAccountId, sourceSystem, country = 'US', portal = 'mycrop') => {
  const paddedSapAccountNumber = padSapAccount(sapAccountId);
  const portalParams = await getPortalParamsByPortal(portal);
  const { isHierarchyValid, hierarchyMap } = portalParams;
  const locationDetail = await getLocationDetails(paddedSapAccountNumber, sourceSystem);
  if (locationDetail.data.length === 0) {
    throw new TypedError(
      ErrorTypes.RESOURCE_NOT_FOUND,
      `Error Code: CU100 - Could not find ${sapAccountId}, in customer 360`,
    );
  }

  const validLocations = getValidLocations(locationDetail, paddedSapAccountNumber, sourceSystem, hierarchyMap[sourceSystem]);
  if (validLocations.length === 0) {
    throw new TypedError(
      ErrorTypes.RESOURCE_NOT_FOUND,
      `Error Code: CU102 Could not find ${hierarchyMap[sourceSystem]} id for ${sapAccountId}, in customer 360`,
    );
  }
  const {
    globalPartyIdentifier, name, streetAddresses, postOfficeBoxes,
  } = validLocations[0];
  const cornStatesLocations = locationDetail.data.filter(location => location.isCornState);
  const addressFields = getAddressFields(streetAddresses, postOfficeBoxes);
  const hqSapAccountId = await getHQBasedOnPortalParameters(cornStatesLocations.length, paddedSapAccountNumber, globalPartyIdentifier, country, isHierarchyValid);
  const payerStatus = getPayerStatus(cornStatesLocations.length, paddedSapAccountNumber, sourceSystem, country);

  return {
    locationName: name,
    streetAddress: addressFields.addressLine1,
    city: addressFields.city,
    state: addressFields.state,
    zipCode: addressFields.postalCode,
    hqSapId: hqSapAccountId,
    sourceSystem,
    featureSets: {
      payer: await payerStatus,
    },
  };
};

const getUsersAdminLocations = dbResult => {
  const user = chain(dbResult.records)
    .map(record => zipObject(record.keys, record._fields))
    .value();
  if (user.length === 0) {
    return {};
  }
  const groupedByAccountId = chain(user)
    .groupBy('sapAccountId')
    .value();
  const keys = Object.keys(groupedByAccountId);
  const getLobArr = (groupedByAccountIds, key) => groupedByAccountIds[key].map(row => row.lob.toUpperCase());
  const accounts = keys.map(key => ({
    sapAccount: key,
    lobArr: getLobArr(groupedByAccountId, key),
  }));
  return accounts;
};

export const getUsersLocationHierarchy = async userId => {
  const query = getUserAdminLocationsQuery(userId, ['glb:seed:uadmin', 'glb:cp:uadmin', 'glb:acceleron:uadmin', 'glb:bioag:uadmin']);
  const result = await readTransaction(query);
  const listOfLocations = getUsersAdminLocations(result);
  if (!listOfLocations.length) {
    return [];
  }
  const allUserLocations = await Promise.all(listOfLocations.map(location => getLocationHierarchy(location.sapAccount, location.lobArr)));
  return allUserLocations.flat();
};

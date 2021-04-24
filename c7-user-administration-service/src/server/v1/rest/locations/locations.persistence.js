import {
  getAccountData,
  HQ_PARENT_ID,
  HIERARCHY,
} from '../../locations';
import { getLocations } from '../../locations/location.service.utils';

function padSapIdToTenChars(sapId) {
  return `000${sapId}`.toString();
}

function processChildNode(location, lob, parentID, flattenedLocations) {
  if (location.sapAccountId === undefined) {
    return;
  }
  const locationId = padSapIdToTenChars(location.sapAccountId);

  if (locationId in flattenedLocations) {
    if (!flattenedLocations[locationId].lob.includes(lob)) {
      flattenedLocations[locationId].lob.push(lob);
    }
  }
  else {
    const lobLocationObj = {
      id: locationId,
      name: location.accountName,
      level: HIERARCHY[location.level],
      lob: [lob],
      parentID,
    };
    flattenedLocations[locationId] = lobLocationObj;
  }

  const { children } = location;
  if ((children === undefined) || (children.length === 0)) {
    return;
  }

  children.forEach(child => processChildNode(child, lob, locationId, flattenedLocations));
}

function processParentNodeAndChildren(parentLocation, flattenedLocations) {
  // eslint-disable-next-line prefer-destructuring
  const lob = parentLocation.key.toLowerCase();
  const parentAccountData = getAccountData(parentLocation.value, lob);

  if (parentAccountData.id in flattenedLocations) {
    flattenedLocations[parentAccountData.id].lob = [
      ...flattenedLocations[parentAccountData.id].lob,
      ...parentAccountData.lob,
    ];
  }
  else {
    flattenedLocations[parentAccountData.id] = {
      ...parentAccountData,
      parentID: HQ_PARENT_ID,
    };
  }

  const { children } = parentLocation.value;
  const parentID = padSapIdToTenChars(parentLocation.value.sapAccountId);
  if ((children === undefined) || (children.length === 0)) return;

  children.forEach(child => processChildNode(child, lob, parentID, flattenedLocations));
}

async function getFlattenedLocationHierarchy(locationId) {
  try {
    const locationHierarchy = await getLocations(locationId);
    const validLobLocations = locationHierarchy.data.accounts 
      ? locationHierarchy.data.accounts
      : [];

    const flattenedLocations = {};

    validLobLocations.forEach(parentLobLocation => processParentNodeAndChildren(parentLobLocation, flattenedLocations));

    return flattenedLocations;
  }
  catch (e) {
    console.log(`error ${JSON.stringify(e)}`);
    throw e;
  }
}

async function getLobsFromHqSapId(hqSapId) {
  const locationHierarchy = await getFlattenedLocationHierarchy(hqSapId);
  return Object.values(locationHierarchy);
}

export default getLobsFromHqSapId;

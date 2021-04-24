import { to } from 'await-to-js';
import { HybrisHeadquartersResponse, Brand, Persona } from '../rest/users/types';
import { TypedError, ErrorTypes } from '../../errors';
import { getAuthToken } from '../rest/utils';
import { getPortalParams, getPortalsByPartnerFunctionData } from './portal.parameters';
import { PortalParameters } from '../rest/types';

const axios = require('axios');

const axiosDefault = axios.create();
axiosDefault ? axiosDefault.defaults.timeout = 25000 : '';


export const getApi = async url => {
  try {
    const token = await getAuthToken();
    const [error, response] = await to(axiosDefault.get(url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }));

    if (error) {
      throw new TypedError(
        ErrorTypes.INTERNAL_SERVER_ERROR,
        error.message,
        error,
      );
    }

    return response;
  }
  catch (e) {
    console.log(`error ${JSON.stringify(e)}`);
    throw e;
  }
};

export const getHqLocations = async (): Promise<HybrisHeadquartersResponse> => {
  try {
    const token = await getAuthToken();
    const [error, result] = await to(axiosDefault.get(`${process.env.hybris_location_hierarchy_api}/headquarters`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }));

    if (error) {
      throw new TypedError(
        ErrorTypes.INTERNAL_SERVER_ERROR,
        error.message,
        error,
      );
    }

    return result.data;
  }
  catch (e) {
    console.log(`error ${JSON.stringify(e)}`);
    throw e;
  }
};

const addNationalGrowerRecords = records => {
  const nationalDealerRecords = records.filter(r => r.brand === Brand.National && r.persona === Persona.Dealer);
  const nationalGrowerRecords = nationalDealerRecords.map(r => ({...r, persona: Persona.Grower }));
  return [...records, ...nationalGrowerRecords];
};

export const getLocations = async locationId => {
  const url = `${process.env.hybris_location_hierarchy_api}/${locationId}/accountHierarchy?excludeAddress=false`;
  console.log(url);
  return getApi(url);
};

export const getLocationDetails = async (locationid, sourceSystem) => {
  const url = `${process.env.akana_url}/restricted-access-api/party-instances?type=${sourceSystem}&value=${locationid}`;
  return getApi(url);
};

export const getLocationPartnerFunctions = async (locationid, sourceSystem) => {
  const url = `${process.env.akana_url}/persistence/identifiers/${sourceSystem}/${locationid}/partner-function`;
  const { data } = await getApi(url);
  return data.partnerFunctions;
}

export const getLocationPayerStatus = async (locationid, sourceSystem) => {
  try {
    const partnerFunctions = await getLocationPartnerFunctions(locationid, sourceSystem);

    let records = [];
    try {
        // Get portal parameter definitions 
        const portalDataReponse = await getPortalParams();
        const portalData: PortalParameters[] = Object.keys(portalDataReponse).map(key => portalDataReponse[key]);

        // Filter Partner Function Data by Payer code and get portal parameter matching data 
        records = partnerFunctions
          .filter(r => r.relationship === 'accountToAccount' &&
            r.partnerFunctionCode === 'RG' &&
            r.partnerFunctionIdValue === locationid)
          .map(r => getPortalsByPartnerFunctionData(portalData, r.salesOrganizationCode,
            r.distributionChannelCode,
            r.divisionCode))
          .filter(x => x.length > 0)
          .map(t => ({
              brand: t[0].brand,     
              persona: t[0].persona,
              lob: t[0].lobRecordName,
              country: t[0].country,
              portal: t[0].portalUrl,
          }));        

    }
    catch(pe) {
      console.error(`Could not convert portal params to feature set attributes: ${locationid} - ${pe.message}`)
    }
    
    /* CUSTOM IMPLEMENTATION FOR NB
     * ALL ACCOUNTS THAT ARE PAYER FOR
     * DEALER SHOULD BE PAYER FOR GROWER */
    const payerStatus = addNationalGrowerRecords(records);
    return payerStatus;
  } catch (e) {
    console.error(`Could not get partner functions for SAP ID: ${locationid} - ${e.message}`)
    throw new TypedError(ErrorTypes.INTERNAL_SERVER_ERROR, `Could not get partner functions for SAP ID: ${locationid} - ${e.message}`)
  }
}

export const getCu360Hierarchy = async glopid => {
  const url = `${process.env.akana_url}/persistence/party-instances/${glopid}/hierarchies/CUSTSD/parents`;
  return getApi(url);
};

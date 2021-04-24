import { PortalParameters } from '../rest/types';
import { getApi } from './location.service.utils';
import { portalMap } from './constants'

export const getPortalParams = async () => {
  const url = `${process.env.akana_url}/c7-portal-parameters-api/v1/portal-parameters`;
  const { data } = await getApi(url);
  return data;
};

export const getPortalParamsByPortal = async (portal:string) => {
  const url = `${process.env.akana_url}/c7-portal-parameters-api/v1/country/${portalMap[portal]['country']}/brand/${portalMap[portal]['brand']}/persona/${portalMap[portal]['persona']}`;

  console.log(`URL ${url}`);
  const { data } = await getApi(url);
  const keys = Object.keys(data);
  const portalParams = data[keys[0]];
  return {
    isHierarchyValid: portalParams.hierarchyApplicable,
    hierarchyMap: portalParams.sourceSystem,
  }
}

export const getLob = (record: PortalParameters, inputLob: string) => record.lob.find(x => x.code === inputLob).name;


export const getPortalsByPartnerFunctionData = (portalData: PortalParameters[],
  inputSalesOrgCode: string,
  inputDistributionChannelCode: string,
  inputLob: string) => {

  // Retrieve portal parameters by input parameters
  const returnList: PortalParameters[] = portalData.filter(record => record.salesOrganizationCodes.includes(inputSalesOrgCode) &&
                                                  record.distributionChannelCodes.includes(inputDistributionChannelCode) &&
                                                  record.lob.filter(l => l.code === inputLob))
    .map(x => ({
      ...x,
      lobRecordName: getLob(x, inputLob),
    }));

  return returnList;
};
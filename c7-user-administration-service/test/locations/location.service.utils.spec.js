import * as utils from '../../src/server/v1/locations/location.service.utils';
import * as portalutils from '../../src/server/v1/locations/portal.parameters';

import {
  payer as PAYER,
  nonpayer as NONPAYER,
  portaldata as PORTALDATA
} from './data';

jest.mock('../../src/server/v1/locations', () => ({
  getPortalsByPartnerFunctionData: jest.fn(),
}));

describe('getLocationPayerStatus', () => {
  it('should return brand lob and persona for payer locations', async () => {
    jest.spyOn(utils, 'getLocationPartnerFunctions').mockImplementationOnce(() => Promise.resolve(PAYER));
    jest.spyOn(portalutils, 'getPortalParams').mockImplementationOnce(() => Promise.resolve(PORTALDATA));
    const result = await utils.getLocationPayerStatus('0001860089');
    expect(result).toStrictEqual([{"brand": "national", "country": "us", "lob": "seed", "persona": "dealer", "portal": "portal-url-test3"}, {"brand": "national", "country": "us", "lob": "seed", "persona": "grower", "portal": "portal-url-test3"}]);
  });

  it('should return empty array for nonpayer locations', async () => {
    jest.spyOn(utils, 'getLocationPartnerFunctions').mockImplementationOnce(() => Promise.resolve(NONPAYER));
    jest.spyOn(portalutils, 'getPortalParams').mockImplementationOnce(() => Promise.resolve(PORTALDATA));
    const result = await utils.getLocationPayerStatus('0001696831');
    expect(result).toStrictEqual([])
  });
});
import {getPortalsByPartnerFunctionData, getLob}
  from '../../src/server/v1/locations/portal.parameters';
import { PortalParameters } from '../../src/server/v1/rest/types';


const samplePortalParameterData = [ 
  { 
    country: 'country test1',
    brand: 'brand test1',
    persona: 'persona test1',
    portalUrl: 'portal-url-test1',
    lob: [{ code: '17', name: 'seed' }],
    salesOrganizationCodes: ['1', '2'],
    distributionChannelCodes: ['3', '4'],
    lobRecordName: '',
  },
  { 
    country: 'country test2',
    brand: 'brand test2',
    persona: 'persona test2',
    portalUrl: 'portal-url-test2',
    lob: [{ code: '17', name: 'seed' }],
    salesOrganizationCodes: ['US30', '22'],
    distributionChannelCodes: ['90', '44'],
    lobRecordName: '',
  },
  { 
    country: 'country test3',
    brand: 'brand test3',
    persona: 'persona test3',
    portalUrl: 'portal-url-test3',
    lob: [{ code: '17', name: 'seed' }, { code: '15', name: 'cp' }],
    salesOrganizationCodes: ['US20', '222'],
    distributionChannelCodes: ['90', '444'],
    lobRecordName: '',
  },
 ]; 

describe('portalparams', () => {
  it('getPortalParams when sales org, dist channel, lob is not found', async () => {

  const actual = await getPortalsByPartnerFunctionData(samplePortalParameterData, 'US20', 'b', 'c');
  const expected = [];
  expect(actual).toEqual(expected);

  });
});

describe('portalparams', () => {
  it('getPortalParams when sales org, dist channel, lob is found', async () => {

  const actual = await getPortalsByPartnerFunctionData(samplePortalParameterData, 'US20', '90', '17');
  const expected = [{ 
    country: 'country test3',
    brand: 'brand test3',
    persona: 'persona test3',
    portalUrl: 'portal-url-test3',
    lob: [{ code: '17', name: 'seed' }, { code: '15', name: 'cp' }],
    salesOrganizationCodes: ['US20', '222'],
    distributionChannelCodes: ['90', '444'],
    lobRecordName: 'seed',
  }];
  expect(actual).toEqual(expected);

  });
});

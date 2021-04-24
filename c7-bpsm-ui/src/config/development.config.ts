import {APIService, APIPersona, AdminType} from '../types';

export default {
  api: {
    registration: (adminType: AdminType) =>  `https://c7-${adminType}-registration-service.velocity-np.ag`,
    services: (persona: APIPersona, api: APIService) =>
      // tslint:disable-next-line:max-line-length
      persona === 'internal' ? `https://internal-${api}-api.velocity-np.ag/v1` : `https://${persona}-${api}-api-np.agro.services/v1`
  }
};

import {APIService, APIPersona, AdminType} from '../types';

export default {
  api: {
    registration: (adminType: AdminType) =>  `https://c7-${adminType}-registration-service.velocity.ag`,
    services: (persona: APIPersona, api: APIService) =>
      // tslint:disable-next-line:max-line-length
      persona === 'internal' ? `https://internal-${api}-api.velocity.ag/v1` : `https://${persona}-${api}-api.agro.services/v1`,
  }
};

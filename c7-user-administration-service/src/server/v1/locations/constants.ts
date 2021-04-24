import { Brand, LOB, Persona } from '../rest/types';

export const salesOrganizationCodes = {
  'US01': Brand.National,  // CP
  'US20': Brand.National,
  'US31': Brand.Channel,
};
export const distributionChannelCodes = {
  '80': Persona.Grower,
  '90': Persona.Dealer,
};
export const divisionCodes = {
  '15': LOB.CropProtection,
  '17': LOB.Seed,
};

export const portalMap = {
  'mycrop': {
    brand: 'national',
    persona: 'dealer',
    country: 'US'
  },
  'seedsmansource': {
    brand: 'national',
    persona: 'channel',
    country: 'US'
  },
  'dekalbasgrowdeltapine': {
    brand: 'national',
    persona: 'grower',
    country: 'US'
  },
  'brazil': {
    brand: 'bayer',
    persona: '*',
    country: 'BR'
  },
  'channelgrower': {
    brand: 'channel',
    persona: 'grower',
    country: 'US'
  },
  'fontanelle': {
    brand: 'fontanelle',
    persona: '*',
    country: 'US'
  },
  'goldcountryseed': {
    brand: 'goldcountry',
    persona: '*',
    country: 'US'
  },
  'hubnerseed': {
    brand: 'hubner',
    persona: '*',
    country: 'US'
  },
  'jungseedgenetics': {
    brand: 'jung',
    persona: '*',
    country: 'US'
  },
  'krugerseed': {
    brand: 'kruger',
    persona: '*',
    country: 'US'
  },
  'lewishybrids': {
    brand: 'lewis',
    persona: '*',
    country: 'US'
  },
  'rea-hybrids': {
    brand: 'rea',
    persona: '*',
    country: 'US'
  },
  'specialtyhybrids': {
    brand: 'specialty',
    persona: '*',
    country: 'US'
  },
  'stewartseeds': {
    brand: 'stewart',
    persona: '*',
    country: 'US'
  },
  'stoneseeds': {
    brand: 'stone',
    persona: '*',
    country: 'US'
  },
  'canada': {
    brand: 'bayer',
    persona: '*',
    country: 'CA'
  },
  'mexico': {
    brand: 'bayer',
    persona: '*',
    country: 'MX'
  },
}

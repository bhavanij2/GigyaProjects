import axios from 'axios';
import { uniqWith, isEqual } from 'lodash';
import { getUserInfoService } from '../v1/rest/users/users.persistence';
import generateBearerToken from './auth.utils';


const lobMap = {
  seed: {
    brandGroupName: 'national',
    accountType: 'dealer',
  },
  cp: {
    brandGroupName: 'Crop protection',
    accountType: 'ITO_Dealer',
  },
  bioag: {
    brandGroupName: 'national',
    accountType: 'BioAg',
  },
  acceleron: {
    brandGroupName: 'national',
    accountType: 'Seed Treatment',
  },
};

export const formatUserInfoForCu360 = user => {
  const { profile, locations } = user;

  const originalLinesOfBusiness = [];

  Object.keys(locations).forEach(key => {
    const { roles } = locations[key];
    Object.keys(roles).forEach(role => {
      const currentRole = roles[role];
      originalLinesOfBusiness.push({
        sapCustomerNumber: key,
        brandGroupName: lobMap[currentRole.lob].brandGroupName,
        accountType: lobMap[currentRole.lob].accountType,
      });
    });
  });

  const linesOfBusiness = uniqWith(originalLinesOfBusiness, isEqual);

  const address = {
    'usage-type': 'primary',
    'address-line-1': profile.address_line_1 || '',
    'address-line-2': profile.address_line_2 || '',
    'address-line-3': '',
    city: profile.city || '',
    region: profile.state || '',
    country: 'US',
    'postal-code': profile.zipCode || '',
  };

  const phones = [];
  if (profile.primary_phone) {
    phones.push({
      country: 'US',
      'usage-type': profile.primary_phone_type || '',
      number: profile.primary_phone,
    });
  }
  if (profile.secondary_phone) {
    phones.push({
      country: 'US',
      'usage-type': profile.secondary_phone_type || '',
      number: profile.secondary_phone,
    });
  }

  return {
    federationId: profile.federationId,
    marketingBrand: profile.brand,
    marketingPersona: profile.persona,
    firstName: profile.first_name,
    lastName: profile.last_name,
    phones,
    address,
    email: profile.id,
    linesOfBusiness,
  };
};

async function updateCu360(user) {
  try {
    const url = `${process.env.akana_url}/sfdc-contact-lookup/user`;
    const config = {
      headers: {
        Authorization: `Bearer ${await generateBearerToken()}`,
      },
    };
    await axios.put(url, user, config);
  }
  catch (e) {
    console.error('user account update error from Cu360:', e.response.data.message);
  }
}

export const getAndSendUserInfoToCu360 = async fedId => {
  const user = await getUserInfoService(fedId);
  const formattedUser = formatUserInfoForCu360(user);
  await updateCu360(formattedUser);
};

export const updateCu360Status = async (federationId, status) => {
  const isActive = status === 'active';
  try {
    const url = `${process.env.akana_url}/sfdc-contact-lookup/${federationId}/status?gigyaActive=${isActive}`;
    const config = {
      headers: {
        Authorization: `Bearer ${await generateBearerToken()}`,
      },
    };
    await axios.put(url, '', config);
  }
  catch (e) {
    console.error('status update error from Cu360:', e.response.data.message);
  }
};

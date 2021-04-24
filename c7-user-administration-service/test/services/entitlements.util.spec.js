import { createUserObj, createLocationObj } from '../../src/server/v1/entitlements/entitlements.util';

describe('Entitlements Util', () => {
  it('createUserObj creates a user object', () => {
    const body = {
      roleId: 'glb:*:dealer',
      sapAccountId: '123456',
      brand: 'NB',
      persona: 'dealer',
      userId: 'jsmith@gmail.com',
      userName: 'jsmith@gmail.com',
      hqSapId: '1022461',
      federationId: '1234-5678-9876',
      firstName: 'john',
      lastName: 'smith',
      addressLine1: '1234 This St.',
      addressLine2: '',
      city: 'St. Louis',
      state: 'MO',
      portal: 'mycrop',
      primaryPhone: '314-123-4567',
      primaryPhoneType: 'mobile',
      secondaryPhone: '',
      secondaryPhoneType: '',
      contactGlopid: '89012345',
      zip: '63122',
    };

    const result = createUserObj(body);
    expect(result).toEqual({
      id: 'jsmith@gmail.com',
      name: 'jsmith@gmail.com',
      hqSapId: '1022461',
      federationId: '1234-5678-9876',
      brand: 'NB',
      persona: 'dealer',
      portal: 'mycrop',
      first_name: 'john',
      last_name: 'smith',
      address_line_1: '1234 This St.',
      address_line_2: '',
      city: 'St. Louis',
      state: 'MO',
      country: 'US',
      primary_phone: '314-123-4567',
      primary_phone_type: 'mobile',
      secondary_phone: '',
      secondary_phone_type: '',
      contact_glopid: '89012345',
      zipCode: '63122',
      testUser: 'no',
    });
  });

  it('createLocationObj creates a location object', () => {
    const locationInfo = {
      locationName: 'A Dealer',
      streetAddress: '4567 Main St.',
      city: 'Farmington',
      state: 'MO',
      zipCode: '63640',
      hqSapId: '1022461',
    };

    const result = createLocationObj('1234567', locationInfo);
    expect(result).toEqual({
      sapid: '1234567',
      streetAddress: '4567 Main St.',
      city: 'Farmington',
      state: 'MO',
      zipCode: '63640',
      hqSapId: '1022461',
      name: 'A Dealer',
    });
  });
});

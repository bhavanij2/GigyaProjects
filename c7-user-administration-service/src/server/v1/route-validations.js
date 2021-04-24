const postUserRequirements = multiloc => (multiloc ? {
  path: '/users',
  method: 'POST',
  requiredFields: {
    string: [
      'federationId',
      'userId',
      'userName',
      'brand',
      'persona',
      'firstName',
      'lastName',
    ],
    array: ['locationRoles'],
  },
} : {
  path: '/users',
  method: 'POST',
  requiredFields: {
    string: [
      'federationId',
      'userId',
      'userName',
      'brand',
      'persona',
      'sapAccountId',
      'firstName',
      'lastName',
    ],
    array: ['roleIdList'],
  },
});

export default postUserRequirements;

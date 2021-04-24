import _ from 'lodash';

const findByAlias = alias => {
  let vcapServices = {};

  try {
    vcapServices = JSON.parse(process.env.VCAP_SERVICES || '{}');
  }
  catch (error) {
    console.error( 'unable to parse VCAP_SERVICES:\n', error ) //eslint-disable-line

    return {};
  }
  const userProvided = vcapServices['user-provided'];
  let service = { credentials: null };

  if (!_(userProvided).isUndefined()) {
    service = userProvided.find(ups => {
      if (!_(ups.credentials).isUndefined()) {
        return ups.credentials.alias === alias;
      }

      return false;
    });
    if (!_(alias).isUndefined()) {
      return service.credentials;
    }
  }

  return service;
};

export default findByAlias;

function alias(c) {
  if (!c.alias) return c;
  let EMPTY = {};
  EMPTY[c.alias] = c;
  return EMPTY;
}

const getServices = () => {
  try {
    const userProvided = JSON.parse(process.env.VCAP_SERVICES)['user-provided'];
    const credentials = userProvided.map(service => service.credentials)
      .reduce((credentials, cred) => ({...credentials, ...alias(cred)}), {});
    return credentials;
  } catch (e) {
    console.error(e.message);
    throw new Error('Unable to retrieve user-provided services');
  }
};

module.exports = {
  getServices,
};

require('@babel/register');

jest.mock('../src/server/v1/dynamo.util.js');
jest.mock('@monsantoit/console-elk', () => ({
  requestLoggingMiddleware: jest.fn(() => (req, res, next) => {
    return next();
  }),
  wrapConsoleWithElkHelper: jest.fn(() => (req, res, next) => {
    return next();
  })
}));

const ExpressMock = function ExpressMockFactory(req = {}, res = {}) {
  const mock = {
    req: {
      headers: {},
      userProfile: {},
      body: {},
      params: {},
      ...req,
    },
    res: {
      status: jest.fn().mockImplementation(() => {
        return mock.res;
      }),
      send: jest.fn(),
      ...res,
    }
  }

  return mock;
};

global.ExpressMock = ExpressMock;
global.console.error = jest.fn(); // suppress error messages

global.velocity = {
  authHeader: () => {},
  serviceBindings: require('../src/server/defaultBindings').defaults, // eslint-disable-line
};

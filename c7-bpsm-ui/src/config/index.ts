import { EnvironmentName } from '../types';
import development from './development.config';
import production from './production.config';

const config = {
  development,
  production,
  test: development, // unit / e2e tests
};

export default (environmentName: EnvironmentName): any => config[environmentName];

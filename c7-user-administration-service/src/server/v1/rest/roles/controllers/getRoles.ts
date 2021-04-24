import { getRolesServices } from '../services';
import { removeEmptyValues } from '../../utils';

async function getRoles(params) {
  return getRolesServices(removeEmptyValues(params));
}

export default getRoles;

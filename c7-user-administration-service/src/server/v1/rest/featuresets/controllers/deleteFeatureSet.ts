import { deleteFeatureSetService } from '../services'

async function deleteFeatureSet(name) {
  return await deleteFeatureSetService(name);
}

export default deleteFeatureSet;
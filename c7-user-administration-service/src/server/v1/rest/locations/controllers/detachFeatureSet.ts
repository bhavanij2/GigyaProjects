import { detachFeatureSetService } from '../services'

async function detachFeatureSet(params) {
  return await detachFeatureSetService(params);
}

export default detachFeatureSet;
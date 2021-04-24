import { createFeatureSetService } from '../services'

async function createFeatureSet(body) {
  return await createFeatureSetService(body);
}

export default createFeatureSet;
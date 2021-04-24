import { attachFeatureSetService } from '../services'

async function attachFeatureSet(params) {
  return await attachFeatureSetService(params);
}

export default attachFeatureSet;
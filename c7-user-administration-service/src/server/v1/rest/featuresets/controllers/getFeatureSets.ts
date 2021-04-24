import { getFeatureSetsService } from '../services';

async function getFeatureSets() {
  return await getFeatureSetsService();
}

export default getFeatureSets;

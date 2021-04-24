import { changeLocationService } from '../services'

async function changeLocation(oldSapId, oldSourceSystem, changeLocationBody) {
  return await changeLocationService(oldSapId, oldSourceSystem, changeLocationBody);
}

export default changeLocation;
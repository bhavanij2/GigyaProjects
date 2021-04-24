import { writeTransactionReturnResult } from '../../../neo4j.utils';
import { changeLocationQuery, tempUpdateOldLocationName } from '../queries';
import { getLocation } from '../../../entitlements';

async function changeLocationService(oldSapId, oldSourceSystem, changeLocationBody) {
  const locationResult = await getLocation(changeLocationBody.newSapId, changeLocationBody.newSourceSystem) 
  // On a temporary basis append sap to name and city attributes for old location
  const oldLocationTransactionResult = await writeTransactionReturnResult(
    tempUpdateOldLocationName,
    {
        oldSapId,
        oldSourceSystem,
    })
  const transactionResult = await writeTransactionReturnResult(
    changeLocationQuery,
    {
        oldSapId,
        oldSourceSystem, 
        newSapId: changeLocationBody.newSapId,
        newSourceSystem: changeLocationBody.newSourceSystem,
    }
  );
  return transactionResult;
}

export default changeLocationService;

import Record from 'neo4j-driver/lib/v1/record';
import {
  conditionalUpdateLocationInfoQuery,
  updateLocationInfoQuery,
  fetchLocationsQuery,
} from './locations.queries';
import {
  writeTransactionReturnResult,
} from '../../neo4j.utils';
import { readTransaction } from '../../transaction/read';

import {
  getLocationInfo
} from '../../locations';

export const updateLocationInfoService = async (sapId, offset, sourceSystem) => {
  try {
    const { featureSets, ...info  } = await getLocationInfo(sapId, sourceSystem);
    const infoWithOffset = Object.assign({}, info, {offset});
    const result = await writeTransactionReturnResult(updateLocationInfoQuery, { sapId, info: infoWithOffset, featureSets });
    return { code: 200, message: 'SUCCESS', result : result.updateStatistics };
  } catch (e) {
    console.error(`Error while attempting to update location info ${e}`);
    return { code: 500, message: e.message };
  }
};

export const fetchLocationsService = async () => {
  const result = await readTransaction(fetchLocationsQuery());
  const locations = result.records.map(record => {
    const neoRecord = new Record(record.keys, record._fields, record._fieldLookup);
    const location = {
      sapId: neoRecord.get('sapId'),
      hqSapId: neoRecord.get('hqSapId'),
      name: neoRecord.get('name'),
      streetAddress: neoRecord.get('streetAddress'),
      city: neoRecord.get('city'),
      state: neoRecord.get('state'),
      zipCode: neoRecord.get('zipCode'),
      payer: neoRecord.get('payer'),
    };
    return location;
  });
  return { code: 200, message: locations };
};

export default {
  fetchLocationsService,
  updateLocationInfoService,
};

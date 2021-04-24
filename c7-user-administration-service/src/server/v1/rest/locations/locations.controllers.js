import getLobsFromHqSapId from './locations.persistence';
import {
  fetchLocationsService,
  updateLocationInfoService,
} from './locations.service';
import { getLocation } from '../../entitlements';

//TODO getLocation call, pass other params
export const getLobByHqSapId = async (req, res) => {
  if (req.query.persona !== 'grower') {
    const flattenedLocations = await getLobsFromHqSapId(req.params.hqSapId);
    res.status(200).send(flattenedLocations);
  } else {
    const location = await getLocation(req.params.hqSapId);
    const flattenedLocations = [{
      id: req.params.hqSapId,
      name: location.locationName,
      level: 'HQ',
      lob: [ 'seed' ],
      parentId: '0',
    }];
    res.status(200).send(flattenedLocations);
  }
};

export const updateLocationInfo = async (req, res) => {
  const { sapId } = req.params;
  const { offset } = req.body;
  const sourceSystem = req.body.sourceSystem ? req.body.sourceSystem : 'sap-customer-number'
  const result = await updateLocationInfoService(sapId, offset, sourceSystem);
  res.status(result.code).send(result);
};

export const fetchLocations = async (req, res) => {
  const result = await fetchLocationsService();
  res.status(200).send(result);
};

export default {
  fetchLocations,
  getLobByHqSapId,
  updateLocationInfo,
};

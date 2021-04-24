import { LocationData } from "../types";
import { getHqLocations } from "../../../locations/location.service.utils";

async function getAllHqs(): Promise<LocationData[]> {
  const hybrisResponse = await getHqLocations();

  let result: LocationData[] = [];
  if (hybrisResponse.accounts && hybrisResponse.accounts.length > 0) {
    result = hybrisResponse.accounts.map(a => {
      return { id: a.sapAccountId, name: a.accountName };
    });
  }

  return result;
}

export default getAllHqs;

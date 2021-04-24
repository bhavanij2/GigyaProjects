import { getUsersLocationHierarchy, flattenLocations } from '.';

const getFlattentedUsersLocationHierarchy = async userId => {
  const locationMap = new Map();
  const locationsHierarchy = await getUsersLocationHierarchy(userId);
  const flattenedLocations = flattenLocations(locationsHierarchy);
  const combineLobs = location => {
    if (locationMap.has(location.id)) {
      const priorLocation = locationMap.get(location.id);
      const newLobs = new Set(priorLocation.lob.concat(location.lob));
      priorLocation.lob = Array.from(newLobs);
      locationMap.set(priorLocation.id, priorLocation);
    }
    else {
      locationMap.set(location.id, location);
    }
  };
  flattenedLocations
    .map(location => combineLobs(location));
  return Array.from(locationMap.values())
    .map(location => {
        const { children, ...locationWithoutChildren } = location; //eslint-disable-line
      return locationWithoutChildren;
    });
};

export default getFlattentedUsersLocationHierarchy;

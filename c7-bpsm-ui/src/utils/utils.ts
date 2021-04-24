import shiro from 'shiro-trie';

import { LocationData } from '../types';
import { ROLE_MAP, } from './constants';

export function formatLocationInfo(location: LocationData): string {
  return location && location.name ?
    `${formatSapId(location.id)} - ${location.name}` :
    location.id;
}

export function getLocationNameFromFormattedLocation(locationIdName: string): string {
  const idName = locationIdName.split('-');
  return idName.length === 2 ? idName[1].trim() : locationIdName;
}

export function getErrorMessage(itemName: string, httpStatus: number) {
  let message;

  // eslint-disable-no-fallthrough
  // Translate once we support multiple languages
  switch (httpStatus) {
    case 400: // bad request
      message = `Error requesting the ${itemName}.`;
      break;
    case 401: // unauthorized
      message = `Not signed in while requesting the ${itemName}.`;
      break;
    case 403: // forbidden
      message = `Server forbids requesting the ${itemName}.`;
      break;
    case 404: // not found
      message = `The server could not find the ${itemName}.`;
      break;
    case 408: // request timeout
      message = `Timeout requesting the ${itemName}.`;
      break;
    case 500: // server error
    case 502: // bad gateway
      message = `The server had a problem with the ${itemName}.`;
      break;
    case 503: // service unavailable
      message = `The server is currently unavailable for the ${itemName}.`;
      break;
    default:
      message = `Problem getting the ${itemName}`;
  }

  const error = new Error(message);
  error.name = httpStatus.toString();
  return error;
}

export function getEnv(): string {
  const environmentNameNode = document.querySelectorAll('meta[name="env"]');
  const key = 'content';

  return environmentNameNode.length ? environmentNameNode[0].attributes[key].value : 'production';
}

export function getRoleId(role: any): string {
  return `glb:${role.lob}:${ROLE_MAP[role.name]}`;
}

export function isLocalhost() {
  const hostname = window.location.hostname;
  const regEx = new RegExp(
    [/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\.){3}/, /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/]
      .map(r => r.source)
      .join('')
  );
  return regEx.test(hostname) || hostname === 'localhost' || hostname === 'local';
}

export function getLocationEntitlements(entitlements: object): string[] {
  const locationEntitlements: string[] = [];
  Object.keys(entitlements).forEach(location => {
    locationEntitlements.push.apply(locationEntitlements,
      entitlements[location].map( (entitlement: string) => `${location}:${entitlement}`));
  });
  return locationEntitlements;
}

export function isAdminAtLocation(adminLocations: any, id: any, lob: any) {
  return adminLocations.some(( loc: any ) => loc.id === id && loc.lob.includes(lob));
}

function getFlattenedPermissions(entitlements: any): string[] {
  const flat: string[] = [];
  for (const country in entitlements) {
    const brands = entitlements[country];
    for (const brand in brands) {
      const personas = brands[brand];
      for (const persona in personas) {
        const permissions = personas[persona];
        for (const permission of permissions) {
          if (!flat.includes(permission)) { flat.push(permission); }
        }
      }
    }
  }
  return flat;
}

export function getInternalPermissionsTrie(entitlements: any, context?: any) {
  const trie = shiro.newTrie();
  // checking global permissions vs specific
  if (!context) {
    const permissions = getFlattenedPermissions(entitlements);
    // @ts-ignore
    trie.add(permissions);
  }
  else {
    const { brand, country, persona } = context;
    if (entitlements &&
        entitlements[country] &&
        entitlements[country][brand] &&
        entitlements[country][brand][persona]) {
      const permissions = entitlements[country][brand][persona];
      trie.add(permissions);
    }
  }
  return trie;
}

// What combinations of brand, persona, country do you have a given permission for?
export function getInternalPermissionContexts(entitlements: any, permission: string) {
  const combinations: any = [];
  const reg = new RegExp(permission.replace(/[\$, \*]/g, '\\w*'));
  for (const country in entitlements) {
    const brands = entitlements[country];
    for (const brand in brands) {
      const personas = brands[brand];
      for (const persona in personas) {
        const permissions = personas[persona];
        for(const p of permissions) {
          if (p.match(reg)) {
            const lob = p.split(':')[0];
            combinations.push({brand, country, persona, lob});
          }
        }
      }
    }
  }

  return combinations;
}

// what brands, personas, or countries do you have a given permission for?
export function getInternalPermissionProperty(entitlements: any, property: string, permission: string) {
  const contexts = getInternalPermissionContexts(entitlements, permission);
  return contexts.map((c:any) => c[property])
    .filter((c: string, index: number, self: string[]) => self.indexOf(c) === index);
}

export function filterAutocompleteList(word: string, query: string) {
  return word.toUpperCase().includes(query.toUpperCase());
}

export function isInternalAdminType(adminType: string) : boolean {
  return adminType === 'Internal';
}

export function formatSapId(sapId: string) {
  return Number(sapId).toString();
}

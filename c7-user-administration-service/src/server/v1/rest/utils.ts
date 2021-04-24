import { QueryTypeMap } from './types';

const oauth = require('@monsantoit/oauth-ping');

const getContainsParamConditional = (value, key, prop, and = false) => (
  value ?
    `${and ? 'AND' : 'WHERE'} toLower(${key}.${prop}) CONTAINS toLower("${value}")` :
    ''
);

const getBooleanParamConditional = (value, key, prop, and = false) => (
  value && value !== 'false' ?
    `${and ? 'AND' : 'WHERE'} ${key}.${prop}=${value}` :
    `${and ? 'AND' : 'WHERE'} (${key}.${prop}=${value} OR NOT EXISTS(${key}.${prop}))`
);

const getExactParamConditional = (value, key, prop, and = false) => (
  value ?
    `${and ? 'AND' : 'WHERE'} toLower(${key}.${prop})=toLower("${value}")` :
    ''
);

const getYesNoParamConditional = (value, key, prop, and = false) => (
  value && value !== 'no' ?
    `${and ? 'AND' : 'WHERE'} ${key}.${prop}="yes"` :
    `${and ? 'AND' : 'WHERE'} (${key}.${prop}="no" OR NOT EXISTS(${key}.${prop}))`
);

const getArrayParamConditional = (value, key, prop, and = false) => {
  if (!value) return '';
  const arr = value.split(',').map(e => e.toLowerCase());
  const str = `"${arr.join('","')}"`;
  return `${and ? 'AND' : 'WHERE'} toLower(${key}.${prop}) IN [${str}]`;
};

const BOOLEAN_FIELDS = ['internal'];
const EXACT_FIELDS = [];
const ARRAY_FIELDS = ['status', 'brand', 'persona', 'country'];
// TODO: Refactor this field to boolean type
const YESNO_FIELDS = ['testUser'];
const FIELD_TYPES = [
  { type: 'array', values: ARRAY_FIELDS },
  { type: 'boolean', values: BOOLEAN_FIELDS },
  { type: 'exact', values: EXACT_FIELDS },
  { type: 'yesno', values: YESNO_FIELDS },
];

export const translators = {
  boolean: getBooleanParamConditional,
  contains: getContainsParamConditional,
  exact: getExactParamConditional,
  array: getArrayParamConditional,
  yesno: getYesNoParamConditional,
};

export const getTranslator = (field: string, mapping: QueryTypeMap[]): Function => {
  const fieldType = mapping.reduce((prev: string, type: QueryTypeMap) => {
    if (type.values.includes(field)) {
      return type.type;
    }
    return prev;
  }, 'contains');
  return translators[fieldType] || translators.contains;
};

export const conditionalStringsFrom = (conditionals, AND, abbrv, translatorMap = FIELD_TYPES) => {
  const conditionalStrings = Object.keys(conditionals).reduce((a, c) => {
    const neo4jClauseTranslator = getTranslator(c, translatorMap);
    const str = neo4jClauseTranslator(conditionals[c], abbrv, c, AND);
    AND = AND || str.length > 0;
    a[c] = str;
    return a;
  }, {});

  return [conditionalStrings, AND];
};

export function removeEmptyValues(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const _acc = acc;
    if (obj[key] !== undefined) _acc[key] = obj[key];
    return _acc;
  }, {});
}

export async function getAuthToken() {
  const getToken = oauth.httpGetToken({
    clientId: process.env.client_id,
    clientSecret: process.env.client_secret,
    url: process.env.PING_URL,
    autoRefresh: true,
  });
  return getToken();
}

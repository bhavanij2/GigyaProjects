const ROLE_BOOLEAN_FIELDS = ['internal', 'beta'];
const ROLE_EXACT_FIELDS = ['id', 'country', 'lob'];
const ROLE_ARRAY_FIELDS = ['brand', 'persona'];
export const ROLE_FIELD_TYPES = [
  { type: 'array', values: ROLE_ARRAY_FIELDS },
  { type: 'boolean', values: ROLE_BOOLEAN_FIELDS },
  { type: 'exact', values: ROLE_EXACT_FIELDS },
];

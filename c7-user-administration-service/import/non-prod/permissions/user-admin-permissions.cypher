// user-admin-permissions.cypher
// adds user-admin app permissions



CREATE
  (:Permission {application: 'user-admin', action: 'users', id: 'seed:user-admin:users',      lob: 'seed'}),
  (:Permission {application: 'user-admin', action: 'users', id: 'cp:user-admin:users',        lob: 'cp'}),
  (:Permission {application: 'user-admin', action: 'users', id: 'acceleron:user-admin:users', lob: 'acceleron'}),
  (:Permission {application: 'user-admin', action: 'users', id: 'bioag:user-admin:users',     lob: 'bioag'}),

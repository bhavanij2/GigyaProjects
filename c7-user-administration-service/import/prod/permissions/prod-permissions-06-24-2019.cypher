CREATE
  (:Permission {id: "seed:myaccount:inventory-top-longs", lob: "seed", application: "myaccount", action: "inventory-top-longs", type: "widget"}),
  (:Permission {id: "seed:myaccount:inventory-top-shorts", lob: "seed", application: "myaccount", action: "inventory-top-shorts", type: "leftNav"}),
  (:Permission {id: "seed:myaccount:order-long", lob: "seed", application: "myaccount", action: "order-long", type: "widget"}),
  (:Permission {id: "seed:myaccount:order-short", lob: "seed", application: "myaccount", action: "order-short", type: "widget"}),
  (:Permission {id: "seed:myaccount:channel-restricted-recalled", lob: "seed", application: "myaccount", action: "channel-restricted-recalled", type: "widget"}),
  (:Permission {id: "seed:finance:account-number", lob: "seed", application: "finance", action: "account-number", type: "widget"});

MATCH (p:Permission {id: "seed:finance:payment"}), (r:Role {id: "glb:seed:nbfarm"}) CREATE (r)-[h:HAS_PERMISSION {type: "read"}]->(p);
MATCH (p:Permission {id: "seed:finance:account-number"}), (r:Role {id: "glb:seed:nbfarm"}) CREATE (r)-[h:HAS_PERMISSION {type: "read"}]->(p);
MATCH (p:Permission {id: "seed:finance:account-number"}), (r:Role {id: "glb:seed:ba"}) CREATE (r)-[h:HAS_PERMISSION {type: "read"}]->(p);
MATCH (p:Permission {id: "seed:finance:account-number"}), (r:Role {id: "glb:seed:sm"}) CREATE (r)-[h:HAS_PERMISSION {type: "read"}]->(p);
MATCH (p:Permission {id: "seed:finance:account-number"}), (r:Role {id: "glb:seed:bashadow"}) CREATE (r)-[h:HAS_PERMISSION {type: "read"}]->(p);
MATCH (p:Permission {id: "seed:finance:account-number"}), (r:Role {id: "glb:seed:smshadow"}) CREATE (r)-[h:HAS_PERMISSION {type: "read"}]->(p);


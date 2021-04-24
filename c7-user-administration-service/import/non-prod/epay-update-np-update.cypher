MATCH (p:Permission {application: "finance", action: "account-activity"})-[hp:HAS_PERMISSION{type: "write"}]-(:Role)
SET hp.type = "read"
RETURN p.id as pID, hp.type as type;


MATCH (p:Permission {application: "finance", action: "grower-credit"})-[hp:HAS_PERMISSION{type: "write"}]-(:Role)
SET hp.type = "read"
RETURN p.id as pID, hp.type as type;


MATCH (p:Permission {application: "finance", action: "bill-pay", lob: "seed"})
SET p = { application:"finance", action: "payment", id:"seed:finance:payment", lob: "seed"}
RETURN p.id as pID, p.action as action, p.lob as lob;

MATCH (p:Permission {application: "finance", action: "bill-pay", lob: "bioag"})
SET p = { application:"finance", action: "payment", id: "bioag:finance:payment", lob: "bioag"}
RETURN p.id as pID, p.action as action, p.lob as lob;

MATCH (p:Permission {application: "finance", action: "bill-pay", lob: "acceleron"})
SET p = { application:"finance", action:"payment", id:"acceleron:finance:payment", lob: "acceleron"}
RETURN p.id as pID, p.action as action, p.lob as lob;

MATCH (p:Permission {application: "finance", action: "bill-pay", lob: "cp"})
SET p = { application:"finance", action:"payment", id: "cp:finance:payment", lob: "cp"}
RETURN p.id as pID, p.action as action, p.lob as lob;


MATCH (p:Permission {application: "finance", action: "statements"})-[hp:HAS_PERMISSION{type: "write"}]-(:Role)
SET hp.type = "read"
RETURN p.id as pID, hp.type as type;


MATCH (p:Permission {application: "finance", action: "payment-history"})-[hp:HAS_PERMISSION{type: "write"}]-(:Role)
SET hp.type = "read"
RETURN p.id as pID, hp.type as type;



MATCH (p:Permission {application: "finance", action: "account-credit", lob: "seed"})-[hp:HAS_PERMISSION{type: "write"}]-(:Role)
SET hp = { type: "read"} 
SET p = { action:"farmflex-credit", id: "seed:finance:farmflex-credit", lob: "seed", application: "finance"}
RETURN p.id as pID, hp.type as type, p.action as action;

MATCH (p:Permission {application: "finance", action: "account-credit", lob: "bioag"})-[hp:HAS_PERMISSION{type: "write"}]-(:Role)
SET hp = { type: "read"} 
SET p = { action:"farmflex-credit", id: "bioag:finance:farmflex-credit", lob: "bioag", application: "finance"}
RETURN p.id as pID, hp.type as type, p.action as action;

MATCH (p:Permission {application: "finance", action: "account-credit", lob: "acceleron"})-[hp:HAS_PERMISSION{type: "write"}]-(:Role)
SET hp = { type: "read"} 
SET p = { action:"farmflex-credit", id: "acceleron:finance:farmflex-credit", lob: "acceleron", application: "finance"}
RETURN p.id as pID, hp.type as type, p.action as action;


CREATE
  (:Permission {application: 'finance', action: 'payment-profile', id: 'seed:finance:payment-profile',      lob: 'seed'}),
  (:Permission {application: 'finance', action: 'payment-profile', id: 'bioag:finance:payment-profile',     lob: 'bioag'}),
  (:Permission {application: 'finance', action: 'payment-profile', id: 'acceleron:finance:payment-profile', lob: 'acceleron'}),
  (:Permission {application: 'finance', action: 'payment-profile', id: 'cp:finance:payment-profile',        lob: 'cp'});


CREATE
  (:Permission {application: 'finance', action: 'dashboard', id: 'seed:finance:dashboard',      lob: 'seed'}),
  (:Permission {application: 'finance', action: 'dashboard', id: 'bioag:finance:dashboard',     lob: 'bioag'}),
  (:Permission {application: 'finance', action: 'dashboard', id: 'acceleron:finance:dashboard', lob: 'acceleron'}),
  (:Permission {application: 'finance', action: 'dashboard', id: 'cp:finance:dashboard',        lob: 'cp'});
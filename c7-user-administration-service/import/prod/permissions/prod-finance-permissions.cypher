  
CREATE
  (:Permission {application: 'finance', action: 'payment-history', id: 'seed:finance:payment-history',      lob: 'seed'}),
  (:Permission {application: 'finance', action: 'payment-history', id: 'bioag:finance:payment-history',     lob: 'bioag'}),
  (:Permission {application: 'finance', action: 'payment-history', id: 'acceleron:finance:payment-history', lob: 'acceleron'}),
  (:Permission {application: 'finance', action: 'payment-history', id: 'cp:finance:payment-history',        lob: 'cp'});

CREATE
  (:Permission {application: 'finance', action: 'statements', id: 'seed:finance:statements',      lob: 'seed'}),
  (:Permission {application: 'finance', action: 'statements', id: 'bioag:finance:statements',     lob: 'bioag'}),
  (:Permission {application: 'finance', action: 'statements', id: 'acceleron:finance:statements', lob: 'acceleron'}),
  (:Permission {application: 'finance', action: 'statements', id: 'cp:finance:statements',        lob: 'cp'});

CREATE
  (:Permission {application: 'finance', action: 'payment', id: 'seed:finance:payment',       lob: 'seed'}),
  (:Permission {application: 'finance', action: 'payment', id: 'bioag:finance:payment',      lob: 'bioag'}),
  (:Permission {application: 'finance', action: 'payment', id: 'acceleron:finance:payment',  lob: 'acceleron'}),
  (:Permission {application: 'finance', action: 'payment', id: 'cp:finance:payment',         lob: 'cp'});

  CREATE
  (:Permission {application: 'finance', action: 'farmflex-credit', id: 'seed:finance:farmflex-credit',     lob: 'seed'}),
  (:Permission {application: 'finance', action: 'farmflex-credit', id: 'bioag:finance:farmflex-credit',    lob: 'bioag'}),
  (:Permission {application: 'finance', action: 'farmflex-credit', id: 'acceleron:finance:farmflex-credit',lob: 'acceleron'});
CREATE
  (:Permission {application: 'finance', action: 'account-activity', id: 'seed:finance:account-activity',      lob: 'seed'}),
  (:Permission {application: 'finance', action: 'account-activity', id: 'cp:finance:account-activity',        lob: 'cp'}),
  (:Permission {application: 'finance', action: 'account-activity', id: 'acceleron:finance:account-activity', lob: 'acceleron'}),
  (:Permission {application: 'finance', action: 'account-activity', id: 'bioag:finance:account-activity',     lob: 'bioag'});

CREATE
  (:Permission {application: 'finance', action: 'grower-credit', id: 'seed:finance:grower-credit',       lob: 'seed'}),
  (:Permission {application: 'finance', action: 'grower-credit', id: 'cp:finance:grower-credit',        lob: 'cp'}),
  (:Permission {application: 'finance', action: 'grower-credit', id: 'acceleron:finance:grower-credit', lob: 'acceleron'}),
  (:Permission {application: 'finance', action: 'grower-credit', id: 'bioag:finance:grower-credit',     lob: 'bioag'});

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
  (:Permission {application: 'finance', action: 'payment-history', id: 'seed:finance:payment-history',      lob: 'seed'}),
  (:Permission {application: 'finance', action: 'payment-history', id: 'bioag:finance:payment-history',     lob: 'bioag'}),
  (:Permission {application: 'finance', action: 'payment-history', id: 'acceleron:finance:payment-history', lob: 'acceleron'}),
  (:Permission {application: 'finance', action: 'payment-history', id: 'cp:finance:payment-history',        lob: 'cp'});

  CREATE
  (:Permission {application: 'finance', action: 'guest-pay', id: 'seed:finance:guest-pay',      lob: 'seed'}),
  (:Permission {application: 'finance', action: 'guest-pay', id: 'bioag:finance:guest-pay',     lob: 'bioag'}),
  (:Permission {application: 'finance', action: 'guest-pay', id: 'acceleron:finance:guest-pay', lob: 'acceleron'}),
  (:Permission {application: 'finance', action: 'guest-pay', id: 'cp:finance:guest-pay',        lob: 'cp'});
    
  CREATE
  (:Permission {application: 'finance', action: 'farmflex-credit', id: 'seed:finance:farmflex-credit',     lob: 'seed'}),
  (:Permission {application: 'finance', action: 'farmflex-credit', id: 'bioag:finance:farmflex-credit',    lob: 'bioag'}),
  (:Permission {application: 'finance', action: 'farmflex-credit', id: 'acceleron:finance:farmflex-credit',lob: 'acceleron'});


//
// You can use this query to generate the CREATE statements for existing ones
// CALL db.constraints() YIELD description
// RETURN 'CREATE ' + description + ';' ;

//
// Drop Constraints
//

DROP CONSTRAINT ON ( location:Location ) ASSERT location.sapid IS UNIQUE;
DROP CONSTRAINT ON ( permission:Permission ) ASSERT permission.id IS UNIQUE;
DROP CONSTRAINT ON ( role:Role ) ASSERT role.id IS UNIQUE;
DROP CONSTRAINT ON ( user:User ) ASSERT user.federationId IS UNIQUE;
DROP CONSTRAINT ON ( featureset:FeatureSet ) ASSERT featureset.name IS UNIQUE;

//
// Add constraints
//
CREATE CONSTRAINT ON ( location:Location ) ASSERT location.sapid IS UNIQUE;
CREATE CONSTRAINT ON ( permission:Permission ) ASSERT permission.id IS UNIQUE;
CREATE CONSTRAINT ON ( role:Role ) ASSERT role.id IS UNIQUE;
CREATE CONSTRAINT ON ( user:User ) ASSERT user.federationId IS UNIQUE;
CREATE CONSTRAINT ON ( featureset:FeatureSet ) ASSERT featureset.name IS UNIQUE;


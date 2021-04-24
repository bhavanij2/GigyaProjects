cat ./import/prod/prod-default-roles.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/prod/permissions/prod-finance-permissions.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/prod/role-permission-relationships/prod-farmer-owner-national.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/prod/prod-constraints.cypher | cypher-shell -u neo4j -p $1 --format plain

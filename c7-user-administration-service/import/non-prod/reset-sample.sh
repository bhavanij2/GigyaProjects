#!/usr/bin/env bash

# delete everything and add some sample users/locations/entitlements
cat ./import/non-prod/sample-data-import.cypher | cypher-shell -u neo4j -p $1 --format plain

# add constraints
cat ./import/non-prod/constraints.cypher | cypher-shell -u neo4j -p $1 --format plain

# import roles
cat ./import/non-prod/default-roles.cypher | cypher-shell -u neo4j -p $1 --format plain

# import permissions
cat ./import/non-prod/permissions/user-admin-permissions.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/permissions/finance-permissions.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/permissions/myaccount-permissions.cypher | cypher-shell -u neo4j -p $1 --format plain

# import role-permission relationships
cat ./import/non-prod/role-permission-relationships/admin.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/site-manager.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/office-manager.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/warehouse.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/sales.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/finance.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/agronomy.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/marketing.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/farmer-owner-national.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/farmer-owner-channel.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/guest.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/branch-account.cypher | cypher-shell -u neo4j -p $1 --format plain
cat ./import/non-prod/role-permission-relationships/channel-seedsman.cypher | cypher-shell -u neo4j -p $1 --format plain



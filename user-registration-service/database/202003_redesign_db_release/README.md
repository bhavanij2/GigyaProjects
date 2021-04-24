# 20190715 release - README.md
# Run the following DDL Scripts
## Script Execution Order

1. sequence.userlocationrole_1.sql  
2. table.public.user_location_role_1.sql
3. user_location_role_data_migration_step_1.sql

### Verify that the old data is copied to the temp table correctly then continue to the next steps

4. drop_user_location_role.sql
5. sequence.userlocationrole.sql
6. table.public.user_location_role.sql
7. user_location_role_data_migration_step_2.sql

### Verify that the data from temp table (user_location_role_1) is copied to the new table correctly then continue to the next steps
8. drop_temp_table_sequence.sql


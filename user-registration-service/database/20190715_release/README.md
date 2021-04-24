# 20190715 release - README.md

## Script Execution Order
1. alter_table.public.user_contact.sql      # DDL
2. alter_table.public.user.sql              # DDL
3. seed_data.public.email_template.sql      # DML
4. table.public.location.sql                # DDL
5. table.public.role.sql                    # DDL
6. table.public.location_role.sql           # DDL
7. table.public.user_location_role.sql      # DDL
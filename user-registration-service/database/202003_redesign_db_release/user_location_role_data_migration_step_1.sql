INSERT INTO public.user_location_role_1(id, user_id, sap_id, role_id, creation_timestamp, last_modified_timestamp)
select nextval('userlocationrole_id_sequence_1'), user_id, sap_id, role_id,  round( date_part( 'epoch', now() ) ), round( date_part( 'epoch', now() ) ) from user_location_role;

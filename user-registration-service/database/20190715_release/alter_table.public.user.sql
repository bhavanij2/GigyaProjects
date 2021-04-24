ALTER TABLE public."user" ADD COLUMN hq_sap_id varchar(255);

ALTER TABLE public."user" ALTER COLUMN sap_account_number DROP NOT NULL;
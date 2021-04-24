-- Table: public.location

-- DROP TABLE public.location;

CREATE TABLE public.location
(
    sap_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    hq_sap_id character varying(255) COLLATE pg_catalog."default",
    last_modified_timestamp bigint NOT NULL,
    creation_timestamp bigint NOT NULL,
    CONSTRAINT location_pkey PRIMARY KEY (sap_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.location
    OWNER to c7;

GRANT ALL ON TABLE public.location TO c7;

GRANT INSERT, SELECT, UPDATE ON TABLE public.location TO user_registration;
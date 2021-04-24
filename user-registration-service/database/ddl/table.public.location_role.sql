-- Table: public.location_role

-- DROP TABLE public.location_role;

CREATE TABLE public.location_role
(
    last_modified_timestamp bigint NOT NULL,
    creation_timestamp bigint NOT NULL,
    sap_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT location_role_pkey PRIMARY KEY (sap_id, role_id),
    CONSTRAINT role_id FOREIGN KEY (role_id)
        REFERENCES public.role (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT sap_id FOREIGN KEY (sap_id)
        REFERENCES public.location (sap_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.location_role
    OWNER to c7;

GRANT ALL ON TABLE public.location_role TO c7;

GRANT INSERT, SELECT, UPDATE ON TABLE public.location_role TO user_registration;
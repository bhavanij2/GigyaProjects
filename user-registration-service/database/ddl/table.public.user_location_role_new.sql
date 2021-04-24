-- Table: public.user_location_role

-- DROP TABLE public.user_location_role;

CREATE TABLE public.user_location_role
(
    id integer NOT NULL,
    user_id uuid NOT NULL,
    sap_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    creation_timestamp bigint NOT NULL,
    last_modified_timestamp bigint NOT NULL,

    CONSTRAINT ulr_id_pkay PRIMARY KEY (id),

    CONSTRAINT user_id_frnkey FOREIGN KEY (user_id)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,

	CONSTRAINT sap_id_frnkey FOREIGN KEY (sap_id)
        REFERENCES public."location" (sap_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,

    CONSTRAINT role_id_frnkey FOREIGN KEY (role_id)
        REFERENCES public."role" (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.user_location_role
    OWNER to c7;

GRANT ALL ON TABLE public.user_location_role TO c7;

GRANT INSERT, SELECT, UPDATE ON TABLE public.user_location_role TO user_registration;


-- Table: public.user_location_role

-- DROP TABLE public.user_location_role;

CREATE TABLE public.user_location_role
(
    user_id uuid NOT NULL,
    sap_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT user_location_role_pkey PRIMARY KEY (user_id, sap_id, role_id),
    CONSTRAINT location_role_id FOREIGN KEY (role_id, sap_id)
        REFERENCES public.location_role (role_id, sap_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public."user" (id) MATCH SIMPLE
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
-- Table: public.role

-- DROP TABLE public.role;

CREATE TABLE public.role
(
    last_modified_timestamp bigint NOT NULL,
    creation_timestamp bigint NOT NULL,
    role_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT role_pkey PRIMARY KEY (role_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.role
    OWNER to c7;

GRANT ALL ON TABLE public.role TO c7;

GRANT INSERT, SELECT, UPDATE ON TABLE public.role TO user_registration;
-- Table: public.user_contact

-- DROP TABLE public.user_contact;

CREATE TABLE public.user_contact
(
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(255) COLLATE pg_catalog."default",
    last_name character varying(255) COLLATE pg_catalog."default",
    phone1 character varying(255) COLLATE pg_catalog."default",
    phone_type1 character varying(255) COLLATE pg_catalog."default",
    phone2 character varying(255) COLLATE pg_catalog."default",
    phone_type2 character varying(255) COLLATE pg_catalog."default",
    address1 character varying(255) COLLATE pg_catalog."default",
    address2 character varying(255) COLLATE pg_catalog."default",
    city character varying(255) COLLATE pg_catalog."default",
    state character varying(255) COLLATE pg_catalog."default",
    zipcode character varying(255) COLLATE pg_catalog."default",
    creation_timestamp bigint NOT NULL,
    last_modified_timestamp bigint NOT NULL,
    CONSTRAINT user_contact_pkey PRIMARY KEY (id),
    CONSTRAINT user_contact_user_fk FOREIGN KEY (user_id)
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.user_contact
    OWNER to c7;

GRANT ALL ON TABLE public.user_contact TO c7;

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.user_contact TO user_registration;
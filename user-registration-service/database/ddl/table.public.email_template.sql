-- Table: public.email_template

-- DROP TABLE public.email_template;

CREATE TABLE public.email_template
(
    code character varying(255) COLLATE pg_catalog."default" NOT NULL,
    template character varying(5000) COLLATE pg_catalog."default" NOT NULL,
    subject character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT email_template_pkey PRIMARY KEY (code)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.email_template
    OWNER to c7;

GRANT ALL ON TABLE public.email_template TO c7;

GRANT INSERT, SELECT, UPDATE ON TABLE public.email_template TO user_registration;
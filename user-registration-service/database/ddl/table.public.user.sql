-- Table: public."user"

-- DROP TABLE public."user";

CREATE TABLE public."user"
(
    id uuid NOT NULL,
    my_mon_user_id character varying(255) COLLATE pg_catalog."default",
    sap_account_number character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    policy_accepted_timestamp bigint,
    registration_completed_timestamp bigint,
    brand character varying(255) COLLATE pg_catalog."default" NOT NULL,
    user_type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    gigya_uid character varying(255) COLLATE pg_catalog."default",
    c7_registration_timestamp bigint,
    email_verification_code uuid,
    verification_completed_timestamp bigint,
    creation_timestamp bigint NOT NULL,
    last_modified_timestamp bigint NOT NULL,
    created_by character varying(255) COLLATE pg_catalog."default" NOT NULL,
    test_user boolean NOT NULL,
    hq_sap_id character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT user_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."user"
    OWNER to c7;

GRANT ALL ON TABLE public."user" TO c7;

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public."user" TO user_registration;

-- Index: registration_completed_timestamp_idx

-- DROP INDEX public.registration_completed_timestamp_idx;

CREATE INDEX registration_completed_timestamp_idx
    ON public."user" USING btree
    (registration_completed_timestamp)
    TABLESPACE pg_default;

-- Index: test_user_false_idx

-- DROP INDEX public.test_user_false_idx;

CREATE INDEX test_user_false_idx
    ON public."user" USING btree
    (test_user)
    TABLESPACE pg_default    WHERE test_user IS FALSE
;
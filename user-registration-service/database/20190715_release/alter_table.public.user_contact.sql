ALTER TABLE public.user_contact ALTER COLUMN phone1 DROP NOT NULL;
ALTER TABLE public.user_contact ALTER COLUMN address1 DROP NOT NULL;
ALTER TABLE public.user_contact ALTER COLUMN city DROP NOT NULL;
ALTER TABLE public.user_contact ALTER COLUMN "state" DROP NOT NULL;
ALTER TABLE public.user_contact ALTER COLUMN zipcode DROP NOT NULL;
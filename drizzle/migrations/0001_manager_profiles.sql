CREATE TABLE public.profiles (id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, full_name text NOT NULL DEFAULT '' CHECK(char_length(full_name)<=100));
GRANT SELECT,UPDATE ON public.profiles TO authenticated; GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_own_read ON public.profiles FOR SELECT TO authenticated USING(id=auth.uid());
CREATE POLICY profiles_own_update ON public.profiles FOR UPDATE TO authenticated USING(id=auth.uid()) WITH CHECK(id=auth.uid());
CREATE FUNCTION public.create_manager_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN INSERT INTO public.profiles(id,full_name) VALUES(NEW.id,left(coalesce(NEW.raw_user_meta_data->>'full_name',''),100)); RETURN NEW; END $$;
CREATE TRIGGER manager_profile_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_manager_profile();
INSERT INTO public.profiles(id,full_name) SELECT id,left(coalesce(raw_user_meta_data->>'full_name',''),100) FROM auth.users ON CONFLICT DO NOTHING;
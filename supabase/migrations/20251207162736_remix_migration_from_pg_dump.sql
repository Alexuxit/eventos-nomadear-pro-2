CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin_nomadear',
    'asesor_concesionario',
    'public_user'
);


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;


--
-- Name: is_staff(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_staff(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role IN ('admin_nomadear', 'asesor_concesionario')
    )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    table_name text,
    record_id uuid,
    old_data jsonb,
    new_data jsonb,
    ip_address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: concesionarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.concesionarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    direccion text,
    ciudad text,
    provincia text,
    telefono text,
    email text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    descripcion text,
    fecha date NOT NULL,
    hora_inicio time without time zone,
    hora_fin time without time zone,
    ubicacion text,
    ciudad text,
    capacidad_maxima integer DEFAULT 50,
    imagen_url text,
    concesionario_id uuid,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    nombre text NOT NULL,
    apellido text NOT NULL,
    email text NOT NULL,
    dni text,
    telefono text,
    marca_vehiculo text,
    modelo_vehiculo text,
    patente text,
    confirmado boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    nombre text NOT NULL,
    apellido text NOT NULL,
    email text NOT NULL,
    telefono text,
    concesionario_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    rol text,
    contenido text NOT NULL,
    imagen_url text,
    activo boolean DEFAULT true,
    orden integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: concesionarios concesionarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concesionarios
    ADD CONSTRAINT concesionarios_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_audit_logs_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_created ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_logs_user ON public.audit_logs USING btree (user_id);


--
-- Name: idx_events_activo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_activo ON public.events USING btree (activo);


--
-- Name: idx_events_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_fecha ON public.events USING btree (fecha);


--
-- Name: idx_participants_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participants_email ON public.participants USING btree (email);


--
-- Name: idx_participants_event; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participants_event ON public.participants USING btree (event_id);


--
-- Name: idx_profiles_concesionario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_concesionario ON public.profiles USING btree (concesionario_id);


--
-- Name: idx_profiles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_user_id ON public.profiles USING btree (user_id);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: concesionarios update_concesionarios_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_concesionarios_updated_at BEFORE UPDATE ON public.concesionarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: events update_events_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: events events_concesionario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_concesionario_id_fkey FOREIGN KEY (concesionario_id) REFERENCES public.concesionarios(id);


--
-- Name: participants participants_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_concesionario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_concesionario_id_fkey FOREIGN KEY (concesionario_id) REFERENCES public.concesionarios(id);


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: concesionarios Concesionarios visibles para todos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Concesionarios visibles para todos" ON public.concesionarios FOR SELECT USING (true);


--
-- Name: participants Cualquiera puede registrarse a eventos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Cualquiera puede registrarse a eventos" ON public.participants FOR INSERT WITH CHECK (true);


--
-- Name: newsletter_subscribers Cualquiera puede suscribirse al newsletter; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Cualquiera puede suscribirse al newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);


--
-- Name: events Eventos activos visibles para todos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Eventos activos visibles para todos" ON public.events FOR SELECT USING ((activo = true));


--
-- Name: audit_logs Sistema puede insertar logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Sistema puede insertar logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: user_roles Solo admins pueden gestionar roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Solo admins pueden gestionar roles" ON public.user_roles TO authenticated USING (public.has_role(auth.uid(), 'admin_nomadear'::public.app_role));


--
-- Name: audit_logs Solo admins pueden ver logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Solo admins pueden ver logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin_nomadear'::public.app_role));


--
-- Name: concesionarios Solo staff puede modificar concesionarios; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Solo staff puede modificar concesionarios" ON public.concesionarios TO authenticated USING (public.is_staff(auth.uid()));


--
-- Name: events Staff puede gestionar eventos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff puede gestionar eventos" ON public.events TO authenticated USING (public.is_staff(auth.uid()));


--
-- Name: participants Staff puede gestionar participantes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff puede gestionar participantes" ON public.participants TO authenticated USING (public.is_staff(auth.uid()));


--
-- Name: testimonials Staff puede gestionar testimonios; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff puede gestionar testimonios" ON public.testimonials TO authenticated USING (public.is_staff(auth.uid()));


--
-- Name: participants Staff puede ver participantes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff puede ver participantes" ON public.participants FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));


--
-- Name: newsletter_subscribers Staff puede ver suscriptores; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff puede ver suscriptores" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));


--
-- Name: events Staff puede ver todos los eventos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff puede ver todos los eventos" ON public.events FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));


--
-- Name: profiles Staff puede ver todos los perfiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff puede ver todos los perfiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));


--
-- Name: testimonials Testimonios activos visibles para todos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Testimonios activos visibles para todos" ON public.testimonials FOR SELECT USING ((activo = true));


--
-- Name: profiles Usuarios pueden actualizar su propio perfil; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: profiles Usuarios pueden insertar su propio perfil; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuarios pueden insertar su propio perfil" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Usuarios pueden ver su propio perfil; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_roles Usuarios pueden ver sus propios roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuarios pueden ver sus propios roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: concesionarios; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.concesionarios ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: newsletter_subscribers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

--
-- Name: participants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: testimonials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--



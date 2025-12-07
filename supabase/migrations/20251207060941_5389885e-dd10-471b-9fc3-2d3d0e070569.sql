-- Crear enum para roles
CREATE TYPE public.app_role AS ENUM ('admin_nomadear', 'asesor_concesionario', 'public_user');

-- Tabla de concesionarios
CREATE TABLE public.concesionarios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    direccion TEXT,
    ciudad TEXT,
    provincia TEXT,
    telefono TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    concesionario_id UUID REFERENCES public.concesionarios(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de roles de usuario (separada para seguridad)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Tabla de eventos
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    ubicacion TEXT,
    ciudad TEXT,
    capacidad_maxima INTEGER DEFAULT 50,
    imagen_url TEXT,
    concesionario_id UUID REFERENCES public.concesionarios(id),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de participantes (registro público a eventos - separada de users)
CREATE TABLE public.participants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT NOT NULL,
    dni TEXT,
    telefono TEXT,
    marca_vehiculo TEXT,
    modelo_vehiculo TEXT,
    patente TEXT,
    confirmado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de suscriptores newsletter
CREATE TABLE public.newsletter_subscribers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de testimonios
CREATE TABLE public.testimonials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    rol TEXT,
    contenido TEXT NOT NULL,
    imagen_url TEXT,
    activo BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de audit logs
CREATE TABLE public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Función para verificar roles (SECURITY DEFINER para evitar recursión RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Función para verificar si es admin o asesor
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role IN ('admin_nomadear', 'asesor_concesionario')
    )
$$;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_concesionarios_updated_at
    BEFORE UPDATE ON public.concesionarios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS en todas las tablas
ALTER TABLE public.concesionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para concesionarios
CREATE POLICY "Concesionarios visibles para todos"
    ON public.concesionarios FOR SELECT
    USING (true);

CREATE POLICY "Solo staff puede modificar concesionarios"
    ON public.concesionarios FOR ALL
    TO authenticated
    USING (public.is_staff(auth.uid()));

-- Políticas RLS para profiles
CREATE POLICY "Usuarios pueden ver su propio perfil"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Staff puede ver todos los perfiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (public.is_staff(auth.uid()));

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar su propio perfil"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para user_roles
CREATE POLICY "Usuarios pueden ver sus propios roles"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Solo admins pueden gestionar roles"
    ON public.user_roles FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin_nomadear'));

-- Políticas RLS para events
CREATE POLICY "Eventos activos visibles para todos"
    ON public.events FOR SELECT
    USING (activo = true);

CREATE POLICY "Staff puede ver todos los eventos"
    ON public.events FOR SELECT
    TO authenticated
    USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff puede gestionar eventos"
    ON public.events FOR ALL
    TO authenticated
    USING (public.is_staff(auth.uid()));

-- Políticas RLS para participants (registro público)
CREATE POLICY "Cualquiera puede registrarse a eventos"
    ON public.participants FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Staff puede ver participantes"
    ON public.participants FOR SELECT
    TO authenticated
    USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff puede gestionar participantes"
    ON public.participants FOR ALL
    TO authenticated
    USING (public.is_staff(auth.uid()));

-- Políticas RLS para newsletter
CREATE POLICY "Cualquiera puede suscribirse al newsletter"
    ON public.newsletter_subscribers FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Staff puede ver suscriptores"
    ON public.newsletter_subscribers FOR SELECT
    TO authenticated
    USING (public.is_staff(auth.uid()));

-- Políticas RLS para testimonials
CREATE POLICY "Testimonios activos visibles para todos"
    ON public.testimonials FOR SELECT
    USING (activo = true);

CREATE POLICY "Staff puede gestionar testimonios"
    ON public.testimonials FOR ALL
    TO authenticated
    USING (public.is_staff(auth.uid()));

-- Políticas RLS para audit_logs
CREATE POLICY "Solo admins pueden ver logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin_nomadear'));

CREATE POLICY "Sistema puede insertar logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Índices para mejorar rendimiento
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_concesionario ON public.profiles(concesionario_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_events_fecha ON public.events(fecha);
CREATE INDEX idx_events_activo ON public.events(activo);
CREATE INDEX idx_participants_event ON public.participants(event_id);
CREATE INDEX idx_participants_email ON public.participants(email);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);
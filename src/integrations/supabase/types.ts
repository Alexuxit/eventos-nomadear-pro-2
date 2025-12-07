export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      concesionarios: {
        Row: {
          ciudad: string | null
          created_at: string
          direccion: string | null
          email: string | null
          id: string
          nombre: string
          provincia: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          ciudad?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombre: string
          provincia?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          ciudad?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string
          provincia?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          activo: boolean | null
          capacidad_maxima: number | null
          ciudad: string | null
          concesionario_id: string | null
          created_at: string
          descripcion: string | null
          fecha: string
          hora_fin: string | null
          hora_inicio: string | null
          id: string
          imagen_url: string | null
          titulo: string
          ubicacion: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean | null
          capacidad_maxima?: number | null
          ciudad?: string | null
          concesionario_id?: string | null
          created_at?: string
          descripcion?: string | null
          fecha: string
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: string
          imagen_url?: string | null
          titulo: string
          ubicacion?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean | null
          capacidad_maxima?: number | null
          ciudad?: string | null
          concesionario_id?: string | null
          created_at?: string
          descripcion?: string | null
          fecha?: string
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: string
          imagen_url?: string | null
          titulo?: string
          ubicacion?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_concesionario_id_fkey"
            columns: ["concesionario_id"]
            isOneToOne: false
            referencedRelation: "concesionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          activo: boolean | null
          created_at: string
          email: string
          id: string
        }
        Insert: {
          activo?: boolean | null
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          activo?: boolean | null
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          apellido: string
          confirmado: boolean | null
          created_at: string
          dni: string | null
          email: string
          event_id: string
          id: string
          marca_vehiculo: string | null
          modelo_vehiculo: string | null
          nombre: string
          patente: string | null
          telefono: string | null
        }
        Insert: {
          apellido: string
          confirmado?: boolean | null
          created_at?: string
          dni?: string | null
          email: string
          event_id: string
          id?: string
          marca_vehiculo?: string | null
          modelo_vehiculo?: string | null
          nombre: string
          patente?: string | null
          telefono?: string | null
        }
        Update: {
          apellido?: string
          confirmado?: boolean | null
          created_at?: string
          dni?: string | null
          email?: string
          event_id?: string
          id?: string
          marca_vehiculo?: string | null
          modelo_vehiculo?: string | null
          nombre?: string
          patente?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          apellido: string
          concesionario_id: string | null
          created_at: string
          email: string
          id: string
          nombre: string
          telefono: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          apellido: string
          concesionario_id?: string | null
          created_at?: string
          email: string
          id?: string
          nombre: string
          telefono?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          apellido?: string
          concesionario_id?: string | null
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_concesionario_id_fkey"
            columns: ["concesionario_id"]
            isOneToOne: false
            referencedRelation: "concesionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          activo: boolean | null
          contenido: string
          created_at: string
          id: string
          imagen_url: string | null
          nombre: string
          orden: number | null
          rol: string | null
        }
        Insert: {
          activo?: boolean | null
          contenido: string
          created_at?: string
          id?: string
          imagen_url?: string | null
          nombre: string
          orden?: number | null
          rol?: string | null
        }
        Update: {
          activo?: boolean | null
          contenido?: string
          created_at?: string
          id?: string
          imagen_url?: string | null
          nombre?: string
          orden?: number | null
          rol?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin_nomadear" | "asesor_concesionario" | "public_user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin_nomadear", "asesor_concesionario", "public_user"],
    },
  },
} as const

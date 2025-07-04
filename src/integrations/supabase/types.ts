export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      patient_food_orders: {
        Row: {
          afiliacion_cui: string
          almuerzo: boolean | null
          cena: boolean | null
          created_at: string
          desayuno: boolean | null
          fecha: string
          id: string
          justificacion: string
          no_cama: string
          nombre_completo_paciente: string
          nombre_paciente_firma: string | null
          nombre_solicitante: string | null
          refaccion_am: boolean | null
          refaccion_nocturna: boolean | null
          refaccion_pm: boolean | null
          servicio: string
          tipo_dieta: string
          updated_at: string
        }
        Insert: {
          afiliacion_cui: string
          almuerzo?: boolean | null
          cena?: boolean | null
          created_at?: string
          desayuno?: boolean | null
          fecha: string
          id?: string
          justificacion: string
          no_cama: string
          nombre_completo_paciente: string
          nombre_paciente_firma?: string | null
          nombre_solicitante?: string | null
          refaccion_am?: boolean | null
          refaccion_nocturna?: boolean | null
          refaccion_pm?: boolean | null
          servicio: string
          tipo_dieta: string
          updated_at?: string
        }
        Update: {
          afiliacion_cui?: string
          almuerzo?: boolean | null
          cena?: boolean | null
          created_at?: string
          desayuno?: boolean | null
          fecha?: string
          id?: string
          justificacion?: string
          no_cama?: string
          nombre_completo_paciente?: string
          nombre_paciente_firma?: string | null
          nombre_solicitante?: string | null
          refaccion_am?: boolean | null
          refaccion_nocturna?: boolean | null
          refaccion_pm?: boolean | null
          servicio?: string
          tipo_dieta?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_food_orders: {
        Row: {
          almuerzo: boolean | null
          cargo: string
          cena: boolean | null
          created_at: string
          desayuno: boolean | null
          fecha: string
          id: string
          justificacion: string
          no_empleado: string
          nombre_aprobador: string | null
          nombre_colaborador: string | null
          nombre_completo_personal: string
          nombre_solicitante: string | null
          refaccion_nocturna: boolean | null
          servicio: string
          tipo_dieta: string
          updated_at: string
        }
        Insert: {
          almuerzo?: boolean | null
          cargo: string
          cena?: boolean | null
          created_at?: string
          desayuno?: boolean | null
          fecha: string
          id?: string
          justificacion: string
          no_empleado: string
          nombre_aprobador?: string | null
          nombre_colaborador?: string | null
          nombre_completo_personal: string
          nombre_solicitante?: string | null
          refaccion_nocturna?: boolean | null
          servicio: string
          tipo_dieta: string
          updated_at?: string
        }
        Update: {
          almuerzo?: boolean | null
          cargo?: string
          cena?: boolean | null
          created_at?: string
          desayuno?: boolean | null
          fecha?: string
          id?: string
          justificacion?: string
          no_empleado?: string
          nombre_aprobador?: string | null
          nombre_colaborador?: string | null
          nombre_completo_personal?: string
          nombre_solicitante?: string | null
          refaccion_nocturna?: boolean | null
          servicio?: string
          tipo_dieta?: string
          updated_at?: string
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
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "staff"],
    },
  },
} as const

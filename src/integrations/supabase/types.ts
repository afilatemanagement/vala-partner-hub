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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          affiliate_id: string | null
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          affiliate_id?: string | null
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          affiliate_id?: string | null
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_links: {
        Row: {
          affiliate_id: string
          campaign_id: string | null
          clicks_count: number
          conversions_count: number
          created_at: string
          destination_url: string
          id: string
          slug: string
        }
        Insert: {
          affiliate_id: string
          campaign_id?: string | null
          clicks_count?: number
          conversions_count?: number
          created_at?: string
          destination_url: string
          id?: string
          slug: string
        }
        Update: {
          affiliate_id?: string
          campaign_id?: string | null
          clicks_count?: number
          conversions_count?: number
          created_at?: string
          destination_url?: string
          id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          code: string
          country: string | null
          created_at: string
          display_name: string
          email: string | null
          health_score: number
          id: string
          kyc_status: string
          risk_score: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          code: string
          country?: string | null
          created_at?: string
          display_name: string
          email?: string | null
          health_score?: number
          id?: string
          kyc_status?: string
          risk_score?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          code?: string
          country?: string | null
          created_at?: string
          display_name?: string
          email?: string | null
          health_score?: number
          id?: string
          kyc_status?: string
          risk_score?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          budget_cents: number
          created_at: string
          ends_at: string | null
          id: string
          name: string
          starts_at: string | null
          status: string
        }
        Insert: {
          budget_cents?: number
          created_at?: string
          ends_at?: string | null
          id?: string
          name: string
          starts_at?: string | null
          status?: string
        }
        Update: {
          budget_cents?: number
          created_at?: string
          ends_at?: string | null
          id?: string
          name?: string
          starts_at?: string | null
          status?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          affiliate_id: string
          amount_cents: number
          created_at: string
          currency: string
          id: string
          order_id: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          order_id?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          order_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          affiliate_id: string | null
          created_at: string
          email: string | null
          first_order_at: string | null
          id: string
        }
        Insert: {
          affiliate_id?: string | null
          created_at?: string
          email?: string | null
          first_order_at?: string | null
          id?: string
        }
        Update: {
          affiliate_id?: string | null
          created_at?: string
          email?: string | null
          first_order_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          affiliate_id: string | null
          created_at: string
          email: string | null
          id: string
          status: string
        }
        Insert: {
          affiliate_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          status?: string
        }
        Update: {
          affiliate_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          affiliate_id: string | null
          amount_cents: number
          created_at: string
          currency: string
          customer_email: string | null
          id: string
          status: string
        }
        Insert: {
          affiliate_id?: string | null
          amount_cents?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          id?: string
          status?: string
        }
        Update: {
          affiliate_id?: string | null
          amount_cents?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          affiliate_id: string
          amount_cents: number
          currency: string
          id: string
          method: string | null
          requested_at: string
          settled_at: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          amount_cents?: number
          currency?: string
          id?: string
          method?: string | null
          requested_at?: string
          settled_at?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount_cents?: number
          currency?: string
          id?: string
          method?: string | null
          requested_at?: string
          settled_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          affiliate_id: string | null
          campaign_id: string | null
          code: string
          created_at: string
          expires_at: string | null
          id: string
          status: string
          uses_count: number
        }
        Insert: {
          affiliate_id?: string | null
          campaign_id?: string | null
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          status?: string
          uses_count?: number
        }
        Update: {
          affiliate_id?: string | null
          campaign_id?: string | null
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          status?: string
          uses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_codes_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
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
      wallets: {
        Row: {
          affiliate_id: string
          balance_cents: number
          currency: string
          id: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          balance_cents?: number
          currency?: string
          id?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          balance_cents?: number
          currency?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: true
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      affiliate_dashboard_stats: { Args: never; Returns: Json }
      affiliate_top: {
        Args: { _limit?: number }
        Returns: {
          commission_cents: number
          conversions: number
          country: string
          display_name: string
          id: string
          revenue_cents: number
          status: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_boss: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "manager" | "affiliate"
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
      app_role: ["admin", "manager", "affiliate"],
    },
  },
} as const

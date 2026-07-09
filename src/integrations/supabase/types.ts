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
      affiliate_applications: {
        Row: {
          agreement_signed: boolean
          applicant_name: string
          audience_size: number | null
          category: string | null
          country: string | null
          created_at: string
          decided_at: string | null
          email: string
          id: string
          kyc_status: string
          motivation: string | null
          phone: string | null
          review_notes: string | null
          reviewer_id: string | null
          risk_score: number
          status: string
          submitted_at: string
          updated_at: string
          website: string | null
        }
        Insert: {
          agreement_signed?: boolean
          applicant_name: string
          audience_size?: number | null
          category?: string | null
          country?: string | null
          created_at?: string
          decided_at?: string | null
          email: string
          id?: string
          kyc_status?: string
          motivation?: string | null
          phone?: string | null
          review_notes?: string | null
          reviewer_id?: string | null
          risk_score?: number
          status?: string
          submitted_at?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          agreement_signed?: boolean
          applicant_name?: string
          audience_size?: number | null
          category?: string | null
          country?: string | null
          created_at?: string
          decided_at?: string | null
          email?: string
          id?: string
          kyc_status?: string
          motivation?: string | null
          phone?: string | null
          review_notes?: string | null
          reviewer_id?: string | null
          risk_score?: number
          status?: string
          submitted_at?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      affiliate_documents: {
        Row: {
          affiliate_id: string | null
          created_at: string
          doc_type: string
          expires_at: string | null
          file_url: string | null
          id: string
          signed: boolean
          signed_at: string | null
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          affiliate_id?: string | null
          created_at?: string
          doc_type: string
          expires_at?: string | null
          file_url?: string | null
          id?: string
          signed?: boolean
          signed_at?: string | null
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          affiliate_id?: string | null
          created_at?: string
          doc_type?: string
          expires_at?: string | null
          file_url?: string | null
          id?: string
          signed?: boolean
          signed_at?: string | null
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_documents_affiliate_id_fkey"
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
      announcements: {
        Row: {
          audience: string
          body: string
          created_at: string
          created_by: string | null
          id: string
          pinned: boolean
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          pinned?: boolean
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          pinned?: boolean
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          hashed_key: string
          id: string
          label: string
          last_used_at: string | null
          prefix: string
          revoked: boolean
          scopes: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          hashed_key: string
          id?: string
          label: string
          last_used_at?: string | null
          prefix: string
          revoked?: boolean
          scopes?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          hashed_key?: string
          id?: string
          label?: string
          last_used_at?: string | null
          prefix?: string
          revoked?: boolean
          scopes?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          active: boolean
          clicks: number
          created_at: string
          ends_at: string | null
          id: string
          image_url: string | null
          impressions: number
          link_url: string | null
          placement: string
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          clicks?: number
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string | null
          impressions?: number
          link_url?: string | null
          placement?: string
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          clicks?: number
          created_at?: string
          ends_at?: string | null
          id?: string
          image_url?: string | null
          impressions?: number
          link_url?: string | null
          placement?: string
          starts_at?: string | null
          title?: string
          updated_at?: string
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
      communication_messages: {
        Row: {
          attachments: Json | null
          body: string
          created_at: string
          id: string
          sender: string
          sender_id: string | null
          thread_id: string
        }
        Insert: {
          attachments?: Json | null
          body: string
          created_at?: string
          id?: string
          sender: string
          sender_id?: string | null
          thread_id: string
        }
        Update: {
          attachments?: Json | null
          body?: string
          created_at?: string
          id?: string
          sender?: string
          sender_id?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "communication_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_threads: {
        Row: {
          affiliate_id: string | null
          channel: string
          created_at: string
          id: string
          last_message_at: string
          status: string
          subject: string | null
          unread_count: number
          updated_at: string
        }
        Insert: {
          affiliate_id?: string | null
          channel?: string
          created_at?: string
          id?: string
          last_message_at?: string
          status?: string
          subject?: string | null
          unread_count?: number
          updated_at?: string
        }
        Update: {
          affiliate_id?: string | null
          channel?: string
          created_at?: string
          id?: string
          last_message_at?: string
          status?: string
          subject?: string | null
          unread_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_threads_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_alerts: {
        Row: {
          affiliate_id: string | null
          category: string
          created_at: string
          id: string
          message: string
          resolved_at: string | null
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_id?: string | null
          category: string
          created_at?: string
          id?: string
          message: string
          resolved_at?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string | null
          category?: string
          created_at?: string
          id?: string
          message?: string
          resolved_at?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_alerts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
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
      integrations: {
        Row: {
          config: Json
          created_at: string
          id: string
          last_sync_at: string | null
          provider: string
          status: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          last_sync_at?: string | null
          provider: string
          status?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          last_sync_at?: string | null
          provider?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          affiliate_id: string | null
          application_id: string | null
          created_at: string
          doc_type: string
          file_url: string | null
          id: string
          notes: string | null
          reviewer_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_id?: string | null
          application_id?: string | null
          created_at?: string
          doc_type: string
          file_url?: string | null
          id?: string
          notes?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string | null
          application_id?: string | null
          created_at?: string
          doc_type?: string
          file_url?: string | null
          id?: string
          notes?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "affiliate_applications"
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
      marketing_assets: {
        Row: {
          campaign_id: string | null
          created_at: string
          downloads: number
          file_url: string | null
          format: string | null
          id: string
          kind: string
          name: string
          preview_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          downloads?: number
          file_url?: string | null
          format?: string | null
          id?: string
          kind: string
          name: string
          preview_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          downloads?: number
          file_url?: string | null
          format?: string | null
          id?: string
          kind?: string
          name?: string
          preview_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_assets_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_broadcasts: {
        Row: {
          audience: string
          body: string
          channel: string
          clicked_count: number
          created_at: string
          created_by: string | null
          delivered_count: number
          id: string
          opened_count: number
          recipients_count: number
          scheduled_at: string | null
          segment: Json | null
          sent_at: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          audience?: string
          body: string
          channel: string
          clicked_count?: number
          created_at?: string
          created_by?: string | null
          delivered_count?: number
          id?: string
          opened_count?: number
          recipients_count?: number
          scheduled_at?: string | null
          segment?: Json | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          audience?: string
          body?: string
          channel?: string
          clicked_count?: number
          created_at?: string
          created_by?: string | null
          delivered_count?: number
          id?: string
          opened_count?: number
          recipients_count?: number
          scheduled_at?: string | null
          segment?: Json | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          affiliate_id: string | null
          created_at: string
          created_by: string | null
          duration_minutes: number
          id: string
          join_url: string | null
          notes: string | null
          starts_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          affiliate_id?: string | null
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          id?: string
          join_url?: string | null
          notes?: string | null
          starts_at: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string | null
          created_at?: string
          created_by?: string | null
          duration_minutes?: number
          id?: string
          join_url?: string | null
          notes?: string | null
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          body: string
          channel: string
          code: string
          created_at: string
          enabled: boolean
          id: string
          subject: string | null
          updated_at: string
          variables: Json | null
        }
        Insert: {
          body: string
          channel: string
          code: string
          created_at?: string
          enabled?: boolean
          id?: string
          subject?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          body?: string
          channel?: string
          code?: string
          created_at?: string
          enabled?: boolean
          id?: string
          subject?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
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
      performance_snapshots: {
        Row: {
          affiliate_id: string | null
          clicks: number
          commission_cents: number
          conversions: number
          created_at: string
          id: string
          period: string
          revenue_cents: number
          sales: number
          visitors: number
        }
        Insert: {
          affiliate_id?: string | null
          clicks?: number
          commission_cents?: number
          conversions?: number
          created_at?: string
          id?: string
          period: string
          revenue_cents?: number
          sales?: number
          visitors?: number
        }
        Update: {
          affiliate_id?: string | null
          clicks?: number
          commission_cents?: number
          conversions?: number
          created_at?: string
          id?: string
          period?: string
          revenue_cents?: number
          sales?: number
          visitors?: number
        }
        Relationships: [
          {
            foreignKeyName: "performance_snapshots_affiliate_id_fkey"
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
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      support_ticket_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          internal: boolean
          sender: string
          sender_id: string | null
          ticket_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          internal?: boolean
          sender: string
          sender_id?: string | null
          ticket_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          internal?: boolean
          sender?: string
          sender_id?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          affiliate_id: string | null
          assigned_to: string | null
          channel: string
          created_at: string
          description: string | null
          id: string
          priority: string
          resolved_at: string | null
          sla_due_at: string | null
          status: string
          subject: string
          ticket_no: string
          updated_at: string
        }
        Insert: {
          affiliate_id?: string | null
          assigned_to?: string | null
          channel?: string
          created_at?: string
          description?: string | null
          id?: string
          priority?: string
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string
          subject: string
          ticket_no?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string | null
          assigned_to?: string | null
          channel?: string
          created_at?: string
          description?: string | null
          id?: string
          priority?: string
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string
          subject?: string
          ticket_no?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
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
      workflow_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          enabled: boolean
          id: string
          last_run_at: string | null
          name: string
          run_count: number
          trigger: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          name: string
          run_count?: number
          trigger: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          last_run_at?: string | null
          name?: string
          run_count?: number
          trigger?: string
          updated_at?: string
        }
        Relationships: []
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
      get_my_permissions: { Args: never; Returns: Json }
      has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_boss: { Args: { _user_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      universal_search: {
        Args: {
          _entity_types?: string[]
          _limit?: number
          _offset?: number
          _q: string
        }
        Returns: {
          entity_id: string
          entity_type: string
          route: string
          score: number
          status: string
          subtitle: string
          title: string
          total_count: number
        }[]
      }
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

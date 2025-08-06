export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          calendar_rsvps: number | null
          created_at: string
          date: string
          id: string
          post_interactions: number | null
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          calendar_rsvps?: number | null
          created_at?: string
          date?: string
          id?: string
          post_interactions?: number | null
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          calendar_rsvps?: number | null
          created_at?: string
          date?: string
          id?: string
          post_interactions?: number | null
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          business_id: string
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          end_time: string
          id: string
          notes: string | null
          service_id: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          business_id: string
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time: string
          id?: string
          notes?: string | null
          service_id: string
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          business_id?: string
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          service_id?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_appointments_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_appointments_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      Bookvendor: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      business_availability: {
        Row: {
          business_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          start_time: string
        }
        Insert: {
          business_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
        }
        Update: {
          business_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_availability_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      business_insights: {
        Row: {
          business_id: string
          created_at: string
          date_range_end: string
          date_range_start: string
          id: string
          insight_data: Json
          insight_type: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          date_range_end: string
          date_range_start: string
          id?: string
          insight_data?: Json
          insight_type: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          date_range_end?: string
          date_range_start?: string
          id?: string
          insight_data?: Json
          insight_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_licenses: {
        Row: {
          business_id: string
          created_at: string
          document_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string
          license_number: string
          license_type: string
          status: string
          updated_at: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority: string
          license_number: string
          license_type: string
          status?: string
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string
          license_number?: string
          license_type?: string
          status?: string
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_business_licenses_business_id"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          address: string | null
          business_categories: string[] | null
          business_hours: Json | null
          contact_email: string | null
          contact_phone: string | null
          coordinates: string | null
          cover_photo_url: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          other_category: string | null
          photos: string[] | null
          profile_picture_url: string | null
          social_links: Json | null
          tags: string[] | null
          updated_at: string
          user_id: string
          venue_types: string[] | null
          videos: string[] | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          business_categories?: string[] | null
          business_hours?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          coordinates?: string | null
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          other_category?: string | null
          photos?: string[] | null
          profile_picture_url?: string | null
          social_links?: Json | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
          venue_types?: string[] | null
          videos?: string[] | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          business_categories?: string[] | null
          business_hours?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          coordinates?: string | null
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          other_category?: string | null
          photos?: string[] | null
          profile_picture_url?: string | null
          social_links?: Json | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          venue_types?: string[] | null
          videos?: string[] | null
          website_url?: string | null
        }
        Relationships: []
      }
      business_reviews: {
        Row: {
          business_id: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_performance: {
        Row: {
          business_id: string
          campaign_id: string
          created_at: string
          date: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          updated_at: string
        }
        Insert: {
          business_id: string
          campaign_id: string
          created_at?: string
          date?: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          campaign_id?: string
          created_at?: string
          date?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          comment_id: string
          content: string
          created_at: string
          parent_comment_id: string | null
          post_id: string
          timestamp: string
          updated_at: string
        }
        Insert: {
          author_id: string
          comment_id?: string
          content: string
          created_at?: string
          parent_comment_id?: string | null
          post_id: string
          timestamp?: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          comment_id?: string
          content?: string
          created_at?: string
          parent_comment_id?: string | null
          post_id?: string
          timestamp?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      communication_logs: {
        Row: {
          action_type: string
          business_id: string
          content: string | null
          created_at: string
          id: string
          metadata: Json | null
          recipient: string | null
          service_name: string
          status: string
        }
        Insert: {
          action_type: string
          business_id: string
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          recipient?: string | null
          service_name: string
          status?: string
        }
        Update: {
          action_type?: string
          business_id?: string
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          recipient?: string | null
          service_name?: string
          status?: string
        }
        Relationships: []
      }
      communications_config: {
        Row: {
          business_id: string
          config: Json
          created_at: string
          id: string
          is_active: boolean
          service_name: string
          updated_at: string
        }
        Insert: {
          business_id: string
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          service_name: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          connected_user_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_behavior: {
        Row: {
          behavior_data: Json | null
          behavior_type: string
          business_id: string
          created_at: string
          customer_id: string
          id: string
          session_id: string | null
          timestamp: string
        }
        Insert: {
          behavior_data?: Json | null
          behavior_type: string
          business_id: string
          created_at?: string
          customer_id: string
          id?: string
          session_id?: string | null
          timestamp?: string
        }
        Update: {
          behavior_data?: Json | null
          behavior_type?: string
          business_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          session_id?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      customer_business_follows: {
        Row: {
          business_id: string
          created_at: string
          customer_id: string
          id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_id: string
          id?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_id?: string
          id?: string
        }
        Relationships: []
      }
      customer_engagement: {
        Row: {
          business_id: string
          created_at: string
          customer_id: string
          engagement_data: Json | null
          engagement_type: string
          id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_id: string
          engagement_data?: Json | null
          engagement_type: string
          id?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_id?: string
          engagement_data?: Json | null
          engagement_type?: string
          id?: string
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          cover_photo_url: string | null
          created_at: string
          email: string | null
          facebook_url: string | null
          id: string
          interests: string[] | null
          name: string
          profile_picture_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_photo_url?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          id?: string
          interests?: string[] | null
          name: string
          profile_picture_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_photo_url?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          id?: string
          interests?: string[] | null
          name?: string
          profile_picture_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dispute_messages: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string
          dispute_id: string
          id: string
          message_type: string
          sender_id: string
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string
          dispute_id: string
          id?: string
          message_type?: string
          sender_id: string
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string
          dispute_id?: string
          id?: string
          message_type?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_dispute_messages_dispute_id"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          complainant_id: string
          created_at: string
          description: string
          dispute_type: string
          evidence_urls: string[] | null
          id: string
          priority: string
          related_entity_id: string
          related_entity_type: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          respondent_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          complainant_id: string
          created_at?: string
          description: string
          dispute_type: string
          evidence_urls?: string[] | null
          id?: string
          priority?: string
          related_entity_id: string
          related_entity_type: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          respondent_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          complainant_id?: string
          created_at?: string
          description?: string
          dispute_type?: string
          evidence_urls?: string[] | null
          id?: string
          priority?: string
          related_entity_id?: string
          related_entity_type?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          respondent_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_reminders: {
        Row: {
          created_at: string
          event_id: string
          id: string
          reminder_type: string
          sent_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          reminder_type: string
          sent_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          reminder_type?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_reminders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          business_id: string
          campaign_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          trigger_event: string
          updated_at: string
        }
        Insert: {
          business_id: string
          campaign_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          trigger_event: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          campaign_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          trigger_event?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_sequences_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_sequences_campaign"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          business_id: string
          content: string
          created_at: string
          id: string
          name: string
          order_in_sequence: number
          send_delay_hours: number
          sequence_id: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          business_id: string
          content: string
          created_at?: string
          id?: string
          name: string
          order_in_sequence?: number
          send_delay_hours?: number
          sequence_id?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          content?: string
          created_at?: string
          id?: string
          name?: string
          order_in_sequence?: number
          send_delay_hours?: number
          sequence_id?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_templates_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_templates_sequence"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      event_manager_profiles: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          cover_photo_url: string | null
          created_at: string
          description: string | null
          event_history: string | null
          experience_years: number | null
          id: string
          name: string
          photos: string[] | null
          profile_picture_url: string | null
          social_links: Json | null
          specialties: string[] | null
          tagline: string | null
          updated_at: string
          user_id: string
          videos: string[] | null
          website_url: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          event_history?: string | null
          experience_years?: number | null
          id?: string
          name: string
          photos?: string[] | null
          profile_picture_url?: string | null
          social_links?: Json | null
          specialties?: string[] | null
          tagline?: string | null
          updated_at?: string
          user_id: string
          videos?: string[] | null
          website_url?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          event_history?: string | null
          experience_years?: number | null
          id?: string
          name?: string
          photos?: string[] | null
          profile_picture_url?: string | null
          social_links?: Json | null
          specialties?: string[] | null
          tagline?: string | null
          updated_at?: string
          user_id?: string
          videos?: string[] | null
          website_url?: string | null
        }
        Relationships: []
      }
      event_type_colors: {
        Row: {
          color_primary: string
          color_secondary: string
          created_at: string | null
          event_type: string
          id: string
        }
        Insert: {
          color_primary: string
          color_secondary: string
          created_at?: string | null
          event_type: string
          id?: string
        }
        Update: {
          color_primary?: string
          color_secondary?: string
          created_at?: string | null
          event_type?: string
          id?: string
        }
        Relationships: []
      }
      event_vendor_signups: {
        Row: {
          booth_requirements: string | null
          created_at: string
          event_id: string
          id: string
          signup_date: string
          special_requests: string | null
          status: string
          updated_at: string
          vendor_description: string | null
          vendor_email: string | null
          vendor_id: string
          vendor_name: string
          vendor_phone: string | null
          vendor_website: string | null
        }
        Insert: {
          booth_requirements?: string | null
          created_at?: string
          event_id: string
          id?: string
          signup_date?: string
          special_requests?: string | null
          status?: string
          updated_at?: string
          vendor_description?: string | null
          vendor_email?: string | null
          vendor_id: string
          vendor_name: string
          vendor_phone?: string | null
          vendor_website?: string | null
        }
        Update: {
          booth_requirements?: string | null
          created_at?: string
          event_id?: string
          id?: string
          signup_date?: string
          special_requests?: string | null
          status?: string
          updated_at?: string
          vendor_description?: string | null
          vendor_email?: string | null
          vendor_id?: string
          vendor_name?: string
          vendor_phone?: string | null
          vendor_website?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          event_color: string | null
          event_dates: string[] | null
          event_id: string
          event_type: string | null
          host_business_id: string | null
          is_featured: boolean | null
          location: string | null
          organizer_name: string | null
          recurring_pattern: string | null
          rsvp_user_ids: string[] | null
          tagged_vendor_ids: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          event_color?: string | null
          event_dates?: string[] | null
          event_id?: string
          event_type?: string | null
          host_business_id?: string | null
          is_featured?: boolean | null
          location?: string | null
          organizer_name?: string | null
          recurring_pattern?: string | null
          rsvp_user_ids?: string[] | null
          tagged_vendor_ids?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          event_color?: string | null
          event_dates?: string[] | null
          event_id?: string
          event_type?: string | null
          host_business_id?: string | null
          is_featured?: boolean | null
          location?: string | null
          organizer_name?: string | null
          recurring_pattern?: string | null
          rsvp_user_ids?: string[] | null
          tagged_vendor_ids?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_host_business_id_fkey"
            columns: ["host_business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          business_id: string
          created_at: string
          form_id: string
          id: string
          ip_address: string | null
          lead_id: string | null
          submission_data: Json
          user_agent: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          form_id: string
          id?: string
          ip_address?: string | null
          lead_id?: string | null
          submission_data?: Json
          user_agent?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          form_id?: string
          id?: string
          ip_address?: string | null
          lead_id?: string | null
          submission_data?: Json
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_submissions_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_submissions_form"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "lead_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_submissions_lead"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          business_id: string
          category: string
          cost_price: number | null
          created_at: string
          current_stock: number
          description: string | null
          id: string
          location: string | null
          max_stock_level: number | null
          min_stock_level: number | null
          name: string
          sku: string | null
          status: string
          supplier: string | null
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          business_id: string
          category: string
          cost_price?: number | null
          created_at?: string
          current_stock?: number
          description?: string | null
          id?: string
          location?: string | null
          max_stock_level?: number | null
          min_stock_level?: number | null
          name: string
          sku?: string | null
          status?: string
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          category?: string
          cost_price?: number | null
          created_at?: string
          current_stock?: number
          description?: string | null
          id?: string
          location?: string | null
          max_stock_level?: number | null
          min_stock_level?: number | null
          name?: string
          sku?: string | null
          status?: string
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      lead_forms: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          form_fields: Json
          id: string
          is_active: boolean
          name: string
          redirect_url: string | null
          thank_you_message: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          form_fields?: Json
          id?: string
          is_active?: boolean
          name: string
          redirect_url?: string | null
          thank_you_message?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          form_fields?: Json
          id?: string
          is_active?: boolean
          name?: string
          redirect_url?: string | null
          thank_you_message?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_forms_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      lead_interactions: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          id: string
          interaction_type: string
          lead_id: string
          next_action: string | null
          next_action_date: string | null
          outcome: string | null
          subject: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          interaction_type: string
          lead_id: string
          next_action?: string | null
          next_action_date?: string | null
          outcome?: string | null
          subject?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          interaction_type?: string
          lead_id?: string
          next_action?: string | null
          next_action_date?: string | null
          outcome?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_interactions_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_interactions_lead"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          business_id: string
          conversions_count: number
          created_at: string
          date: string
          id: string
          leads_count: number
          metadata: Json | null
          revenue_generated: number | null
          source_name: string
          source_type: string
          updated_at: string
        }
        Insert: {
          business_id: string
          conversions_count?: number
          created_at?: string
          date?: string
          id?: string
          leads_count?: number
          metadata?: Json | null
          revenue_generated?: number | null
          source_name: string
          source_type: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          conversions_count?: number
          created_at?: string
          date?: string
          id?: string
          leads_count?: number
          metadata?: Json | null
          revenue_generated?: number | null
          source_name?: string
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          business_id: string
          company: string | null
          created_at: string
          email: string
          estimated_value: number | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          priority: string
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          business_id: string
          company?: string | null
          created_at?: string
          email: string
          estimated_value?: number | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          priority?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          business_id?: string
          company?: string | null
          created_at?: string
          email?: string
          estimated_value?: number | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          priority?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_leads_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          business_id: string
          campaign_type: string
          content: Json | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          metrics: Json | null
          name: string
          start_date: string | null
          status: string
          target_audience: Json | null
          updated_at: string
        }
        Insert: {
          business_id: string
          campaign_type: string
          content?: Json | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          campaign_type?: string
          content?: Json | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_campaigns_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          message_id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          timestamp: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          message_id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          timestamp?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          message_id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          timestamp?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          media_urls: string[] | null
          post_id: string
          tagged_business_ids: string[] | null
          timestamp: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          media_urls?: string[] | null
          post_id?: string
          tagged_business_ids?: string[] | null
          timestamp?: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          media_urls?: string[] | null
          post_id?: string
          tagged_business_ids?: string[] | null
          timestamp?: string
          updated_at?: string
        }
        Relationships: []
      }
      revenue_tracking: {
        Row: {
          amount: number
          business_id: string
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          product_service_id: string | null
          status: string
          transaction_date: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          business_id: string
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          product_service_id?: string | null
          status?: string
          transaction_date?: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          business_id?: string
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          product_service_id?: string | null
          status?: string
          transaction_date?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      review_moderation: {
        Row: {
          auto_flagged: boolean | null
          created_at: string
          flagged_content: string[] | null
          id: string
          moderated_at: string | null
          moderated_content: string | null
          moderation_reason: string | null
          moderation_status: string
          moderator_id: string | null
          original_content: string | null
          review_id: string
          updated_at: string
        }
        Insert: {
          auto_flagged?: boolean | null
          created_at?: string
          flagged_content?: string[] | null
          id?: string
          moderated_at?: string | null
          moderated_content?: string | null
          moderation_reason?: string | null
          moderation_status?: string
          moderator_id?: string | null
          original_content?: string | null
          review_id: string
          updated_at?: string
        }
        Update: {
          auto_flagged?: boolean | null
          created_at?: string
          flagged_content?: string[] | null
          id?: string
          moderated_at?: string | null
          moderated_content?: string | null
          moderation_reason?: string | null
          moderation_status?: string
          moderator_id?: string | null
          original_content?: string | null
          review_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_review_moderation_review_id"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "business_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_events: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
        ]
      }
      service_offerings: {
        Row: {
          business_id: string
          category: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          business_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_services_business"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_role_audit_log: {
        Row: {
          change_reason: string | null
          changed_by: string | null
          created_at: string
          id: string
          new_role: Database["public"]["Enums"]["user_role"] | null
          old_role: Database["public"]["Enums"]["user_role"] | null
          user_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"] | null
          old_role?: Database["public"]["Enums"]["user_role"] | null
          user_id: string
        }
        Update: {
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"] | null
          old_role?: Database["public"]["Enums"]["user_role"] | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verification_badges: {
        Row: {
          badge_type: string
          business_id: string
          created_at: string
          expiry_date: string | null
          id: string
          status: string
          updated_at: string
          verification_data: Json | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          badge_type: string
          business_id: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          status?: string
          updated_at?: string
          verification_data?: Json | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          badge_type?: string
          business_id?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          status?: string
          updated_at?: string
          verification_data?: Json | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_verification_badges_business_id"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          admin_notes: string | null
          business_id: string
          created_at: string
          id: string
          processed_at: string | null
          processed_by: string | null
          request_type: string
          status: string
          submitted_documents: Json | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          business_id: string
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          request_type: string
          status?: string
          submitted_documents?: Json | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          business_id?: string
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          request_type?: string
          status?: string
          submitted_documents?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_verification_requests_business_id"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role: "business" | "customer" | "event_manager"
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
      user_role: ["business", "customer", "event_manager"],
    },
  },
} as const

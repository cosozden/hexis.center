/**
 * Supabase Database Types
 * ━━━━━━━━━━━━━━━━━━━━━━
 * Manual placeholder — regenerate with: npx supabase gen types typescript --local
 *
 * IMPORTANT: Update types must be defined explicitly (not as Partial<Insert>)
 * because self-referential paths like Database['public']['Tables'][...]['Insert']
 * cause circular type resolution in the Supabase SDK, making everything `never`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: 'pro' | 'business';
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
          trial_ends_at: string | null;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string;
          plan?: 'pro' | 'business';
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
          trial_ends_at?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          plan?: 'pro' | 'business';
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
          trial_ends_at?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          org_id: string | null;
          email: string;
          full_name: string | null;
          role: 'owner' | 'admin' | 'member';
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          org_id?: string | null;
          email: string;
          full_name?: string | null;
          role?: 'owner' | 'admin' | 'member';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string | null;
          email?: string;
          full_name?: string | null;
          role?: 'owner' | 'admin' | 'member';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_systems: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          description: string | null;
          purpose: string | null;
          provider: string | null;
          deployment_type: 'internal' | 'external' | 'both' | null;
          data_types: string[];
          processes_personal_data: boolean;
          eu_market: boolean;
          organisation_role: 'provider' | 'deployer' | 'both';
          deployment_status: 'planning' | 'development' | 'testing' | 'production' | 'retired';
          responsible_person: string | null;
          responsible_unit: string | null;
          observe_metadata: Json;
          invalidated_steps: string[];
          next_review_date: string | null;
          review_frequency_days: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          description?: string | null;
          purpose?: string | null;
          provider?: string | null;
          deployment_type?: 'internal' | 'external' | 'both' | null;
          data_types?: string[];
          processes_personal_data?: boolean;
          eu_market?: boolean;
          organisation_role?: 'provider' | 'deployer' | 'both';
          deployment_status?: 'planning' | 'development' | 'testing' | 'production' | 'retired';
          responsible_person?: string | null;
          responsible_unit?: string | null;
          observe_metadata?: Json;
          invalidated_steps?: string[];
          next_review_date?: string | null;
          review_frequency_days?: number;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          description?: string | null;
          purpose?: string | null;
          provider?: string | null;
          deployment_type?: 'internal' | 'external' | 'both' | null;
          data_types?: string[];
          processes_personal_data?: boolean;
          eu_market?: boolean;
          organisation_role?: 'provider' | 'deployer' | 'both';
          deployment_status?: 'planning' | 'development' | 'testing' | 'production' | 'retired';
          responsible_person?: string | null;
          responsible_unit?: string | null;
          observe_metadata?: Json;
          invalidated_steps?: string[];
          next_review_date?: string | null;
          review_frequency_days?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      risk_classifications: {
        Row: {
          id: string;
          system_id: string;
          risk_level: 'prohibited' | 'high' | 'limited' | 'gpai' | 'minimal';
          classification_path: Json;
          article_references: string[];
          exception_applied: boolean;
          exception_details: string | null;
          ai_insight: Json | null;
          ai_confidence: 'clearly_required' | 'likely_applies' | 'gray_area' | 'seek_legal_counsel' | null;
          ai_model: string | null;
          classified_at: string;
          classified_by: string | null;
        };
        Insert: {
          id?: string;
          system_id: string;
          risk_level: 'prohibited' | 'high' | 'limited' | 'gpai' | 'minimal';
          classification_path?: Json;
          article_references?: string[];
          exception_applied?: boolean;
          exception_details?: string | null;
          ai_insight?: Json | null;
          ai_confidence?: 'clearly_required' | 'likely_applies' | 'gray_area' | 'seek_legal_counsel' | null;
          ai_model?: string | null;
          classified_by?: string | null;
        };
        Update: {
          id?: string;
          system_id?: string;
          risk_level?: 'prohibited' | 'high' | 'limited' | 'gpai' | 'minimal';
          classification_path?: Json;
          article_references?: string[];
          exception_applied?: boolean;
          exception_details?: string | null;
          ai_insight?: Json | null;
          ai_confidence?: 'clearly_required' | 'likely_applies' | 'gray_area' | 'seek_legal_counsel' | null;
          ai_model?: string | null;
          classified_at?: string;
          classified_by?: string | null;
        };
        Relationships: [];
      };
      obligations: {
        Row: {
          id: string;
          system_id: string;
          obligation_key: string | null;
          title: string;
          description: string | null;
          article_reference: string;
          category: string;
          applies_to: 'provider' | 'deployer' | 'all';
          risk_levels: string[];
          deadline: string | null;
          deadline_source: string | null;
          status: 'not_started' | 'in_progress' | 'completed' | 'not_applicable';
          evidence_notes: string | null;
          how_to_guide: string | null;
          guidance_cache: Json | null;
          template_url: string | null;
          priority: number;
          completed_at: string | null;
          completed_by: string | null;
          sort_order: number;
          evidence_items_total: number;
          evidence_items_completed: number;
          evidence_attachments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          system_id: string;
          obligation_key?: string | null;
          title: string;
          description?: string | null;
          article_reference: string;
          category: string;
          applies_to?: 'provider' | 'deployer' | 'all';
          risk_levels: string[];
          deadline?: string | null;
          deadline_source?: string | null;
          status?: 'not_started' | 'in_progress' | 'completed' | 'not_applicable';
          evidence_notes?: string | null;
          how_to_guide?: string | null;
          guidance_cache?: Json | null;
          template_url?: string | null;
          priority?: number;
          sort_order?: number;
        };
        Update: {
          id?: string;
          system_id?: string;
          obligation_key?: string | null;
          title?: string;
          description?: string | null;
          article_reference?: string;
          category?: string;
          applies_to?: 'provider' | 'deployer' | 'all';
          risk_levels?: string[];
          deadline?: string | null;
          deadline_source?: string | null;
          status?: 'not_started' | 'in_progress' | 'completed' | 'not_applicable';
          evidence_notes?: string | null;
          how_to_guide?: string | null;
          guidance_cache?: Json | null;
          template_url?: string | null;
          priority?: number;
          completed_at?: string | null;
          completed_by?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessments: {
        Row: {
          id: string;
          system_id: string;
          oversight_level: number;
          monitoring_level: number;
          documentation_level: number;
          weighted_maturity: number;
          activation_posture: string;
          urgency_index: number;
          risk_exposure: 'low' | 'moderate' | 'elevated' | 'high';
          ai_insight: Json | null;
          ai_model: string | null;
          assessed_at: string;
          assessed_by: string | null;
        };
        Insert: {
          id?: string;
          system_id: string;
          oversight_level: number;
          monitoring_level: number;
          documentation_level: number;
          weighted_maturity: number;
          activation_posture: string;
          urgency_index: number;
          risk_exposure: 'low' | 'moderate' | 'elevated' | 'high';
          ai_insight?: Json | null;
          ai_model?: string | null;
          assessed_by?: string | null;
        };
        Update: {
          id?: string;
          system_id?: string;
          oversight_level?: number;
          monitoring_level?: number;
          documentation_level?: number;
          weighted_maturity?: number;
          activation_posture?: string;
          urgency_index?: number;
          risk_exposure?: 'low' | 'moderate' | 'elevated' | 'high';
          ai_insight?: Json | null;
          ai_model?: string | null;
          assessed_at?: string;
          assessed_by?: string | null;
        };
        Relationships: [];
      };
      actions: {
        Row: {
          id: string;
          system_id: string;
          obligation_id: string | null;
          title: string;
          description: string | null;
          priority: 'critical' | 'high' | 'medium' | 'low';
          status: 'todo' | 'in_progress' | 'done';
          estimated_hours: number | null;
          assigned_to: string | null;
          due_date: string | null;
          dimension_impact: string[];
          ai_reasoning: string | null;
          ai_generated: boolean;
          depends_on: string[];
          completed_at: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          system_id: string;
          obligation_id?: string | null;
          title: string;
          description?: string | null;
          priority?: 'critical' | 'high' | 'medium' | 'low';
          status?: 'todo' | 'in_progress' | 'done';
          estimated_hours?: number | null;
          assigned_to?: string | null;
          due_date?: string | null;
          dimension_impact?: string[];
          ai_reasoning?: string | null;
          ai_generated?: boolean;
          depends_on?: string[];
          sort_order?: number;
        };
        Update: {
          id?: string;
          system_id?: string;
          obligation_id?: string | null;
          title?: string;
          description?: string | null;
          priority?: 'critical' | 'high' | 'medium' | 'low';
          status?: 'todo' | 'in_progress' | 'done';
          estimated_hours?: number | null;
          assigned_to?: string | null;
          due_date?: string | null;
          dimension_impact?: string[];
          ai_reasoning?: string | null;
          ai_generated?: boolean;
          depends_on?: string[];
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      compliance_snapshots: {
        Row: {
          id: string;
          org_id: string;
          system_id: string | null;
          score: number;
          obligations_total: number;
          obligations_completed: number;
          actions_total: number;
          actions_completed: number;
          metadata: Json;
          score_breakdown: Json | null;
          snapshot_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          system_id?: string | null;
          score: number;
          obligations_total?: number;
          obligations_completed?: number;
          actions_total?: number;
          actions_completed?: number;
          metadata?: Json;
          score_breakdown?: Json | null;
        };
        Update: {
          id?: string;
          org_id?: string;
          system_id?: string | null;
          score?: number;
          obligations_total?: number;
          obligations_completed?: number;
          actions_total?: number;
          actions_completed?: number;
          metadata?: Json;
          score_breakdown?: Json | null;
          snapshot_at?: string;
        };
        Relationships: [];
      };
      advisor_conversations: {
        Row: {
          id: string;
          system_id: string;
          user_id: string;
          orient_step: 'observe' | 'risk' | 'identify' | 'evaluate' | 'navigate' | 'track';
          title: string | null;
          messages: Json;
          message_count: number;
          total_input_tokens: number;
          total_output_tokens: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          system_id: string;
          user_id: string;
          orient_step: 'observe' | 'risk' | 'identify' | 'evaluate' | 'navigate' | 'track';
          title?: string | null;
          messages?: Json;
          message_count?: number;
          total_input_tokens?: number;
          total_output_tokens?: number;
        };
        Update: {
          id?: string;
          system_id?: string;
          user_id?: string;
          orient_step?: 'observe' | 'risk' | 'identify' | 'evaluate' | 'navigate' | 'track';
          title?: string | null;
          messages?: Json;
          message_count?: number;
          total_input_tokens?: number;
          total_output_tokens?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      api_usage: {
        Row: {
          id: string;
          org_id: string;
          user_id: string;
          endpoint: string;
          model: string;
          input_tokens: number;
          output_tokens: number;
          cached_tokens: number;
          latency_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          user_id: string;
          endpoint: string;
          model: string;
          input_tokens?: number;
          output_tokens?: number;
          cached_tokens?: number;
          latency_ms?: number | null;
        };
        Update: {
          id?: string;
          org_id?: string;
          user_id?: string;
          endpoint?: string;
          model?: string;
          input_tokens?: number;
          output_tokens?: number;
          cached_tokens?: number;
          latency_ms?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      evidence_items: {
        Row: {
          id: string;
          obligation_id: string;
          title: string;
          description: string | null;
          is_completed: boolean;
          completed_at: string | null;
          completed_by: string | null;
          source: 'user' | 'ai_suggested' | 'template';
          ai_model: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          obligation_id: string;
          title: string;
          description?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          completed_by?: string | null;
          source?: 'user' | 'ai_suggested' | 'template';
          ai_model?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          obligation_id?: string;
          title?: string;
          description?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          completed_by?: string | null;
          source?: 'user' | 'ai_suggested' | 'template';
          ai_model?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      evidence_attachments: {
        Row: {
          id: string;
          obligation_id: string;
          evidence_item_id: string | null;
          attachment_type: 'file' | 'link';
          file_name: string;
          file_type: string | null;
          file_size: number | null;
          storage_path: string | null;
          external_url: string | null;
          description: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          obligation_id: string;
          evidence_item_id?: string | null;
          attachment_type: 'file' | 'link';
          file_name: string;
          file_type?: string | null;
          file_size?: number | null;
          storage_path?: string | null;
          external_url?: string | null;
          description?: string | null;
          uploaded_by?: string | null;
        };
        Update: {
          id?: string;
          obligation_id?: string;
          evidence_item_id?: string | null;
          attachment_type?: 'file' | 'link';
          file_name?: string;
          file_type?: string | null;
          file_size?: number | null;
          storage_path?: string | null;
          external_url?: string | null;
          description?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      governance_events: {
        Row: {
          id: string;
          org_id: string;
          system_id: string | null;
          event_type: string;
          orient_step: string | null;
          actor_id: string | null;
          previous_value: Json | null;
          new_value: Json | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          system_id?: string | null;
          event_type: string;
          orient_step?: string | null;
          actor_id?: string | null;
          previous_value?: Json | null;
          new_value?: Json | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          org_id?: string;
          system_id?: string | null;
          event_type?: string;
          orient_step?: string | null;
          actor_id?: string | null;
          previous_value?: Json | null;
          new_value?: Json | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_org_id: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
}

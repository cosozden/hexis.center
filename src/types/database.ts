/**
 * Supabase Database Types
 * ━━━━━━━━━━━━━━━━━━━━━━
 * Auto-generated with: npx supabase gen types typescript --local
 * This is a manual placeholder — regenerate after migration runs.
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
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
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
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
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
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['ai_systems']['Insert']>;
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
        Update: Partial<Database['public']['Tables']['risk_classifications']['Insert']>;
      };
      obligations: {
        Row: {
          id: string;
          system_id: string;
          title: string;
          description: string | null;
          article_reference: string;
          category: string;
          risk_levels: string[];
          deadline: string | null;
          deadline_source: string | null;
          status: 'not_started' | 'in_progress' | 'completed' | 'not_applicable';
          evidence_notes: string | null;
          how_to_guide: string | null;
          template_url: string | null;
          priority: number;
          completed_at: string | null;
          completed_by: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          system_id: string;
          title: string;
          description?: string | null;
          article_reference: string;
          category: string;
          risk_levels: string[];
          deadline?: string | null;
          deadline_source?: string | null;
          status?: 'not_started' | 'in_progress' | 'completed' | 'not_applicable';
          evidence_notes?: string | null;
          how_to_guide?: string | null;
          template_url?: string | null;
          priority?: number;
          sort_order?: number;
        };
        Update: Partial<Database['public']['Tables']['obligations']['Insert']>;
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
        Update: Partial<Database['public']['Tables']['assessments']['Insert']>;
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
        Update: Partial<Database['public']['Tables']['actions']['Insert']>;
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
        };
        Update: Partial<Database['public']['Tables']['compliance_snapshots']['Insert']>;
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
        Update: Partial<Database['public']['Tables']['advisor_conversations']['Insert']>;
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
        Update: Partial<Database['public']['Tables']['api_usage']['Insert']>;
      };
    };
    Functions: {
      get_user_org_id: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
}

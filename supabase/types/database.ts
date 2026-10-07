/**
 * AUTHORITATIVE Supabase Database types for this repository.
 *
 * Aligned with: supabase/migrations/20260810183000_initial_schema.sql
 *
 * Mobile imports these via mobile/types/database.ts (type-only re-export).
 * Do not maintain a second hand-edited copy of this schema.
 *
 * Regenerate after linking a Supabase project (from repo root):
 *   npx supabase gen types typescript --linked --schema public \
 *     > supabase/types/database.ts
 *
 * Or with a project ref:
 *   npx supabase gen types typescript --project-id <ref> --schema public \
 *     > supabase/types/database.ts
 *
 * After regenerating, re-apply any intentional hand annotations still required
 * (e.g. numeric as number | string, optional insert user_id) until codegen
 * matches our migration contract.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: Database['public']['Enums']['subscription_category'];
          price: number | string;
          currency: Database['public']['Enums']['currency_code'];
          billing_cycle: Database['public']['Enums']['billing_cycle'];
          renewal_date: string;
          reminder_offset: Database['public']['Enums']['reminder_offset'];
          auto_renew: boolean;
          status: Database['public']['Enums']['subscription_status'];
          notes: string;
          color: Database['public']['Enums']['subscription_category'];
          payment_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          /** Optional — Postgres DEFAULT auth.uid(); RLS still enforces ownership. */
          user_id?: string;
          name: string;
          category: Database['public']['Enums']['subscription_category'];
          /** Prefer decimal string (e.g. "15.99") to avoid float drift. */
          price: number | string;
          currency?: Database['public']['Enums']['currency_code'];
          billing_cycle: Database['public']['Enums']['billing_cycle'];
          renewal_date: string;
          reminder_offset?: Database['public']['Enums']['reminder_offset'];
          auto_renew?: boolean;
          status?: Database['public']['Enums']['subscription_status'];
          notes?: string;
          color?: Database['public']['Enums']['subscription_category'];
          payment_method?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: Database['public']['Enums']['subscription_category'];
          price?: number | string;
          currency?: Database['public']['Enums']['currency_code'];
          billing_cycle?: Database['public']['Enums']['billing_cycle'];
          renewal_date?: string;
          reminder_offset?: Database['public']['Enums']['reminder_offset'];
          auto_renew?: boolean;
          status?: Database['public']['Enums']['subscription_status'];
          notes?: string;
          color?: Database['public']['Enums']['subscription_category'];
          payment_method?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      handle_new_user: { Args: Record<string, never>; Returns: unknown };
      set_updated_at: { Args: Record<string, never>; Returns: unknown };
    };
    Enums: {
      /**
       * CHECK-constrained text in Postgres (not native ENUMs) so values can
       * evolve without painful ALTER TYPE. Mirrored here for TypeScript safety.
       */
      billing_cycle: 'weekly' | 'monthly' | 'yearly';
      currency_code: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD';
      reminder_offset:
        | 'off'
        | 'same_day'
        | 'days_before_1'
        | 'days_before_3'
        | 'days_before_7';
      subscription_status: 'active' | 'trial' | 'canceled';
      subscription_category:
        | 'entertainment'
        | 'music'
        | 'video_streaming'
        | 'cloud_storage'
        | 'productivity'
        | 'education'
        | 'fitness'
        | 'health'
        | 'gaming'
        | 'shopping'
        | 'finance'
        | 'news'
        | 'developer_tools'
        | 'ai_tools'
        | 'business'
        | 'food'
        | 'travel'
        | 'utilities'
        | 'security'
        | 'kids'
        | 'other';
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// ============================================================
// KitaKaya — Database Types (Supabase)
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TransactionType = "income" | "expense";
export type TransactionCategory =
  | "salary"
  | "freelance"
  | "investment"
  | "gift"
  | "other_income"
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "health"
  | "education"
  | "utilities"
  | "rent"
  | "insurance"
  | "savings"
  | "other_expense";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          monthly_income: number | null;
          monthly_budget: number | null;
          currency: string;
          timezone: string;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          monthly_income?: number | null;
          monthly_budget?: number | null;
          currency?: string;
          timezone?: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          monthly_income?: number | null;
          monthly_budget?: number | null;
          currency?: string;
          timezone?: string;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: TransactionType;
          category: TransactionCategory;
          amount: number;
          description: string;
          note: string | null;
          date: string;
          is_ai_generated: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: TransactionType;
          category: TransactionCategory;
          amount: number;
          description: string;
          note?: string | null;
          date?: string;
          is_ai_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: TransactionType;
          category?: TransactionCategory;
          amount?: number;
          description?: string;
          note?: string | null;
          date?: string;
          is_ai_generated?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          target_amount: number;
          current_amount: number;
          deadline: string | null;
          icon: string;
          color: string;
          is_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          target_amount: number;
          current_amount?: number;
          deadline?: string | null;
          icon?: string;
          color?: string;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          target_amount?: number;
          current_amount?: number;
          deadline?: string | null;
          icon?: string;
          color?: string;
          is_completed?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      savings_transactions: {
        Row: {
          id: string;
          goal_id: string;
          user_id: string;
          amount: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          goal_id: string;
          user_id: string;
          amount: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          goal_id?: string;
          user_id?: string;
          amount?: number;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      monthly_summaries: {
        Row: {
          id: string;
          user_id: string;
          year: number;
          month: number;
          total_income: number;
          total_expense: number;
          net_balance: number;
          pdf_url: string | null;
          email_sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          year: number;
          month: number;
          total_income?: number;
          total_expense?: number;
          net_balance?: number;
          pdf_url?: string | null;
          email_sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          year?: number;
          month?: number;
          total_income?: number;
          total_expense?: number;
          net_balance?: number;
          pdf_url?: string | null;
          email_sent_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      transaction_type: TransactionType;
      transaction_category: TransactionCategory;
    };
  };
}

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];
export type SavingsGoal = Database["public"]["Tables"]["savings_goals"]["Row"];
export type SavingsGoalInsert = Database["public"]["Tables"]["savings_goals"]["Insert"];
export type SavingsTransaction = Database["public"]["Tables"]["savings_transactions"]["Row"];
export type MonthlySummary = Database["public"]["Tables"]["monthly_summaries"]["Row"];

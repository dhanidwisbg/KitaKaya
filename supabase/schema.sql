-- ============================================================
-- KitaKaya — Database Schema & RLS Policies (Supabase)
-- Match types in lib/types/database.types.ts
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('income', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_category AS ENUM (
        'salary', 'freelance', 'investment', 'gift', 'other_income',
        'food', 'transport', 'shopping', 'entertainment', 'health',
        'education', 'utilities', 'rent', 'insurance', 'savings', 'other_expense'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    monthly_income NUMERIC(15, 2) DEFAULT 0,
    monthly_budget NUMERIC(15, 2) DEFAULT 0,
    currency TEXT DEFAULT 'IDR' NOT NULL,
    timezone TEXT DEFAULT 'Asia/Jakarta' NOT NULL,
    onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type transaction_type NOT NULL,
    category transaction_category NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    description TEXT NOT NULL,
    note TEXT,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    is_ai_generated BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Savings Goals Table
CREATE TABLE IF NOT EXISTS public.savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_amount NUMERIC(15, 2) NOT NULL,
    current_amount NUMERIC(15, 2) DEFAULT 0 NOT NULL,
    deadline DATE,
    icon TEXT DEFAULT 'target' NOT NULL,
    color TEXT DEFAULT '#30D158' NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Savings Transactions Table
CREATE TABLE IF NOT EXISTS public.savings_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES public.savings_goals(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Monthly Summaries Table
CREATE TABLE IF NOT EXISTS public.monthly_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_income NUMERIC(15, 2) DEFAULT 0 NOT NULL,
    total_expense NUMERIC(15, 2) DEFAULT 0 NOT NULL,
    net_balance NUMERIC(15, 2) DEFAULT 0 NOT NULL,
    pdf_url TEXT,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, year, month)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_summaries ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Transactions RLS
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- Savings Goals RLS
CREATE POLICY "Users can view own goals" ON public.savings_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.savings_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.savings_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.savings_goals FOR DELETE USING (auth.uid() = user_id);

-- Savings Transactions RLS
CREATE POLICY "Users can view own savings tx" ON public.savings_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own savings tx" ON public.savings_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Monthly Summaries RLS
CREATE POLICY "Users can view own summaries" ON public.monthly_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own summaries" ON public.monthly_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own summaries" ON public.monthly_summaries FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto create user profile upon auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url, onboarding_completed)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url',
        FALSE
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto update savings_goal current_amount when a savings_transaction is added
CREATE OR REPLACE FUNCTION public.sync_savings_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.savings_goals
    SET current_amount = current_amount + NEW.amount,
        is_completed = (current_amount + NEW.amount) >= target_amount,
        updated_at = timezone('utc'::text, now())
    WHERE id = NEW.goal_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_savings_tx_created ON public.savings_transactions;
CREATE TRIGGER on_savings_tx_created
    AFTER INSERT ON public.savings_transactions
    FOR EACH ROW EXECUTE FUNCTION public.sync_savings_goal_progress();

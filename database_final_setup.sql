-- =====================================================
-- BRRA COMPLETE DATABASE SETUP - FINAL VERSION
-- Copy and paste this entire file into Supabase SQL Editor
-- =====================================================

-- Step 1: Create helper function for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Ensure profiles table has RLS policies for reading
-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 3: Add new columns to profiles table
-- Core columns (if profiles table already exists)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nrc_no TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS salary NUMERIC;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_appointment DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS supervisor_email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS supervisor_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_return_after_last_leave DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_last_travel_allowance DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_annual_leave_year INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS annual_leave_balance INTEGER DEFAULT 30;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS local_leave_balance INTEGER DEFAULT 30;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sick_leave_balance INTEGER DEFAULT 90;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_supervisor BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_hr BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_ed BOOLEAN DEFAULT false;

-- Step 3: Drop leave_requests table if it exists (to start fresh)
DROP TABLE IF EXISTS public.leave_requests CASCADE;

-- Step 4: Create enums for leave management
DO $$ BEGIN
    CREATE TYPE leave_type AS ENUM (
      'Annual Leave',
      'Local Leave',
      'Casual Leave',
      'Sick Leave',
      'Maternity Leave',
      'Paternity Leave',
      'Compassionate Leave',
      'Study Leave',
      'Commutation of Leave'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE approval_status AS ENUM ('Pending', 'Approved', 'Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE leave_request_status AS ENUM (
      'Pending Supervisor',
      'Pending HR',
      'Pending ED',
      'Approved',
      'Rejected',
      'Cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 5: Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  employee_data JSONB NOT NULL,
  leave_type leave_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  requested_days INTEGER NOT NULL,
  commuted_days INTEGER DEFAULT 0,
  address_on_leave TEXT NOT NULL,
  station TEXT,
  last_leave_date DATE,
  months_since_last_leave INTEGER,
  rate_of_leave NUMERIC,
  accrued_leave_days INTEGER,
  division TEXT,
  supervisor_id TEXT,
  supervisor_name TEXT,
  supervisor_decision approval_status DEFAULT 'Pending',
  supervisor_notes TEXT,
  supervisor_action_date TIMESTAMP WITH TIME ZONE,
  hr_id TEXT,
  hr_name TEXT,
  hr_decision approval_status DEFAULT 'Pending',
  hr_notes TEXT,
  hr_action_date TIMESTAMP WITH TIME ZONE,
  hr_months_in_service INTEGER,
  ed_id TEXT,
  ed_name TEXT,
  ed_decision approval_status DEFAULT 'Pending',
  ed_notes TEXT,
  ed_action_date TIMESTAMP WITH TIME ZONE,
  ed_resume_duty_date DATE,
  approved_days INTEGER,
  status leave_request_status DEFAULT 'Pending Supervisor',
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 6: Enable RLS
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS Policies
CREATE POLICY "Users can view own leave requests" 
  ON public.leave_requests FOR SELECT 
  USING (auth.uid() = requester_id);

CREATE POLICY "Users can create leave requests" 
  ON public.leave_requests FOR INSERT 
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Staff and Admin can view all leave requests" 
  ON public.leave_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Supervisors can view their approval requests" 
  ON public.leave_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND email = leave_requests.supervisor_id
    )
  );

CREATE POLICY "HR can view their approval requests" 
  ON public.leave_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND email = leave_requests.hr_id
    )
  );

CREATE POLICY "ED can view their approval requests" 
  ON public.leave_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND email = leave_requests.ed_id
    )
  );

CREATE POLICY "Staff and Admin can update leave requests" 
  ON public.leave_requests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Approvers can update their assigned requests" 
  ON public.leave_requests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (
        email = leave_requests.supervisor_id OR
        email = leave_requests.hr_id OR
        email = leave_requests.ed_id
      )
    )
  );

-- Step 8: Create trigger
CREATE TRIGGER on_leave_request_updated
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Step 9: Create indexes
CREATE INDEX idx_leave_requests_requester ON public.leave_requests(requester_id);
CREATE INDEX idx_leave_requests_supervisor ON public.leave_requests(supervisor_id);
CREATE INDEX idx_leave_requests_hr ON public.leave_requests(hr_id);
CREATE INDEX idx_leave_requests_ed ON public.leave_requests(ed_id);
CREATE INDEX idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX idx_leave_requests_created_at ON public.leave_requests(created_at DESC);

-- =====================================================
-- PART 6: AUTO-CREATE PROFILE ON USER SIGNUP
-- =====================================================

-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, agency_name, role, is_approved)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'agency_name', ''),
    'user',
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SUCCESS! Database is ready!
-- =====================================================

SELECT 'Database setup complete! New users will be pending approval by default.' as status;

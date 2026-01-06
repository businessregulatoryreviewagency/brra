-- =====================================================
-- BRRA COMPLETE DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PART 1: USER ROLES & PROFILES (Already exists, but adding new fields)
-- =====================================================

-- Create user role enum (if not exists)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'staff', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table with leave management fields
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

-- =====================================================
-- PART 2: LEAVE MANAGEMENT ENUMS
-- =====================================================

-- Create leave type enum
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

-- Create approval status enum
DO $$ BEGIN
    CREATE TYPE approval_status AS ENUM ('Pending', 'Approved', 'Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create leave request status enum
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

-- =====================================================
-- PART 3: LEAVE REQUESTS TABLE
-- =====================================================

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Employee data (embedded)
  employee_data JSONB NOT NULL,
  
  -- Leave details
  leave_type leave_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  requested_days INTEGER NOT NULL,
  commuted_days INTEGER DEFAULT 0,
  address_on_leave TEXT NOT NULL,
  
  -- Local leave specific
  station TEXT,
  last_leave_date DATE,
  months_since_last_leave INTEGER,
  rate_of_leave NUMERIC,
  accrued_leave_days INTEGER,
  division TEXT,
  
  -- Supervisor approval (Part B)
  supervisor_id TEXT,
  supervisor_name TEXT,
  supervisor_decision approval_status DEFAULT 'Pending',
  supervisor_notes TEXT,
  supervisor_action_date TIMESTAMP WITH TIME ZONE,
  
  -- HR approval (Part C)
  hr_id TEXT,
  hr_name TEXT,
  hr_decision approval_status DEFAULT 'Pending',
  hr_notes TEXT,
  hr_action_date TIMESTAMP WITH TIME ZONE,
  hr_months_in_service INTEGER,
  
  -- ED approval (Part D)
  ed_id TEXT,
  ed_name TEXT,
  ed_decision approval_status DEFAULT 'Pending',
  ed_notes TEXT,
  ed_action_date TIMESTAMP WITH TIME ZONE,
  ed_resume_duty_date DATE,
  approved_days INTEGER,
  
  -- Overall status
  status leave_request_status DEFAULT 'Pending Supervisor',
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- PART 4: ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on leave_requests
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can create leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Staff and Admin can view all leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Supervisors can view their approval requests" ON public.leave_requests;
DROP POLICY IF EXISTS "HR can view their approval requests" ON public.leave_requests;
DROP POLICY IF EXISTS "ED can view their approval requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Staff and Admin can update leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Approvers can update their assigned requests" ON public.leave_requests;

-- Users can view their own leave requests
CREATE POLICY "Users can view own leave requests" 
  ON public.leave_requests FOR SELECT 
  USING (auth.uid() = requester_id);

-- Users can create leave requests
CREATE POLICY "Users can create leave requests" 
  ON public.leave_requests FOR INSERT 
  WITH CHECK (auth.uid() = requester_id);

-- Staff and Admin can view all leave requests
CREATE POLICY "Staff and Admin can view all leave requests" 
  ON public.leave_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Supervisors can view requests assigned to them
CREATE POLICY "Supervisors can view their approval requests" 
  ON public.leave_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND email = leave_requests.supervisor_id
    )
  );

-- HR can view requests assigned to them
CREATE POLICY "HR can view their approval requests" 
  ON public.leave_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND email = leave_requests.hr_id
    )
  );

-- ED can view requests assigned to them
CREATE POLICY "ED can view their approval requests" 
  ON public.leave_requests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND email = leave_requests.ed_id
    )
  );

-- Staff and Admin can update all leave requests
CREATE POLICY "Staff and Admin can update leave requests" 
  ON public.leave_requests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Approvers can update requests assigned to them
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

-- =====================================================
-- PART 5: TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS on_leave_request_updated ON public.leave_requests;
CREATE TRIGGER on_leave_request_updated
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- PART 6: INDEXES FOR PERFORMANCE
-- =====================================================

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_leave_requests_requester;
DROP INDEX IF EXISTS idx_leave_requests_supervisor;
DROP INDEX IF EXISTS idx_leave_requests_hr;
DROP INDEX IF EXISTS idx_leave_requests_ed;
DROP INDEX IF EXISTS idx_leave_requests_status;
DROP INDEX IF EXISTS idx_leave_requests_created_at;

-- Create indexes
CREATE INDEX idx_leave_requests_requester ON public.leave_requests(requester_id);
CREATE INDEX idx_leave_requests_supervisor ON public.leave_requests(supervisor_id);
CREATE INDEX idx_leave_requests_hr ON public.leave_requests(hr_id);
CREATE INDEX idx_leave_requests_ed ON public.leave_requests(ed_id);
CREATE INDEX idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX idx_leave_requests_created_at ON public.leave_requests(created_at DESC);

-- =====================================================
-- PART 7: SUBMISSIONS TABLE (If not exists)
-- =====================================================

-- Create submission status enum
DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'under_review', 'pending_documents', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create submissions table if not exists
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  submission_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status submission_status DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can create submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can update own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Staff can view all submissions" ON public.submissions;
DROP POLICY IF EXISTS "Staff can update all submissions" ON public.submissions;

-- Submissions policies
CREATE POLICY "Users can view own submissions" 
  ON public.submissions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions" 
  ON public.submissions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions" 
  ON public.submissions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all submissions" 
  ON public.submissions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff can update all submissions" 
  ON public.submissions FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Trigger for submissions
DROP TRIGGER IF EXISTS on_submission_updated ON public.submissions;
CREATE TRIGGER on_submission_updated
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- Verify tables were created
SELECT 'Setup Complete! Tables created:' as message;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'leave_requests', 'submissions')
ORDER BY table_name;

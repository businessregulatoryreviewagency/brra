-- =====================================================
-- BRRA DATABASE SETUP - SAFE VERSION
-- Copy and paste this entire file into Supabase SQL Editor
-- =====================================================

-- Step 1: Add new columns to profiles table
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

-- Step 2: Drop leave_requests table if it exists (to start fresh)
DROP TABLE IF EXISTS public.leave_requests CASCADE;

-- Step 3: Create enums for leave management
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

-- Step 4: Create leave_requests table
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

-- Step 5: Enable RLS
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS Policies
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

-- Step 7: Create trigger
CREATE TRIGGER on_leave_request_updated
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Step 8: Create indexes
CREATE INDEX idx_leave_requests_requester ON public.leave_requests(requester_id);
CREATE INDEX idx_leave_requests_supervisor ON public.leave_requests(supervisor_id);
CREATE INDEX idx_leave_requests_hr ON public.leave_requests(hr_id);
CREATE INDEX idx_leave_requests_ed ON public.leave_requests(ed_id);
CREATE INDEX idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX idx_leave_requests_created_at ON public.leave_requests(created_at DESC);

-- =====================================================
-- DONE! Leave Management System is ready to use!
-- =====================================================

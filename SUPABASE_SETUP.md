# Supabase Database Setup for BRRA Website

## Step 1: Create User Profiles Table

Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/mexuzucjqssvycxssjhj/editor):

```sql
-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'user');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  agency_name TEXT,
  role user_role DEFAULT 'user',
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, agency_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'agency_name',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## Step 2: Create Submissions Table

```sql
-- Create enum for submission status
CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'under_review', 'pending_documents', 'approved', 'rejected');

-- Create submissions table
CREATE TABLE public.submissions (
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

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions" 
  ON public.submissions FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create submissions
CREATE POLICY "Users can create submissions" 
  ON public.submissions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions
CREATE POLICY "Users can update own submissions" 
  ON public.submissions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Staff and Admins can view all submissions
CREATE POLICY "Staff can view all submissions" 
  ON public.submissions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Staff and Admins can update all submissions
CREATE POLICY "Staff can update all submissions" 
  ON public.submissions FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Trigger to update timestamp
CREATE TRIGGER on_submission_updated
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## Step 3: Create Initial Admin User

After creating your first user account, run this to make them an admin:

```sql
-- Replace 'admin@brra.org.zm' with your admin email
UPDATE public.profiles 
SET role = 'admin', is_approved = true 
WHERE email = 'admin@brra.org.zm';
```

## User Roles

### Admin
- Full system access
- Manage all users (approve, assign roles)
- View and manage all submissions
- System configuration

### Staff
- Review and process submissions
- View all submissions
- Update submission status
- Add review notes

### User (Regular)
- Submit RIA frameworks
- View own submissions
- Track submission status
- Requires approval to access system

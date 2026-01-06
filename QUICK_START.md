# Quick Start Guide - BRRA Website

## 🎯 Setup Steps (5 minutes)

### 1. Database Setup

Go to your Supabase project: https://supabase.com/dashboard/project/mexuzucjqssvycxssjhj

**SQL Editor** → Run these commands:

```sql
-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'user');

-- Create profiles table
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

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, agency_name, role)
  VALUES (
    NEW.id, NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'agency_name',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create submissions table
CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'under_review', 'pending_documents', 'approved', 'rejected');

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

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions" ON public.submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own submissions" ON public.submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all submissions" ON public.submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
CREATE POLICY "Staff can update all submissions" ON public.submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
```

### 2. Create Your Admin Account

1. Open http://localhost:3000
2. Click **"Portal Login"**
3. Switch to **"Register"** tab
4. Fill in your details and register
5. Go back to Supabase SQL Editor and run:

```sql
-- Replace with your email
UPDATE public.profiles 
SET role = 'admin', is_approved = true 
WHERE email = 'your-email@example.com';
```

6. Refresh the page and login!

### 3. Test the System

#### As Admin:
- Go to `/admin` - See all users and submissions
- Approve pending users
- Assign roles (user → staff → admin)
- View system statistics

#### As Staff (create a staff account):
1. Register a new user
2. As admin, approve them and set role to 'staff'
3. Login as staff → Go to `/staff`
4. Review submissions, update status, add notes

#### As Regular User:
1. Register a new user
2. As admin, approve them (keep role as 'user')
3. Login as user → Go to `/user`
4. Create submissions, track status

## 🎨 User Flow

```
New User Registers
    ↓
Account Created (role: user, approved: false)
    ↓
Sees "Pending Approval" Screen
    ↓
Admin Reviews in Admin Dashboard
    ↓
Admin Approves (is_approved: true)
    ↓
User Can Access Dashboard
    ↓
Admin Can Upgrade to Staff if Needed
```

## 🔑 Default Routes

- `/` - Public home page
- `/about` - About BRRA
- `/services` - Services overview
- `/departments` - Department details
- `/news` - News and updates
- `/contact` - Contact form
- `/dashboard` - Auto-redirects based on role:
  - Admin → `/admin`
  - Staff → `/staff`
  - User → `/user`

## 📊 Dashboard Features

### Admin Dashboard
- ✅ User management table
- ✅ Role assignment dropdown
- ✅ User approval buttons
- ✅ All submissions view
- ✅ System statistics

### Staff Dashboard
- ✅ All submissions list
- ✅ Review modal with status updates
- ✅ Add review notes
- ✅ Status filters
- ✅ Submission statistics

### User Dashboard
- ✅ My submissions list
- ✅ Create new submission
- ✅ Submit drafts for review
- ✅ View review feedback
- ✅ Track submission status

## 🚨 Troubleshooting

**Issue**: User can't login after registration
- **Solution**: Admin needs to approve the user first

**Issue**: "Access Denied" message
- **Solution**: Check user role matches the route requirements

**Issue**: Profile not loading
- **Solution**: Ensure the trigger `on_auth_user_created` is created

**Issue**: Can't see submissions
- **Solution**: Check RLS policies are created correctly

## 📞 Need Help?

Check the full documentation in `README.md` and `SUPABASE_SETUP.md`

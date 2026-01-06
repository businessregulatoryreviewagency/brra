# BRRA Website - Business Regulatory Review Agency

Official website for the Business Regulatory Review Agency of Zambia with complete role-based authentication system.

## 🚀 Features

### Public Website
- **Home Page** - Hero section, services overview, strategic plan, e-Registry search
- **About Page** - Mission, leadership team, core functions, values, partners
- **Departments** - 7 specialized departments with detailed information
- **Services** - RIA, RSC, and e-Services descriptions
- **News** - Filterable news articles with categories
- **Contact** - Contact form with location map

### Authentication System (Supabase)
- **Portal Login/Registration** - Professional modal interface
- **Role-Based Access Control** - Admin, Staff, and Regular User roles
- **Protected Routes** - Dashboard access based on user role and approval status
- **Session Management** - Automatic user session handling

### Role-Specific Dashboards

#### Admin Dashboard (`/admin`)
- View all users and submissions
- Approve/reject user registrations
- Assign user roles (admin, staff, user)
- Manage system-wide settings
- View comprehensive statistics

#### Staff Dashboard (`/staff`)
- Review all submissions
- Update submission status (under review, approved, rejected, etc.)
- Add review notes
- Track submission workflow
- View submission statistics

#### User Dashboard (`/user`)
- Create new submissions
- View own submissions
- Track submission status
- Submit drafts for review
- View review feedback

## 🔧 Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Icons**: Remix Icon

## 📦 Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up Supabase**:
   - Follow instructions in `SUPABASE_SETUP.md`
   - Run the SQL scripts in your Supabase SQL Editor
   - Create your first admin user

3. **Start development server**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
```

## 🔐 User Roles

### Admin
- Full system access
- User management (approve, assign roles)
- View and manage all submissions
- System configuration

### Staff
- Review and process submissions
- View all submissions
- Update submission status
- Add review notes
- Cannot manage users

### User (Regular)
- Submit RIA frameworks
- View own submissions only
- Track submission status
- Upload documents
- **Requires admin approval** to access dashboard

## 🗄️ Database Schema

### Tables

#### `profiles`
- `id` - UUID (references auth.users)
- `email` - User email
- `full_name` - Full name
- `phone` - Phone number
- `agency_name` - Agency/organization name
- `role` - User role (admin, staff, user)
- `is_approved` - Approval status
- `created_at`, `updated_at` - Timestamps

#### `submissions`
- `id` - UUID
- `user_id` - Submitter ID
- `submission_id` - Human-readable ID (e.g., RIA-2024-001)
- `title` - Submission title
- `description` - Description
- `status` - Status (draft, submitted, under_review, pending_documents, approved, rejected)
- `reviewed_by` - Staff/admin who reviewed
- `reviewed_at` - Review timestamp
- `review_notes` - Feedback from reviewer
- `created_at`, `updated_at` - Timestamps

## 🔄 User Registration Flow

1. User registers via Portal Login modal
2. Account created with role: `user`, approved: `false`
3. User sees "Pending Approval" message
4. Admin reviews registration in Admin Dashboard
5. Admin approves user → `is_approved: true`
6. User can now access User Dashboard
7. Admin can upgrade user to `staff` role if needed

## 🎨 Design System

### Colors
- **Primary Blue**: #2563EB, #1E3A8A
- **Emerald Green**: #10B981, #059669
- **Neutral Grays**: #F9FAFB, #F3F4F6, #E5E7EB
- **Accent Colors**: Amber, Red for status indicators

### Typography
- **Headings**: Bold, 2xl-6xl
- **Body**: Regular, sm-base
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 📱 Responsive Design

- **Mobile First**: Base styles for < 640px
- **Tablet**: 768px (md) - Layout shifts
- **Desktop**: 1024px (lg) - Full multi-column layouts
- **Large**: 1280px (xl) - Maximum width containers

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only view/edit their own data
- Staff/Admin can view all submissions
- Only Admins can manage users
- Password reset functionality
- Secure session management

## 📝 Environment Variables

Create a `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚦 Getting Started

### For Development
1. Run `npm install`
2. Set up Supabase (see SUPABASE_SETUP.md)
3. Run `npm run dev`
4. Visit http://localhost:3000

### Create First Admin
1. Register a user account
2. In Supabase SQL Editor, run:
```sql
UPDATE public.profiles 
SET role = 'admin', is_approved = true 
WHERE email = 'your-email@example.com';
```

### Test the System
1. **As Admin**: Approve users, assign roles, view all data
2. **As Staff**: Review submissions, update status
3. **As User**: Create submissions, track status

## 📞 Support

- **Phone**: +260 211 259165
- **Email**: info@brra.org.zm
- **Address**: Plot No. 2251, Fairley Road, Ridgeway, LUSAKA, ZAMBIA

## 📄 License

© 2024 Business Regulatory Review Agency. All rights reserved.

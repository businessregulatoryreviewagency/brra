# BRRA Leave Management System - Implementation Guide

## ✅ System Successfully Implemented

The comprehensive Leave Management System has been integrated into the BRRA website with full functionality for Admin and Staff roles only.

## 🔐 Access Control

**Only Admin and Staff can access the Leave Management System**
- Route: `/leave-management`
- Protected by `RoleBasedRoute` component
- Regular users will see "Access Denied" if they try to access

## 📋 Features Implemented

### 1. **Leave Dashboard**
- Leave balance cards (Annual: 30 days, Local: 30 days, Sick: 90 days)
- Quick action buttons
- Recent leave requests display
- Pending approvals counter for approvers

### 2. **Leave Types (8 Total)**
- Annual Leave (3-tier approval)
- Local/Casual Leave (simplified approval)
- Sick Leave
- Maternity Leave
- Paternity Leave
- Compassionate Leave
- Study Leave
- Commutation of Leave

### 3. **Annual Leave Form (4-Part)**
- **Part A**: Auto-filled employee information + user inputs
- **Part B**: Supervisor selection
- **Part C**: HR Officer selection
- **Part D**: Executive Director selection
- Automatic working days calculation (excludes weekends & Zambian holidays)

### 4. **Local Leave Form (2-Part)**
- **Part 1**: Employee info + leave accrual calculation
- **Part 2**: Single approver (ED or Head of Department)
- Simplified workflow

### 5. **Approval Workflow**
```
Annual Leave Flow:
Employee → Supervisor → HR → ED → Approved/Rejected

Local Leave Flow:
Employee → ED/Head of Dept → Approved/Rejected
```

### 6. **Leave History**
- Filterable table (All, Approved, Pending, Rejected)
- Print functionality for official leave forms
- Complete approval chain display

### 7. **Leave Approvals**
- Role-based tabs (Supervisor, HR, ED)
- Approve/Reject with notes
- Review modal with full employee details
- Status updates trigger workflow progression

### 8. **Working Days Calculation**
- Excludes weekends (Saturday & Sunday)
- Excludes Zambian public holidays (2025 & 2026)
- Real-time calculation as dates change

## 🗄️ Database Setup

Run the SQL in `LEAVE_MANAGEMENT_SETUP.md`:

```bash
1. Create leave_requests table
2. Add leave management fields to profiles table
3. Set up Row Level Security policies
4. Assign roles (is_supervisor, is_hr, is_ed)
```

## 🚀 How to Use

### For Admin/Staff:
1. Login to your dashboard
2. Click "Leave Management System" banner
3. Access all features:
   - Apply for Leave (Annual or Local)
   - View Leave History
   - Review Approvals (if assigned as approver)

### Assign Approver Roles:
```sql
-- Make user a supervisor
UPDATE public.profiles 
SET is_supervisor = true 
WHERE email = 'supervisor@brra.org.zm';

-- Make user HR
UPDATE public.profiles 
SET is_hr = true 
WHERE email = 'hr@brra.org.zm';

-- Make user ED
UPDATE public.profiles 
SET is_ed = true 
WHERE email = 'ed@brra.org.zm';
```

## 📊 Components Structure

```
src/
├── pages/
│   └── LeaveManagement.jsx (Main container)
├── components/leave/
│   ├── LeaveDashboard.jsx (Overview & balances)
│   ├── LeaveForm.jsx (Annual leave 4-part form)
│   ├── LocalLeaveForm.jsx (Local leave 2-part form)
│   ├── LeaveHistory.jsx (All requests table + print)
│   └── LeaveApprovals.jsx (Role-based approval interface)
└── utils/
    └── leaveCalculations.js (Working days, holidays, helpers)
```

## 🎨 Key Features

### Working Days Calculation
- **Zambian Holidays 2025**: 15 public holidays
- **Zambian Holidays 2026**: 15 public holidays
- Automatically excludes weekends
- Real-time calculation

### Print Functionality
- Official BRRA leave form format
- All 4 parts included (A, B, C, D)
- Signature lines for approvers
- Distribution notice
- Browser print dialog

### Approval Workflow
- **Supervisor**: Reviews first, can approve/reject
- **HR**: Reviews after supervisor approval
- **ED**: Final approval authority
- Any level can reject (stops workflow)
- Notes required for rejection

### Status Tracking
- Pending Supervisor (Yellow)
- Pending HR (Blue)
- Pending ED (Purple)
- Approved (Green)
- Rejected (Red)

## 🔔 Email Notifications (Ready for Integration)

The system is prepared for email notifications at these points:
- New request submitted → Supervisor
- Supervisor approves → HR
- Supervisor rejects → Employee
- HR approves → ED
- HR rejects → Employee
- ED approves → Employee (Success!)
- ED rejects → Employee

**Note**: Email sending is logged to console. Integrate with your email service (e.g., Supabase Edge Functions, SendGrid, etc.)

## 📝 Profile Requirements

Before applying for leave, users must complete:
- Employee Number
- NRC Number
- Position
- Grade
- Salary
- Date of Appointment
- Department (agency_name)

## 🎯 Access Points

### From Admin Dashboard:
- Click "Leave Management System" banner at top

### From Staff Dashboard:
- Click "Leave Management System" banner at top

### Direct URL:
- `/leave-management` (Protected - Admin & Staff only)

## 🔒 Security

- ✅ Row Level Security enabled
- ✅ Users can only view their own requests
- ✅ Approvers can only see requests assigned to them
- ✅ Staff/Admin can view all requests
- ✅ Role-based route protection
- ✅ Approval status validation

## 📈 Future Enhancements (Not Implemented)

- Automatic leave balance deduction
- Annual leave cycle reset (January 1st)
- Leave carryover rules
- Overlap detection (multiple staff on leave)
- Calendar view of team leave
- Email notification integration
- Mobile app version

## 🐛 Troubleshooting

**Issue**: Can't access Leave Management
- **Solution**: Ensure user role is 'admin' or 'staff'

**Issue**: Can't see approvals
- **Solution**: Assign approver role (is_supervisor, is_hr, or is_ed)

**Issue**: Working days showing 0
- **Solution**: Ensure start_date is before or equal to end_date

**Issue**: Can't submit leave
- **Solution**: Complete profile information first

## 📞 Support

For issues or questions about the Leave Management System:
- Check database setup in `LEAVE_MANAGEMENT_SETUP.md`
- Review component code in `src/components/leave/`
- Verify user roles and permissions

---

**System Status**: ✅ Fully Operational
**Last Updated**: January 2026
**Version**: 1.0.0

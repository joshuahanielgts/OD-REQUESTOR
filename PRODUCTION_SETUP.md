# SRM University OD Management System - Production Setup

## System Overview
A comprehensive On-Duty (OD) Management System built for SRM University with a multi-level approval workflow:

**Student → Class In-Charge → HOD → Final Approval**

## Technology Stack
- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with custom SRM branding
- **Real-time**: Supabase Realtime for notifications

## Production User Data Integration

### Student Users (54 total)
The system now includes the exact 54 students from CSE III-A class with their correct credentials:

**Sample Students:**
- Rohit Vikkranth S (rs5483@srmist.edu.in)
- Vinaya VR (vv7533@srmist.edu.in)
- Suryaprakasham (sb1995@srmist.edu.in)
- Nilesh J (nj6187@srmist.edu.in)
- Ashwin (ac3881@srmist.edu.in)
- Mohammed Ihsan N (mn0024@srmist.edu.in)
- And 48 more students...

### Faculty Users
- **Class In-Charge**: Mrs. Durgadevi (durgadevi@srmist.edu.in) - for CSE III-A
- **HOD**: Dr. Golda Dilip (hod@srm) - Department of Computer Science

## SRM Logo Integration
- ✅ Logo successfully integrated across all pages
- ✅ Navbar header shows SRM University logo with branding
- ✅ Login pages display prominent SRM logo
- ✅ Home page features centered SRM branding
- ✅ Responsive logo sizes (small, medium, large)

## Database Schema
Enhanced database with the following tables:

### Users Table
- Comprehensive user profiles with roles
- Student academic information (roll_no, class, year, section)
- Faculty designation and department assignment

### OD Requests Table
- Multi-step approval workflow
- Date range support (from_date to to_date)
- Proof document upload capability
- Status tracking through approval chain

### Notifications Table
- Real-time notification system
- Automatic notifications for status changes
- Role-based notification filtering

## Deployment Ready Features

### 1. Production Data Migration
- **File**: `database/production_users.sql`
- **Content**: All 54 real students + 2 faculty members
- **Usage**: Run this SQL script in your Supabase dashboard

### 2. Environment Setup
- Configure your `.env.local` with Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup Steps
1. Create Supabase project
2. Run the schema setup from `database/schema.sql`
3. Execute production user data from `database/production_users.sql`
4. Enable Row Level Security policies

## User Workflow

### For Students
1. Login with SRM credentials (e.g., rs5483@srmist.edu.in)
2. Create OD request with date range and reason
3. Upload proof documents
4. Track approval status through dashboard

### For Class In-Charge (Mrs. Durgadevi)
1. Login to faculty dashboard
2. Review pending OD requests for CSE III-A
3. Approve/reject with comments
4. Forward approved requests to HOD

### For HOD (Dr. Golda Dilip)
1. Login to HOD dashboard
2. Review class in-charge approved requests
3. Provide final approval/rejection
4. Monitor department-wide statistics

## Key Features

### Multi-Level Approval
- **Step 1**: Student submits request
- **Step 2**: Class In-Charge review
- **Step 3**: HOD final approval
- **Step 4**: System generates approval certificate

### Real-time Notifications
- Instant notifications for status changes
- Role-based notification filtering
- Email integration ready

### Document Management
- Secure proof document upload
- File viewer integration
- Download capabilities for approved requests

### Responsive Design
- Mobile-friendly interface
- SRM University branding
- Intuitive user experience

## Access URLs
- **Home Page**: http://localhost:3000
- **Student Login**: http://localhost:3000/login/student
- **Faculty Login**: http://localhost:3000/login/faculty
- **HOD Login**: http://localhost:3000/login/hod

## Production Deployment
The system is ready for production deployment with:
- ✅ Complete user data integration
- ✅ SRM logo branding
- ✅ Multi-level approval workflow
- ✅ Real-time notifications
- ✅ Secure authentication
- ✅ Mobile responsive design

## Next Steps
1. Deploy to production environment (Vercel/Netlify)
2. Configure production Supabase instance
3. Set up email notifications
4. Configure domain and SSL
5. Train users on system usage

---

**System Status**: ✅ Complete and Production Ready
**Last Updated**: Current
**Logo Integration**: ✅ Complete
**User Data**: ✅ Real production data integrated (54 students + 2 faculty)
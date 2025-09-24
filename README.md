# SRM University - OD Management System

A comprehensive On-Duty (OD) Management System built with Next.js 14, Supabase, and Tailwind CSS for SRM University.

## 🌟 Features

### Student Features
- **Role Selection**: Choose between Student, Faculty, or HOD login
- **Request Submission**: Multi-step form for OD requests with file uploads
- **Request Tracking**: View pending, approved, and rejected requests
- **Real-time Updates**: Live status updates when requests are approved/rejected
- **Document Upload**: Support for proof of participation and supporting documents

### Faculty Features
- **Dashboard**: View all approved OD activities
- **Filtering**: Filter by year, class, and section
- **Export**: Export data as PDF or CSV
- **Proof Viewing**: Preview and download student proof documents
- **Real-time Data**: Auto-refresh functionality

### HOD Features
- **Request Management**: Card-based view for pending requests
- **Approval System**: Quick approve/reject actions
- **Proof Review**: Preview attached documents before making decisions
- **Status Tracking**: Separate tabs for pending, approved, and rejected requests
- **Real-time Notifications**: Instant updates when new requests arrive

### Common Features
- **Authentication**: Secure login with Supabase Auth
- **Real-time Updates**: Live data synchronization across all users
- **Responsive Design**: Mobile-first responsive UI
- **Export Functionality**: PDF and CSV export capabilities
- **File Management**: Secure file upload and storage with Supabase Storage

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage, Realtime)
- **Icons**: Lucide React
- **PDF Export**: jsPDF with AutoTable
- **Notifications**: React Hot Toast
- **Form Validation**: Zod (ready to implement)

## 📂 Project Structure

```
od-requestor/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Role selection homepage
│   ├── login/
│   │   ├── student/page.tsx      # Student login
│   │   ├── faculty/page.tsx      # Faculty login
│   │   └── hod/page.tsx          # HOD login
│   ├── student/dashboard/page.tsx # Student dashboard
│   ├── faculty/dashboard/page.tsx # Faculty dashboard
│   ├── hod/dashboard/page.tsx     # HOD dashboard
│   ├── approved-od-list/page.tsx  # All approved requests
│   ├── today-od-activities/page.tsx # Today's activities
│   ├── my-requests/page.tsx       # Student's own requests
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── Navbar.tsx               # Navigation with SRM logo
│   ├── LoginCard.tsx            # Shared login form
│   ├── AuthGuard.tsx            # Route protection
│   ├── RequestForm.tsx          # Multi-step OD request form
│   ├── RequestTable.tsx         # Data table with filtering
│   ├── ProofViewer.tsx          # Document preview modal
│   └── FilterBar.tsx            # Year/Class/Section filters
├── hooks/                       # Custom React hooks
│   └── useAuth.tsx              # Authentication context
├── lib/                         # Utility libraries
│   └── supabaseClient.ts        # Supabase configuration
├── utils/                       # Utility functions
│   └── exportUtils.ts           # PDF/CSV export functions
├── database/                    # Database schema and migrations
│   └── schema.sql              # Complete database setup
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd od-requestor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://yvjvbrsxlyyaopyngxnk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2anZicnN4bHl5YW9weW5neG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzMwMzgsImV4cCI6MjA3NDMwOTAzOH0.YMH1V9LCprFE-hRU632E-smLrE90T4y7lq0kDpgl4uA
```

### 4. Database Setup
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the contents of `database/schema.sql`
4. This will create:
   - Users table with roles (student, faculty, hod)
   - OD requests table with status tracking
   - Storage bucket for proof documents
   - Row Level Security policies
   - Sample data for testing

### 5. Storage Setup
1. In Supabase dashboard, go to Storage
2. Create a bucket named `od-proofs`
3. Set it to public access
4. The schema.sql file includes the necessary policies

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Usage Guide

### For Students:
1. Select "Student" from the homepage
2. Login with your credentials
3. Click "Request OD" to submit new requests
4. Track request status in the dashboard tabs
5. View all your requests in "My Requests" page

### For Faculty:
1. Select "Faculty" from the homepage
2. Login with your credentials
3. View approved OD activities
4. Use filters to find specific students or events
5. Export data as needed

### For HOD:
1. Select "HOD" from the homepage
2. Login with your credentials
3. Review pending requests in card format
4. Preview attached proofs before deciding
5. Approve or reject requests with a single click

## 🔐 Sample Login Credentials

If you ran the schema.sql file, you can use these test accounts:

**Student Account:**
- Email: student1@srmist.edu.in
- Password: password123
- Roll No: RA2311003040056

**Faculty Account:**
- Email: faculty1@srmist.edu.in
- Password: password123

**HOD Account:**
- Email: hod1@srmist.edu.in
- Password: password123

## 🎨 UI Design Features

- **SRM Branding**: Official colors and logo placement
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Consistent Styling**: Card-based layouts with proper spacing
- **Interactive Elements**: Hover effects and smooth transitions
- **Loading States**: Proper loading indicators and skeleton screens
- **Toast Notifications**: Success/error feedback for user actions
- **Modal Dialogs**: Clean overlay modals for forms and document viewing

## 🔧 Development Notes

### Key Components:
- **AuthGuard**: Protects routes based on user role
- **RequestForm**: 4-step form with file upload support
- **RequestTable**: Sortable table with proof viewing
- **Real-time Updates**: Supabase subscriptions for live data

### Database Design:
- **Row Level Security**: Users can only access their own data
- **Foreign Key Constraints**: Proper relational data integrity
- **Indexes**: Optimized for common query patterns
- **Triggers**: Automatic timestamp updates and approval tracking

### File Handling:
- **Supabase Storage**: Secure file uploads with signed URLs
- **File Validation**: Size and type restrictions
- **Public Access**: Proof documents are publicly viewable

## 🚀 Deployment

### Vercel Deployment (Recommended):
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment:
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and queries:
- Create an issue in the GitHub repository
- Contact the development team
- Check the Supabase documentation for backend issues

## 📈 Future Enhancements

- [ ] Email notifications for status updates
- [ ] Bulk approval for multiple requests
- [ ] Advanced reporting and analytics
- [ ] Mobile app development
- [ ] Integration with university calendar system
- [ ] Automated attendance tracking
- [ ] QR code generation for events
- [ ] SMS notifications
- [ ] Advanced search and filtering
- [ ] Data archival and cleanup
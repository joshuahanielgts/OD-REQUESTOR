# Production Migration Guide
## SRM University OD Management System - CSE Department

This guide walks you through migrating from test data to production with real user credentials for CSE III-A class.

## Prerequisites

1. **Supabase Project Setup** - Ensure your Supabase project is active
2. **Database Access** - SQL Editor access in Supabase dashboard
3. **Authentication Setup** - Supabase Auth should be enabled

## Step 1: Database Migration

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to "SQL Editor" in the sidebar

2. **Run the Production Migration Script**
   - Copy the contents of `database/production_users.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

   This will:
   - Clear all existing test data
   - Insert 54 real students from CSE III-A (3rd year)
   - Add Mrs. Durgadevi as Class In-Charge for CSE-III-A
   - Add Dr. Golda Dilip as HOD for CSE Department

## Step 2: Authentication User Creation

Since Supabase handles authentication separately from the database, you need to create auth users:

### Option A: Manual Creation (Recommended for testing)

1. **Go to Authentication → Users in Supabase**
2. **Create users manually for key personnel:**

   **Class In-Charge:**
   - Email: `durgadevi@srmist.edu.in`
   - Password: `ClassInCharge@2024` (or secure password)
   
   **HOD:**
   - Email: `hod.cse@srmist.edu.in` 
   - Password: `HOD@2024` (or secure password)

### Option B: Bulk Creation via API (For all students)

Use the Supabase Auth API to create users programmatically:

```javascript
// Example script for bulk user creation
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key
)

const students = [
  { email: 'ac4982@srmist.edu.in', password: 'Student@2024' },
  { email: 'ar1506@srmist.edu.in', password: 'Student@2024' },
  // ... add all student emails
]

for (const student of students) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: student.email,
    password: student.password,
    email_confirm: true
  })
}
```

## Step 3: Environment Configuration

Ensure your environment variables are set:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 4: Application Configuration

1. **Update any hardcoded references**
   - Check for any test user IDs in the code
   - Verify role-based access control

2. **Test the workflow**
   - Student login and OD request creation
   - Class In-Charge approval process
   - HOD final approval

## Step 5: Verification

1. **Database Check**
   ```sql
   -- Verify users were created
   SELECT count(*) FROM users WHERE role = 'student';  -- Should be 54
   SELECT count(*) FROM users WHERE role = 'class_incharge';  -- Should be 1
   SELECT count(*) FROM users WHERE role = 'hod';  -- Should be 1
   ```

2. **Authentication Check**
   - Test login with faculty credentials
   - Test student account access (if created)

3. **Workflow Test**
   - Create a sample OD request
   - Test approval chain: Student → Class In-Charge → HOD

## Production Data Summary

**Students:** 54 students from CSE III-A (3rd year, 2025 batch)
- Roll numbers: RA2111003010001 to RA2111003010054
- All have @srmist.edu.in email addresses
- Year: 3rd Year, Section: III-A

**Faculty:**
- **Mrs. Durgadevi** (durgadevi@srmist.edu.in) - Class In-Charge for CSE-III-A
- **Dr. Golda Dilip** (hod.cse@srmist.edu.in) - HOD, CSE Department

**Department Structure:**
- CSE Department only (2 sections: III-A and III-B available, 4 years total)
- Current data covers CSE III-A section only

## Security Notes

1. **Change default passwords immediately after testing**
2. **Enable email confirmation for production**
3. **Set up proper password policies**
4. **Review Row Level Security policies**

## Support

If you encounter issues:
1. Check Supabase logs for database errors
2. Verify environment variables are correctly set
3. Ensure authentication users exist for faculty members
4. Test with a simple student login first

## Rollback Plan

To revert to test data:
```sql
-- Run the original schema.sql to restore test data
-- This will recreate the sample users and data
```

---

Your SRM University OD Management System is now ready for production use with real CSE III-A class data (3rd year students)!
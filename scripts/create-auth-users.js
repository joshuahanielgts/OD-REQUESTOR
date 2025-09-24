// Supabase Auth User Creation Script
// This script creates all 54 students + 2 faculty members with their passwords
// Run this in your browser console or as a Node.js script after setting up Supabase

import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY' // Need service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// All users with their credentials EXACTLY from the uploaded file
const usersToCreate = [
    // Students from CSE III-A - EXACT passwords from uploaded credentials
    { email: 'rs5483@srmist.edu.in', password: 'Rohit@002', name: 'Rohit Vikkranth S', roll_no: 'rs5483' },
    { email: 'vv7533@srmist.edu.in', password: 'Vinaya@002', name: 'Vinaya VR', roll_no: 'vv7533' },
    { email: 'sb1995@srmist.edu.in', password: 'Surya@002', name: 'Suryaprakasham', roll_no: 'sb1995' },
    { email: 'nj6187@srmist.edu.in', password: 'Nilesh@002', name: 'Nilesh J', roll_no: 'nj6187' },
    { email: 'ac3881@srmist.edu.in', password: 'Ashwin@002', name: 'Ashwin', roll_no: 'ac3881' },
    { email: 'mn0024@srmist.edu.in', password: 'Mohammed@002', name: 'Mohammed Ihsan N', roll_no: 'mn0024' },
    { email: 'sk8027@srmist.edu.in', password: 'Shanmathi@002', name: 'Shanmathi K', roll_no: 'sk8027' },
    { email: 'ad0561@srmist.edu.in', password: 'Ashritha@002', name: 'Ashritha', roll_no: 'ad0561' },
    { email: 'ry9932@srmist.edu.in', password: 'Roshini@002', name: 'Roshini', roll_no: 'ry9932' },
    { email: 'jk7808@srmist.edu.in', password: 'Jaivigensh@002', name: 'Jaivigensh', roll_no: 'jk7808' },
    { email: 'vg6422@srmist.edu.in', password: 'Vaasavi@002', name: 'Vaasavi', roll_no: 'vg6422' },
    { email: 'sl2359@srmist.edu.in', password: 'Sai@002', name: 'Sai Shivaram', roll_no: 'sl2359' },
    { email: 'aj2075@srmist.edu.in', password: 'Athish@002', name: 'Athish Kirthik JD', roll_no: 'aj2075' },
    { email: 'rg0134@srmist.edu.in', password: 'Radhika@002', name: 'Radhika Ganesh', roll_no: 'rg0134' },
    { email: 'pk7960@srmist.edu.in', password: 'Koduri@002', name: 'Koduri Pranav', roll_no: 'pk7960' },
    { email: 'sk1897@srmist.edu.in', password: 'Sirushti@002', name: 'Sirushti', roll_no: 'sk1897' },
    { email: 'sr6160@srmist.edu.in', password: 'Sharan@002', name: 'R Sharan', roll_no: 'sr6160' },
    { email: 'ss1492@srmist.edu.in', password: 'Tharun@002', name: 'Tharun Kumaar SD', roll_no: 'ss1492' },
    { email: 'cv1432@srmist.edu.in', password: 'Caroline@002', name: 'Caroline Vineeta', roll_no: 'cv1432' },
    { email: 'vr3569@srmist.edu.in', password: 'Venkatapathy@002', name: 'Venkatapathy', roll_no: 'vr3569' },
    { email: 'mb1109@srmist.edu.in', password: 'Mani@002', name: 'Mani Shankar', roll_no: 'mb1109' },
    { email: 'as2353@srmist.edu.in', password: 'Arjun@002', name: 'Arjun KS', roll_no: 'as2353' },
    { email: 'cr7821@srmist.edu.in', password: 'Charu@002', name: 'Charu Nethra', roll_no: 'cr7821' },
    { email: 'vs7190@srmist.edu.in', password: 'Vedika@002', name: 'Vedika Singh', roll_no: 'vs7190' },
    { email: 'ar6917@srmist.edu.in', password: 'Archana@002', name: 'Archana R', roll_no: 'ar6917' },
    { email: 'dr1571@srmist.edu.in', password: 'Divya@002', name: 'Divya', roll_no: 'dr1571' },
    { email: 'ss8795@srmist.edu.in', password: 'Sharan@002', name: 'S Sharan', roll_no: 'ss8795' },
    { email: 'sm0343@srmist.edu.in', password: 'Senthil@002', name: 'Senthil Nathan', roll_no: 'sm0343' },
    { email: 'ss8045@srmist.edu.in', password: 'Samiksha@002', name: 'Samiksha', roll_no: 'ss8045' },
    { email: 'jj9568@srmist.edu.in', password: 'Joshua@056', name: 'J Joshua Haniel', roll_no: 'jj9568' },
    { email: 'gv2212@srmist.edu.in', password: 'Deepti@002', name: 'Deepti Varsha', roll_no: 'gv2212' },
    { email: 'sk8361@srmist.edu.in', password: 'Sneha@002', name: 'Sneha Kumari', roll_no: 'sk8361' },
    { email: 'gr3026@srmist.edu.in', password: 'Gautam@002', name: 'Gautam', roll_no: 'gr3026' },
    { email: 'sr3590@srmist.edu.in', password: 'Shreya@002', name: 'Shreya', roll_no: 'sr3590' },
    { email: 'sg3142@srmist.edu.in', password: 'Sai@002', name: 'Sai Siva Ganesh', roll_no: 'sg3142' },
    { email: 'ss1833@srmist.edu.in', password: 'Sricharan@002', name: 'Sricharan', roll_no: 'ss1833' },
    { email: 'jc8930@srmist.edu.in', password: 'Jithin@002', name: 'Jithin CM', roll_no: 'jc8930' },
    { email: 'aa1142@srmist.edu.in', password: 'Arjun@002', name: 'Arjun Ashkar', roll_no: 'aa1142' },
    { email: 'ps1770@srmist.edu.in', password: 'Priangshu@002', name: 'Priangshu', roll_no: 'ps1770' },
    { email: 'jd9812@srmist.edu.in', password: 'Janardhan@002', name: 'Janardhan D', roll_no: 'jd9812' },
    { email: 'am4696@srmist.edu.in', password: 'Anoop@002', name: 'Anoop Mahesh', roll_no: 'am4696' },
    { email: 'ag2008@srmist.edu.in', password: 'Akshaya@002', name: 'Akshaya G', roll_no: 'ag2008' },
    { email: 'ts0372@srmist.edu.in', password: 'Tamizhselvan@002', name: 'Tamizhselvan', roll_no: 'ts0372' },
    { email: 'ps2881@srmist.edu.in', password: 'Prateek@002', name: 'Prateek Sharma', roll_no: 'ps2881' },
    { email: 'rg5749@srmist.edu.in', password: 'Rohith@002', name: 'Rohith G', roll_no: 'rg5749' },
    { email: 'rr9014@srmist.edu.in', password: 'Raj@002', name: 'Raj Ratna Rana', roll_no: 'rr9014' },
    { email: 'sd6403@srmist.edu.in', password: 'Sadhana@002', name: 'Sadhana S', roll_no: 'sd6403' },
    { email: 'ml6167@srmist.edu.in', password: 'Milendra@002', name: 'Milendra Labana', roll_no: 'ml6167' },
    { email: 'nb6703@srmist.edu.in', password: 'Nishanthini@002', name: 'Nishanthini', roll_no: 'nb6703' },
    { email: 'sm6568@srmist.edu.in', password: 'Annie@002', name: 'Annie Margaret', roll_no: 'sm6568' },
    { email: 'rm5260@srmist.edu.in', password: 'Rohith@002', name: 'Rohith M', roll_no: 'rm5260' },
    { email: 'jj5237@srmist.edu.in', password: 'Jeyanirudh@002', name: 'Jeyanirudh', roll_no: 'jj5237' },
    { email: 'as2532@srmist.edu.in', password: 'Arjun@002', name: 'Arjun Singh', roll_no: 'as2532' },
    { email: 'kc2771@srmist.edu.in', password: 'Kethaki@002', name: 'Kethaki Chelli', roll_no: 'kc2771' },
    { email: 'ss4085@srmist.edu.in', password: 'Surya@002', name: 'Surya Sivakumar', roll_no: 'ss4085' },
    { email: 'as0440@srmist.edu.in', password: 'Anshika@002', name: 'Anshika Shukla', roll_no: 'as0440' },
    { email: 'ys7013@srmist.edu.in', password: 'Yashwant@002', name: 'Yashwant S', roll_no: 'ys7013' },

    // Faculty Members
    { email: 'maryshyni@srmist.edu.in', password: 'Faculty@2024', name: 'Mrs. Mary Shyni', roll_no: null, role: 'class_incharge' },
    { email: 'hod@srm', password: 'HOD@2024', name: 'Dr. Golda Dilip', roll_no: null, role: 'hod' }
]; { email: 'ss1833@srmist.edu.in', password: 'Sricharan@002', name: 'Sricharan', roll_no: 'ss1833' }, { email: 'jc8930@srmist.edu.in', password: 'Jithin@002', name: 'Jithin CM', roll_no: 'jc8930' }, { email: 'aa1142@srmist.edu.in', password: 'Arjun@002', name: 'Arjun Ashkar', roll_no: 'aa1142' }, { email: 'ps1770@srmist.edu.in', password: 'Priangshu@002', name: 'Priangshu', roll_no: 'ps1770' }, { email: 'jd9812@srmist.edu.in', password: 'Janardhan@002', name: 'Janardhan D', roll_no: 'jd9812' }, { email: 'am4696@srmist.edu.in', password: 'Anoop@002', name: 'Anoop Mahesh', roll_no: 'am4696' }, { email: 'ag2008@srmist.edu.in', password: 'Akshaya@002', name: 'Akshaya G', roll_no: 'ag2008' }, { email: 'ts0372@srmist.edu.in', password: 'Tamizhselvan@002', name: 'Tamizhselvan', roll_no: 'ts0372' }, { email: 'ps2881@srmist.edu.in', password: 'Prateek@002', name: 'Prateek Sharma', roll_no: 'ps2881' }, { email: 'rg5749@srmist.edu.in', password: 'Rohith@002', name: 'Rohith G', roll_no: 'rg5749' }, { email: 'rr9014@srmist.edu.in', password: 'Raj@002', name: 'Raj Ratna Rana', roll_no: 'rr9014' }, { email: 'sd6403@srmist.edu.in', password: 'Sadhana@002', name: 'Sadhana S', roll_no: 'sd6403' }, { email: 'ml6167@srmist.edu.in', password: 'Milendra@002', name: 'Milendra Labana', roll_no: 'ml6167' }, { email: 'nb6703@srmist.edu.in', password: 'Nishanthini@002', name: 'Nishanthini', roll_no: 'nb6703' }, { email: 'sm6568@srmist.edu.in', password: 'Annie@002', name: 'Annie Margaret', roll_no: 'sm6568' }, { email: 'rm5260@srmist.edu.in', password: 'RohithM@002', name: 'Rohith M', roll_no: 'rm5260' }, { email: 'jj5237@srmist.edu.in', password: 'Jeyanirudh@002', name: 'Jeyanirudh', roll_no: 'jj5237' }, { email: 'as2532@srmist.edu.in', password: 'ArjunSingh@002', name: 'Arjun Singh', roll_no: 'as2532' }, { email: 'kc2771@srmist.edu.in', password: 'Kethaki@002', name: 'Kethaki Chelli', roll_no: 'kc2771' }, { email: 'ss4085@srmist.edu.in', password: 'Surya@002', name: 'Surya Sivakumar', roll_no: 'ss4085' }, { email: 'as0440@srmist.edu.in', password: 'Anshika@002', name: 'Anshika Shukla', roll_no: 'as0440' }, { email: 'ys7013@srmist.edu.in', password: 'Yashwant@002', name: 'Yashwant S', roll_no: 'ys7013' },

// Faculty Members
{ email: 'maryshyni@srmist.edu.in', password: 'Faculty@2024', name: 'Mrs. Mary Shyni', roll_no: null, role: 'class_incharge' }, { email: 'hod@srm', password: 'HOD@2024', name: 'Dr. Golda Dilip', roll_no: null, role: 'hod' }
];

async function createUsersWithAuth() {
    console.log('🚀 Starting user creation process...');
    console.log(`📊 Total users to create: ${usersToCreate.length}`);

    const results = [];

    for (let i = 0; i < usersToCreate.length; i++) {
        const user = usersToCreate[i];
        console.log(`\n👤 Creating user ${i + 1}/${usersToCreate.length}: ${user.name} (${user.email})`);

        try {
            // Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    name: user.name,
                    roll_no: user.roll_no
                }
            });

            if (authError) {
                console.error(`❌ Auth error for ${user.email}:`, authError.message);
                results.push({ email: user.email, success: false, error: authError.message });
                continue;
            }

            // Create user profile in database
            const profileData = {
                id: authData.user.id,
                name: user.name,
                email: user.email,
                roll_no: user.roll_no,
                class: user.role ? null : 'B.Tech CSE',
                year: user.role ? null : '3rd Year',
                section: user.role ? null : 'III-A',
                role: user.role || 'student',
                department: 'CSE',
                is_class_incharge_for: user.role === 'class_incharge' ? 'CSE-III-A' : null
            };

            const { error: profileError } = await supabase
                .from('users')
                .insert([profileData]);

            if (profileError) {
                console.error(`❌ Profile error for ${user.email}:`, profileError.message);
                results.push({ email: user.email, success: false, error: profileError.message });
            } else {
                console.log(`✅ Successfully created: ${user.name}`);
                results.push({ email: user.email, success: true, id: authData.user.id });
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.error(`❌ Unexpected error for ${user.email}:`, error);
            results.push({ email: user.email, success: false, error: error.message });
        }
    }

    // Summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log('\n📊 CREATION SUMMARY:');
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    if (failed.length > 0) {
        console.log('\n❌ Failed users:');
        failed.forEach(f => console.log(`   - ${f.email}: ${f.error}`));
    }

    console.log('\n🎉 User creation process completed!');
    return results;
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createUsersWithAuth, usersToCreate };
} else {
    // For browser console usage
    window.createUsersWithAuth = createUsersWithAuth;
    window.usersToCreate = usersToCreate;
}

/*
USAGE INSTRUCTIONS:

1. BROWSER CONSOLE METHOD:
   - Go to your Supabase dashboard
   - Open browser developer tools (F12)
   - Paste this entire script in the console
   - Update the supabaseUrl and supabaseServiceKey variables
   - Run: createUsersWithAuth()

2. NODE.JS METHOD:
   - Save this file as create-auth-users.js
   - Install: npm install @supabase/supabase-js
   - Update the credentials in the file
   - Run: node create-auth-users.js

3. CREDENTIALS NEEDED:
   - YOUR_SUPABASE_URL: From project settings
   - YOUR_SUPABASE_SERVICE_ROLE_KEY: From project settings (NOT the anon key!)

IMPORTANT NOTES:
- You need the SERVICE ROLE key (not anon key) for admin.createUser()
- This will create 54 students + 2 faculty = 56 total users
- Each user will be able to login with their email and password
- Profile data will be automatically synced to your users table
*/
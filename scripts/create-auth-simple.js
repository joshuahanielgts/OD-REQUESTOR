const { createClient } = require('@supabase/supabase-js')

// Replace with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const usersToCreate = [
    // Students with actual passwords from credentials file
    { email: 'rs5483@srmist.edu.in', password: 'Rohit@002', name: 'Rohit Vikkranth S', roll_no: 'rs5483' },
    { email: 'vv7533@srmist.edu.in', password: 'Vinaya@002', name: 'Vinaya VR', roll_no: 'vv7533' },
    { email: 'jj9568@srmist.edu.in', password: 'Joshua@056', name: 'J Joshua Haniel', roll_no: 'jj9568' },
    // ... (add all 54 students here)

    // Faculty
    { email: 'maryshyni@srmist.edu.in', password: 'Faculty@2024', name: 'Mrs. Mary Shyni', role: 'class_incharge' },
    { email: 'hod@srm', password: 'HOD@2024', name: 'Dr. Golda Dilip', role: 'hod' }
]

async function createAuthUsers() {
    console.log('Creating authentication users...')

    for (const user of usersToCreate) {
        try {
            const { data, error } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true
            })

            if (error) {
                console.error(`Error creating ${user.email}:`, error.message)
            } else {
                console.log(`✅ Created: ${user.name} (${user.email})`)
            }
        } catch (err) {
            console.error(`Failed to create ${user.email}:`, err)
        }
    }
}

createAuthUsers()
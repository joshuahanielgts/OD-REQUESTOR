/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
                protocol: 'https',
                hostname: 'yvjvbrsxlyyaopyngxnk.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
            // For any placeholder images or external images
            {
                protocol: 'https',
                hostname: '**',
            }
        ],
    },
}

module.exports = nextConfig
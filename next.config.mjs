/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'sanex.co.id'
            },
            {
                protocol: 'https',
                hostname: 'allofresh.id'
            }
        ]
    }
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['autopilot-mortality-strict.ngrok-free.dev'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.vercel-storage.com'
            }
        ]
    },
};

export default nextConfig;

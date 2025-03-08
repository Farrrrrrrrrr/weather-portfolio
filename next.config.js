/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['openweathermap.org', 'cdn.weatherapi.com'],
  },
  env: {
    NEXT_PUBLIC_WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
    NEXT_PUBLIC_MAPS_API_KEY: process.env.NEXT_PUBLIC_MAPS_API_KEY,
  },
  // Prevent 'window is not defined' during SSR of packages that rely on browser APIs
  experimental: {
    scrollRestoration: true,
  },
  webpack: (config) => {
    // Resolve issues between React 18 and React 19 dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom')
    };
    return config;
  },
  // Transpile dependencies if needed
  transpilePackages: ['@tremor/react']
};

module.exports = nextConfig;

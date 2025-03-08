import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;

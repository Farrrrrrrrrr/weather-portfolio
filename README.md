# Indonesia Weather App

A Next.js application for tracking real-time weather information across Indonesia.

## Features

- Real-time weather data for cities across Indonesia
- 5-day weather forecast with hourly breakdown
- Interactive map showing weather conditions
- Weather alerts and notifications for extreme weather events
- Air quality information for urban areas
- Bilingual support (English and Bahasa Indonesia)
- Light and dark mode

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key_here
NEXT_PUBLIC_MAPS_API_KEY=your_maps_api_key_here
```

You can get a free API key from [OpenWeatherMap](https://openweathermap.org/api).

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: Tailwind CSS, React
- **API**: OpenWeatherMap
- **Maps**: Leaflet
- **Charts**: Chart.js
- **Internationalization**: next-i18next

## Deployment

This app can be easily deployed on Vercel or any other hosting provider that supports Next.js.

## License

MIT

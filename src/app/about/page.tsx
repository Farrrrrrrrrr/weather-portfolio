import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">About Indonesia Weather App</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg">
          Indonesia Weather App provides real-time weather information for cities across Indonesia, 
          utilizing data from both international and local sources to ensure accurate and relevant forecasts.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Sources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</h3>
            <div className="flex justify-center mb-4">
              <Image 
                src="/bmkg-logo.png" 
                alt="BMKG Logo" 
                width={200} 
                height={100}
                className="h-auto"
              />
            </div>
            <p>
              BMKG is Indonesia's official Meteorology, Climatology, and Geophysical Agency. Our app 
              prioritizes BMKG data for Indonesian cities to provide the most locally relevant and accurate 
              weather information directly from Indonesia's official meteorological authority.
            </p>
            <div className="mt-4">
              <a 
                href="https://data.bmkg.go.id/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Visit BMKG Website
              </a>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">OpenWeatherMap</h3>
            <div className="flex justify-center mb-4">
              <Image 
                src="/openweathermap-logo.png" 
                alt="OpenWeatherMap Logo" 
                width={200} 
                height={100}
                className="h-auto"
              />
            </div>
            <p>
              OpenWeatherMap provides global weather data through APIs. Our app uses OpenWeatherMap as a 
              supplementary data source and fallback option to ensure consistent weather information is 
              always available.
            </p>
            <div className="mt-4">
              <a 
                href="https://openweathermap.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Visit OpenWeatherMap Website
              </a>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">About Indonesia's Weather</h2>
        
        <p>
          Indonesia has a tropical climate with two distinct monsoon seasons: the dry season (May to October) 
          and the rainy season (November to April). As the world's largest archipelago, Indonesia's weather 
          patterns can vary significantly across different regions.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Climate Regions</h3>
        
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Western Indonesia</strong> (Java, Sumatra): More pronounced rainy seasons, higher annual rainfall</li>
          <li><strong>Eastern Indonesia</strong> (Papua, Maluku): Less distinct seasons, more consistent rainfall throughout the year</li>
          <li><strong>Central Indonesia</strong> (Sulawesi, Kalimantan): Intermediate patterns between western and eastern regions</li>
          <li><strong>Southern Indonesia</strong> (Bali, East Nusa Tenggara): More pronounced dry season</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Weather Phenomena</h3>
        
        <p>
          Indonesia experiences various weather phenomena that are important to monitor:
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Monsoons:</strong> Seasonal wind patterns that bring heavy rainfall</li>
          <li><strong>Tropical Cyclones:</strong> More common in southern regions</li>
          <li><strong>El Niño and La Niña:</strong> Global climate patterns that significantly impact Indonesia's rainfall</li>
          <li><strong>Local Wind Patterns:</strong> Including land and sea breezes that affect coastal areas</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Technical Information</h2>
        
        <p>
          This application is built using Next.js and integrates multiple weather data sources with a focus on 
          providing accurate information specifically for Indonesian locations. It includes features like 
          real-time weather tracking, 5-day forecasts, air quality monitoring, and weather alerts.
        </p>
        
        <div className="mt-8">
          <Link href="/" className="text-primary hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

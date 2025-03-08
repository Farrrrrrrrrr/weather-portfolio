import Image from "next/image";

interface WeatherCardProps {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  dataSource?: string;
}

// Helper function to get temperature class
const getTemperatureClass = (temp: number): string => {
  if (temp >= 30) return "temperature-hot";
  if (temp >= 25) return "temperature-warm";
  if (temp >= 20) return "temperature-mild";
  if (temp >= 15) return "temperature-cool";
  return "temperature-cold";
};

export function WeatherCard({ 
  city, 
  temperature, 
  condition, 
  icon, 
  humidity, 
  windSpeed,
  dataSource = 'OpenWeatherMap'
}: WeatherCardProps) {
  const roundedTemp = Math.round(temperature);
  const tempClass = getTemperatureClass(roundedTemp);
  
  return (
    <div className="weather-card hover:scale-[1.02] transition-transform">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{city}</h3>
        {dataSource && (
          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            {dataSource}
          </span>
        )}
      </div>
      <div className="flex items-center mb-2">
        <Image 
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={condition}
          width={50}
          height={50}
          className="mr-2"
        />
        <span className={`text-3xl font-bold ${tempClass}`}>{roundedTemp}°C</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-2">{condition}</p>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>Humidity: {humidity}%</div>
        <div>Wind: {windSpeed} m/s</div>
      </div>
    </div>
  );
}

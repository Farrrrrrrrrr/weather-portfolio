import { SearchBar } from "@/components/search-bar";
import { FeaturedCities } from "@/components/featured-cities";
import { WeatherMap } from "@/components/weather-map";
import { WeatherAlerts } from "@/components/weather-alerts";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Indonesia Weather Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Real-time weather information for cities across Indonesia
        </p>
        <SearchBar />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Featured Cities</h2>
            <FeaturedCities />
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Weather Map</h2>
            <div className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <WeatherMap />
            </div>
          </section>
        </div>

        <div>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Weather Alerts</h2>
            <WeatherAlerts />
          </section>
        </div>
      </div>
    </div>
  );
}

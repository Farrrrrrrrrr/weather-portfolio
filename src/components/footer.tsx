import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Indonesia Weather App</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time weather information for cities across Indonesia
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Weather Map
                </Link>
              </li>
              <li>
                <Link href="/forecast" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  5-Day Forecast
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.bmkg.go.id/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  BMKG Indonesia
                </a>
              </li>
              <li>
                <a 
                  href="https://openweathermap.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  OpenWeatherMap
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Indonesia Weather App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

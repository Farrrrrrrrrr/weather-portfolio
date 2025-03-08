import axios from 'axios';

// Base URL for BMKG API
const BMKG_BASE_URL = 'https://api.bmkg.go.id/publik';

// Interface for Indonesian area codes (kode wilayah)
interface AreaCode {
  id: string;
  name: string;
}

// Major Indonesian cities with their BMKG area codes
// Note: These codes need to be verified with actual BMKG area codes
export const INDONESIAN_CITY_CODES: Record<string, AreaCode> = {
  'jakarta': { id: '501397', name: 'Jakarta' },
  'surabaya': { id: '501545', name: 'Surabaya' },
  'bandung': { id: '501212', name: 'Bandung' },
  'medan': { id: '501075', name: 'Medan' },
  'makassar': { id: '501865', name: 'Makassar' },
  'yogyakarta': { id: '501494', name: 'Yogyakarta' },
  'denpasar': { id: '501741', name: 'Denpasar' },
  'palembang': { id: '501178', name: 'Palembang' },
  'manado': { id: '501677', name: 'Manado' },
  'jayapura': { id: '501933', name: 'Jayapura' },
  // Add more cities as needed
};

/**
 * Fetch weather data from BMKG for a specific city using area code
 * @param cityCode The BMKG area code for the city
 */
export async function fetchBMKGWeather(cityCode: string) {
  try {
    const response = await axios.get(`${BMKG_BASE_URL}/prakiraan-cuaca`, {
      params: {
        adm4: cityCode
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching BMKG data for city code ${cityCode}:`, error);
    throw error;
  }
}

/**
 * Get weather data from BMKG for a city by name
 * @param cityName The name of the city
 */
export async function getBMKGWeatherByCity(cityName: string) {
  const normalizedCityName = cityName.toLowerCase();
  const cityCode = INDONESIAN_CITY_CODES[normalizedCityName]?.id;
  
  if (!cityCode) {
    throw new Error(`No BMKG area code found for city: ${cityName}`);
  }
  
  return fetchBMKGWeather(cityCode);
}

/**
 * Parse BMKG weather data to match our app's format
 * @param bmkgData Raw data from BMKG API
 */
export function parseBMKGWeatherData(bmkgData: any) {
  try {
    // Note: The exact structure of BMKG data needs to be determined
    // This is a placeholder implementation that would need to be updated
    // based on actual API response structure
    const parsedData = {
      name: bmkgData.location?.name || 'Unknown',
      main: {
        temp: parseFloat(bmkgData.parameter?.temperature?.value || 0),
        humidity: parseFloat(bmkgData.parameter?.humidity?.value || 0),
        pressure: parseFloat(bmkgData.parameter?.pressure?.value || 1013)
      },
      weather: [{
        main: bmkgData.parameter?.weather?.text || 'Clear',
        description: bmkgData.parameter?.weather?.description || 'clear sky',
        icon: mapBMKGWeatherCodeToIcon(bmkgData.parameter?.weather?.code || '0')
      }],
      wind: {
        speed: parseFloat(bmkgData.parameter?.wind?.speed || 0),
        deg: parseFloat(bmkgData.parameter?.wind?.direction || 0)
      },
      visibility: parseInt(bmkgData.parameter?.visibility?.value || 10000),
      sys: {
        sunrise: bmkgData.parameter?.astronomy?.sunrise || Math.floor(Date.now() / 1000) - 21600,
        sunset: bmkgData.parameter?.astronomy?.sunset || Math.floor(Date.now() / 1000) + 21600
      },
      timezone: 25200, // UTC+7 for Western Indonesian Time
      dt: Math.floor(Date.now() / 1000)
    };
    
    return parsedData;
  } catch (error) {
    console.error('Error parsing BMKG weather data:', error);
    throw error;
  }
}

/**
 * Map BMKG weather codes to OpenWeatherMap icon codes
 * This is an approximation and would need to be refined
 * @param bmkgCode Weather code from BMKG
 */
function mapBMKGWeatherCodeToIcon(bmkgCode: string): string {
  // This mapping would need to be updated based on actual BMKG codes
  const codeMapping: Record<string, string> = {
    '0': '01d', // Clear sky
    '1': '02d', // Few clouds
    '2': '03d', // Scattered clouds
    '3': '04d', // Broken clouds
    '45': '09d', // Shower rain
    '60': '10d', // Rain
    '95': '11d', // Thunderstorm
    '71': '13d', // Snow
    '45': '50d', // Mist
    // Add more mappings as needed
  };
  
  return codeMapping[bmkgCode] || '01d';
}

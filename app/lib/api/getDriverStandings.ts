import { F1_API_BASE_URL } from "@/app/constants";
import { RawDriverStandings } from "@/app/types/driverStandings";

// Define proper Next.js fetch options type
interface NextFetchRequestConfig {
    revalidate?: number | false;
    tags?: string[];
}
  
interface ExtendedRequestInit extends RequestInit {
    next?: NextFetchRequestConfig;
}

const CACHE_CONFIG: Record<string, NextFetchRequestConfig> = {
    currentSeason: {
      revalidate: 3600, // 1 hour
      tags: ['current-standings'],
    },
    historicalSeason: {
      revalidate: false, // never
      tags: [],
    },
    default: {
      revalidate: 86400, // 1 day fallback
      tags: ['standings'],
    },
  };

export async function getDriverStandings(
    year: string,
    options?: {
        mockData?: RawDriverStandings
    }
): Promise<RawDriverStandings> {
    // Return mock data if provided (for testing)
    if (options?.mockData) {
        return options.mockData;
    }

    const currentYear = new Date().getFullYear().toString();
    const isCurrentSeason = year === currentYear;

    const cacheConfig = isCurrentSeason
        ? CACHE_CONFIG.currentSeason
        : CACHE_CONFIG.historicalSeason;

    try {
        const fetchOptions: ExtendedRequestInit = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            next: cacheConfig,
          };

        const response = await fetch(`${F1_API_BASE_URL}/${year}/driverstandings/`, fetchOptions);

        if(!response.ok) {
            throw new Error(`Failed to fetch DriverStandings (${response.status}): ${response.statusText}`);
        }
        
        const data: RawDriverStandings = await response.json()

        if (!data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings) {
            throw new Error('Invalid API response structure');
        }

        return data;
        
    } catch (error) {
        console.error('Error fetching driver standings: ', error);
        throw new Error(`Failed to load ${year} standings. ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
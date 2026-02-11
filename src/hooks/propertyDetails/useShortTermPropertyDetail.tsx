import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShortTermProperty } from '@/API';

const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || 'https://d2bstvyam1bm1f.cloudfront.net';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_KEY_PREFIX = 'short-term-property-';

interface CachedProperty {
  data: ShortTermProperty;
  timestamp: number;
}

// Get cached property from localStorage
function getCachedProperty(propertyId: string): ShortTermProperty | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${propertyId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const { data, timestamp }: CachedProperty = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid (within 5 minutes)
    if (now - timestamp < CACHE_DURATION) {
      console.log('[useShortTermPropertyDetail] 📦 Using cached property', {
        propertyId,
        age: `${Math.round((now - timestamp) / 1000)}s`,
        expiresIn: `${Math.round((CACHE_DURATION - (now - timestamp)) / 1000)}s`,
      });
      return data;
    }
    
    // Cache expired, remove it
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error('[useShortTermPropertyDetail] Failed to read cache', error);
    return null;
  }
}

// Save property to localStorage cache
function setCachedProperty(propertyId: string, property: ShortTermProperty): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${propertyId}`;
    const cached: CachedProperty = {
      data: property,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cached));
    console.log('[useShortTermPropertyDetail] 💾 Property cached', { propertyId });
  } catch (error) {
    console.error('[useShortTermPropertyDetail] Failed to cache property', error);
  }
}

// Clear cached property
function clearCachedProperty(propertyId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${propertyId}`;
    localStorage.removeItem(cacheKey);
    console.log('[useShortTermPropertyDetail] 🗑️ Cache cleared', { propertyId });
  } catch (error) {
    console.error('[useShortTermPropertyDetail] Failed to clear cache', error);
  }
}

export function useShortTermPropertyDetail(propertyId?: string) {
  const [property, setProperty] = useState<ShortTermProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  const fetchProperty = async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);

      if (!propertyId) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      // Check cache first
      const cachedProperty = getCachedProperty(propertyId);
      if (cachedProperty) {
        setProperty(cachedProperty);
        setLoading(false);
        
        // Fetch in background to update cache if needed
        fetchFromCloudFront(propertyId, true);
        return;
      }

      // Fetch from CloudFront
      await fetchFromCloudFront(propertyId, false);

    } catch (err) {
      const currentRetryCount = isRetry ? retryCount + 1 : retryCount;
      setRetryCount(currentRetryCount);
      
      console.error('[useShortTermPropertyDetail] ❌ Error:', err);
      
      if (currentRetryCount >= 5) {
        // After 5 failed attempts, navigate to home
        setError('Unable to load property after multiple attempts. Redirecting to home...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load property');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFromCloudFront = async (propertyId: string, isBackground: boolean) => {
    const url = `${CLOUDFRONT_DOMAIN}/short-term-properties/${propertyId}.json`;
    
    if (!isBackground) {
      console.log('[useShortTermPropertyDetail] 🌐 Full CloudFront URL:', url);
      console.log('[useShortTermPropertyDetail] 📍 CLOUDFRONT_DOMAIN:', CLOUDFRONT_DOMAIN);
      console.log('[useShortTermPropertyDetail] 🆔 Property ID:', propertyId);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!isBackground) {
      console.log('[useShortTermPropertyDetail] 📡 Response status:', response.status);
      console.log('[useShortTermPropertyDetail] 📡 Response ok:', response.ok);
    }

    if (!response.ok) {
      if (response.status === 404) {
        setError('Property not found');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return;
    }

    const data = await response.json();

    // Check if property was deleted
    if (data.deleted) {
      setError('This property is no longer available');
      return;
    }

    const propertyData = data as ShortTermProperty;
    
    // Update state and cache
    setProperty(propertyData);
    setCachedProperty(propertyId, propertyData);
    setRetryCount(0);

    if (!isBackground) {
      console.log('[useShortTermPropertyDetail] ✅ Property loaded:', {
        propertyId: propertyData.propertyId,
        title: propertyData.title,
        status: propertyData.status,
      });
    }
  };

  const retry = () => {
    fetchProperty(true);
  };

  // Custom setProperty that also updates cache
  const setPropertyWithCache = (newProperty: ShortTermProperty) => {
    setProperty(newProperty);
    setCachedProperty(newProperty.propertyId, newProperty);
  };

  useEffect(() => {
    if (propertyId) {
      setRetryCount(0);
      fetchProperty();
    }
  }, [propertyId]);

  return { 
    property, 
    setProperty: setPropertyWithCache,
    loading, 
    error, 
    retry, 
    retryCount,
    maxRetries: 5,
    clearCache: () => propertyId && clearCachedProperty(propertyId),
  };
}

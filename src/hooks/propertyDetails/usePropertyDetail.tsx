import { getProperty } from '@/graphql/queries';
import { cachedGraphQL } from '@/lib/cache';
import { getPropertyFromCache } from '@/lib/property-cache';
import { featureFlags } from '@/lib/feature-flags';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/API';

export function usePropertyDetail(propertyId?: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  const fetchProperty = async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);

      // 🚀 Always try CloudFront first (instant load)
      if (!isRetry) {
        console.log('[usePropertyDetail] Trying CloudFront first...');
        const cachedProperty = await getPropertyFromCache(propertyId!);
        
        if (cachedProperty) {
          console.log('[usePropertyDetail] ✅ Property loaded from CloudFront');
          setProperty(cachedProperty as any);
          setLoading(false);
          setRetryCount(0);
          return;
        }
        
        // Check if GraphQL fallback is enabled
        if (!featureFlags.enableGraphQLFallback) {
          console.log('[usePropertyDetail] CloudFront miss and GraphQL fallback disabled');
          setError('Property not available in cache');
          setLoading(false);
          return;
        }
        
        console.log('[usePropertyDetail] CloudFront miss, falling back to GraphQL...');
      }

      // Fallback to GraphQL (only if enabled or retry)
      const response = await cachedGraphQL.query({
        query: getProperty,
        variables: { 
          propertyId
        }
      });

      if (response.data.getProperty) {
        setProperty(response.data.getProperty);
        // Reset retry count on successful fetch
        setRetryCount(0);
      } else {
        setError('Property not found');
      }

    } catch (err) {
      const currentRetryCount = isRetry ? retryCount + 1 : retryCount;
      setRetryCount(currentRetryCount);
      
      if (currentRetryCount >= 5) {
        // After 5 failed attempts, navigate to home
        setError('Unable to load property after multiple attempts. Redirecting to home...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError('Failed to load property');
      }
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    fetchProperty(true);
  };

  useEffect(() => {
    console.log("Fetching property details for ID:", propertyId);
    if (propertyId) {
      setRetryCount(0); // Reset retry count when propertyId changes
      fetchProperty();
    }
  }, [propertyId]);

  return { 
    property, 
    setProperty, // Expose setProperty for direct updates (e.g., from subscriptions)
    loading, 
    error, 
    retry, 
    retryCount,
    maxRetries: 5 
  };
}

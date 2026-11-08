import { getProperty } from '@/graphql/queries';
import { cachedGraphQL } from '@/lib/cache';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/API';

export function usePropertyDetail(propertyId?: string, initialProperty?: Property) {
  const [property, setProperty] = useState<Property | null>(initialProperty || null);
  const [loading, setLoading] = useState(!initialProperty);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  const fetchProperty = async (isRetry = false, background = false) => {
    try {
      if (!background) setLoading(true);
      setError(null);

      // Query directly from backend GraphQL API
      const response = await cachedGraphQL.query({
        query: getProperty,
        variables: { 
          propertyId
        }
      });

      if (response.data.getProperty) {
        setProperty(response.data.getProperty);
        setRetryCount(0);
      } else {
        if (!background) setError('Property not found');
      }

    } catch (err) {
      if (background) return;
      const currentRetryCount = isRetry ? retryCount + 1 : retryCount;
      setRetryCount(currentRetryCount);
      
      if (currentRetryCount >= 5) {
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
    if (propertyId) {
      setRetryCount(0);
      // Refresh contact fields using the existing browser flow without hiding the server-rendered listing.
      fetchProperty(false, initialProperty?.propertyId === propertyId);
    }
  }, [propertyId]);

  return { 
    property, 
    setProperty,
    loading, 
    error, 
    retry, 
    retryCount,
    maxRetries: 5 
  };
}

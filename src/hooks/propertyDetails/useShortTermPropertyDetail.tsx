import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShortTermProperty } from '@/API';

const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || 'https://d2bstvyam1bm1f.cloudfront.net';

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

      // Fetch from CloudFront cache
      const url = `${CLOUDFRONT_DOMAIN}/short-term-properties/${propertyId}.json`;
      
      console.log('[useShortTermPropertyDetail] 🌐 Full CloudFront URL:', url);
      console.log('[useShortTermPropertyDetail] 📍 CLOUDFRONT_DOMAIN:', CLOUDFRONT_DOMAIN);
      console.log('[useShortTermPropertyDetail] 🆔 Property ID:', propertyId);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store', // Always fetch fresh data
      });

      console.log('[useShortTermPropertyDetail] 📡 Response status:', response.status);
      console.log('[useShortTermPropertyDetail] 📡 Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Property not found');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Check if property was deleted
      if (data.deleted) {
        setError('This property is no longer available');
        setLoading(false);
        return;
      }

      setProperty(data as ShortTermProperty);
      setRetryCount(0);

      console.log('[useShortTermPropertyDetail] ✅ Property loaded:', {
        propertyId: data.propertyId,
        title: data.title,
        status: data.status,
      });

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

  const retry = () => {
    fetchProperty(true);
  };

  useEffect(() => {
    if (propertyId) {
      setRetryCount(0);
      fetchProperty();
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

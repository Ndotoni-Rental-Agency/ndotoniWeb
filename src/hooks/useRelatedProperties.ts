import { useState, useEffect, useRef, useCallback } from 'react';
import { cachedGraphQL } from '@/lib/cache';
import { getRelatedProperties } from '@/graphql/queries';
import { PropertyCard } from '@/API';

interface RelatedPropertiesData {
  landlordProperties: PropertyCard[];
  similarLocationProperties: PropertyCard[];
  similarPriceProperties: PropertyCard[];
}

interface GetRelatedPropertiesResponse {
  getRelatedProperties: {
    landlordProperties: PropertyCard[];
    similarLocationProperties: PropertyCard[];
    similarPriceProperties: PropertyCard[];
  };
}

interface UseRelatedPropertiesOptions {
  /**
   * Enable lazy loading - only fetch when element is visible
   * Default: false (fetch immediately)
   */
  lazy?: boolean;
  /**
   * Root margin for Intersection Observer (e.g., '200px' to load 200px before visible)
   * Default: '0px'
   */
  rootMargin?: string;
}

export function useRelatedProperties(
  propertyId: string | null,
  options: UseRelatedPropertiesOptions = {}
) {
  const { lazy = false, rootMargin = '0px' } = options;
  
  const [data, setData] = useState<RelatedPropertiesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(!lazy); // Fetch immediately if not lazy
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasFetchedRef = useRef(false);

  // Callback ref for the element to observe
  const elementRef = useCallback((node: HTMLElement | null) => {
    if (!lazy) return; // Skip observer if not lazy loading
    
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!node) return;

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasFetchedRef.current) {
          console.log('🔍 Related properties section visible - triggering fetch');
          setShouldFetch(true);
          hasFetchedRef.current = true;
          // Disconnect after first trigger
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.1, // Trigger when 10% visible
      }
    );

    observerRef.current.observe(node);
  }, [lazy, rootMargin]);

  useEffect(() => {
    if (!propertyId || !shouldFetch) {
      setData(null);
      return;
    }

    let isMounted = true;

    const fetchRelatedProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('📡 Fetching related properties for:', propertyId);
        const startTime = Date.now();

        const response = await cachedGraphQL.query<GetRelatedPropertiesResponse>({
          query: getRelatedProperties,
          variables: {
            propertyId,
            landlordLimit: 6,
            locationLimit: 10,
            priceLimit: 10,
          },
        });

        const duration = Date.now() - startTime;
        console.log(`✅ Related properties fetched in ${duration}ms`);

        if (isMounted && response.data.getRelatedProperties) {
          setData({
            landlordProperties: response.data.getRelatedProperties.landlordProperties || [],
            similarLocationProperties: response.data.getRelatedProperties.similarLocationProperties || [],
            similarPriceProperties: response.data.getRelatedProperties.similarPriceProperties || [],
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error('❌ Error fetching related properties:', err);
          setError('Failed to load related properties');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRelatedProperties();

    return () => {
      isMounted = false;
    };
  }, [propertyId, shouldFetch]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { data, loading, error, ref: elementRef };
}

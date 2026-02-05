import { useState, useEffect } from 'react';
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

export function useRelatedProperties(propertyId: string | null) {
  const [data, setData] = useState<RelatedPropertiesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setData(null);
      return;
    }

    let isMounted = true;

    const fetchRelatedProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await cachedGraphQL.query<GetRelatedPropertiesResponse>({
          query: getRelatedProperties,
          variables: {
            propertyId,
            landlordLimit: 6,
            locationLimit: 10,
            priceLimit: 10,
          },
        });

        if (isMounted && response.data.getRelatedProperties) {
          setData({
            landlordProperties: response.data.getRelatedProperties.landlordProperties || [],
            similarLocationProperties: response.data.getRelatedProperties.similarLocationProperties || [],
            similarPriceProperties: response.data.getRelatedProperties.similarPriceProperties || [],
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching related properties:', err);
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
  }, [propertyId]);

  return { data, loading, error };
}

import { getProperty } from '@/graphql/queries';
import { cachedGraphQL } from '@/lib/cache';
import { useEffect, useState } from 'react';
import { Property } from '@/API';

export function usePropertyDetail(propertyId?: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await cachedGraphQL.query({
        query: getProperty,
        variables: { 
          propertyId
        }
      });

      if (response.data.getProperty) {
        setProperty(response.data.getProperty);
      } else {
        setError('Property not found');
      }

    } catch {
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching property details for ID:", propertyId);
    if (propertyId) fetchProperty();
  }, [propertyId]);

  return { property, loading, error, retry: fetchProperty };
}

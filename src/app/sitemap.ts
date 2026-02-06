import { MetadataRoute } from 'next'
import { Property } from '@/API'
import { getPropertiesByLocation } from '@/graphql/queries'

// Server-side GraphQL client for sitemap generation
async function executeGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 
    'https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com/graphql'
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || 
    'da2-4kqoqw7d2jbndbilqiqpkypsve'
  
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  
  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }
  
  const { data, errors } = await response.json()
  
  if (errors) {
    console.error('GraphQL errors:', errors)
    throw new Error('GraphQL query failed')
  }
  
  return data
}

// Fetch properties from all major regions
async function fetchAllProperties(): Promise<Property[]> {
  try {
    // Major regions in Tanzania
    const regions = [
      'Dar es Salaam',
      'Arusha',
      'Mwanza',
      'Dodoma',
      'Mbeya',
      'Morogoro',
      'Tanga',
      'Zanzibar',
      'Kilimanjaro',
      'Moshi',
    ]
    
    const allProperties: Property[] = []
    
    // Fetch properties from each region
    for (const region of regions) {
      try {
        const data = await executeGraphQL(
          getPropertiesByLocation,
          {
            region,
            limit: 100,
          }
        )
        
        if (data?.getPropertiesByLocation?.properties) {
          allProperties.push(...data.getPropertiesByLocation.properties)
        }
      } catch (error) {
        console.error(`Error fetching properties for ${region}:`, error)
        // Continue with other regions
      }
    }
    
    // Remove duplicates by propertyId
    const uniqueProperties = Array.from(
      new Map(allProperties.map(p => [p.propertyId, p])).values()
    )
    
    console.log(`Fetched ${uniqueProperties.length} unique properties from ${regions.length} regions`)
    
    return uniqueProperties
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.ndotoni.com'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/landlord`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  try {
    const properties = await fetchAllProperties()

    // Generate property pages
    const propertyPages: MetadataRoute.Sitemap = properties.map((property: Property) => ({
      url: `${baseUrl}/property/${property.propertyId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    console.log(`Generated sitemap with ${staticPages.length} static pages and ${propertyPages.length} property pages`)

    return [...staticPages, ...propertyPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}

// Revalidate the sitemap every 24 hours
export const revalidate = 86400

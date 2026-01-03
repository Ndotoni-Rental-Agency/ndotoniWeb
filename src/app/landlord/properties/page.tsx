'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import PropertyStatusBadge from '@/components/property/PropertyStatusBadge';

interface LandlordProperty {
  propertyId: string;
  title: string;
  description: string;
  pricing: {
    monthlyRent: number;
    deposit: number;
    currency: string;
    serviceCharge?: number;
    utilitiesIncluded: boolean;
  };
  specifications: {
    bedrooms: number;
    bathrooms: number;
    squareMeters?: number;
    furnished: boolean;
    parkingSpaces: number;
    floors: number;
  };
  address: {
    region: string;
    district: string;
    ward: string;
    street: string;
    coordinates: { latitude: number; longitude: number };
  };
  propertyType: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'ARCHIVED';
  verificationStatus?: 'VERIFIED' | 'UNVERIFIED' | 'PENDING';
  availability: {
    available: boolean;
    availableFrom: string;
    minimumLeaseTerm: number;
    maximumLeaseTerm: number;
  };
  amenities: string[];
  media: {
    images: string[];
    videos: string[];
    floorPlan: string;
    virtualTour: string;
  };
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  applications?: number;
  lastUpdated?: string;
}

export default function PropertiesManagement() {
  const [properties, setProperties] = useState<LandlordProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // Mock data for now - replace with actual GraphQL query for landlord properties
      const mockProperties: LandlordProperty[] = [
        {
          propertyId: '65dbe34f-c0ac-4778-98fe-0e3d6246f9df',
          title: 'Modern Apartment in Masaki',
          description: 'Beautiful 2-bedroom apartment with ocean view',
          pricing: {
            monthlyRent: 1200000,
            deposit: 2400000,
            currency: 'TZS',
            serviceCharge: 100000,
            utilitiesIncluded: false
          },
          specifications: {
            bedrooms: 2,
            bathrooms: 2,
            squareMeters: 85,
            furnished: true,
            parkingSpaces: 1,
            floors: 1
          },
          address: {
            region: 'Dar es Salaam',
            district: 'Kinondoni',
            ward: 'Masaki',
            street: 'Haile Selassie Road',
            coordinates: { latitude: -6.7924, longitude: 39.2083 }
          },
          propertyType: 'APARTMENT',
          status: 'LIVE' as 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'ARCHIVED',
          verificationStatus: 'VERIFIED' as 'VERIFIED' | 'UNVERIFIED' | 'PENDING',
          availability: {
            available: true,
            availableFrom: '2024-01-01',
            minimumLeaseTerm: 12,
            maximumLeaseTerm: 24
          },
          amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking'],
          media: {
            images: ['/api/placeholder/400/300'],
            videos: [],
            floorPlan: '',
            virtualTour: ''
          },
          landlordId: 'landlord-1',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
          applications: 3,
          lastUpdated: '2024-01-15'
        },
        {
          propertyId: 'f0b7e63c-d4a1-4e09-aa83-60924dc5fd06',
          title: 'Family House in Mikocheni',
          description: 'Spacious 4-bedroom house perfect for families',
          pricing: {
            monthlyRent: 2500000,
            deposit: 5000000,
            currency: 'TZS',
            serviceCharge: 200000,
            utilitiesIncluded: false
          },
          specifications: {
            bedrooms: 4,
            bathrooms: 3,
            squareMeters: 200,
            furnished: false,
            parkingSpaces: 2,
            floors: 2
          },
          address: {
            region: 'Dar es Salaam',
            district: 'Kinondoni',
            ward: 'Mikocheni',
            street: 'Mikocheni B',
            coordinates: { latitude: -6.7731, longitude: 39.2294 }
          },
          propertyType: 'HOUSE',
          status: 'LIVE' as 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'ARCHIVED',
          verificationStatus: 'VERIFIED' as 'VERIFIED' | 'UNVERIFIED' | 'PENDING',
          availability: {
            available: false,
            availableFrom: '2024-06-01',
            minimumLeaseTerm: 12,
            maximumLeaseTerm: 36
          },
          amenities: ['Garden', 'Security', 'Parking', 'Generator'],
          media: {
            images: ['/api/placeholder/400/300'],
            videos: [],
            floorPlan: '',
            virtualTour: ''
          },
          landlordId: 'landlord-1',
          createdAt: '2023-12-01T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z',
          applications: 0,
          lastUpdated: '2024-01-10'
        },
        {
          propertyId: '34945621-80e0-432f-bd88-66057f840bdd',
          title: 'Studio in Upanga',
          description: 'Cozy studio apartment for young professionals',
          pricing: {
            monthlyRent: 600000,
            deposit: 1200000,
            currency: 'TZS',
            serviceCharge: 50000,
            utilitiesIncluded: true
          },
          specifications: {
            bedrooms: 1,
            bathrooms: 1,
            squareMeters: 35,
            furnished: true,
            parkingSpaces: 0,
            floors: 1
          },
          address: {
            region: 'Dar es Salaam',
            district: 'Ilala',
            ward: 'Upanga West',
            street: 'Upanga Road',
            coordinates: { latitude: -6.8103, longitude: 39.2891 }
          },
          propertyType: 'STUDIO',
          status: 'PENDING_REVIEW' as 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'ARCHIVED',
          verificationStatus: 'UNVERIFIED' as 'VERIFIED' | 'UNVERIFIED' | 'PENDING',
          availability: {
            available: false,
            availableFrom: '2024-02-01',
            minimumLeaseTerm: 6,
            maximumLeaseTerm: 12
          },
          amenities: ['WiFi', 'Security', 'Utilities Included'],
          media: {
            images: ['/api/placeholder/400/300'],
            videos: [],
            floorPlan: '',
            virtualTour: ''
          },
          landlordId: 'landlord-1',
          createdAt: '2023-11-15T00:00:00Z',
          updatedAt: '2024-01-12T00:00:00Z',
          applications: 1,
          lastUpdated: '2024-01-12'
        }
      ];
      
      setProperties(mockProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.ward?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.district.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });



  const formatCurrency = (amount: number, currency: string = 'TZS') => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white transition-colors">Your listings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">{filteredProperties.length} listing{filteredProperties.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
          >
            <option value="all">All listings</option>
            <option value="LIVE">Live</option>
            <option value="PENDING_REVIEW">Under Review</option>
            <option value="DRAFT">Draft</option>
            <option value="REJECTED">Rejected</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          />
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-6">
        {filteredProperties.map((property) => (
          <div key={property.propertyId} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors">{property.title}</h3>
                <PropertyStatusBadge 
                  status={property.status} 
                  verificationStatus={property.verificationStatus}
                  size="sm"
                />
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 transition-colors">{property.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                    {property.address.ward}, {property.address.district}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                    {property.specifications.bedrooms} bed • {property.specifications.bathrooms} bath
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
                    {formatCurrency(property.pricing.monthlyRent, property.pricing.currency)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">/month</span>
                </div>
              </div>
              
              {(property.applications ?? 0) > 0 && (
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full transition-colors mb-6">
                  <svg className="w-4 h-4 text-blue-500 dark:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors">
                    {property.applications} pending request{property.applications !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            
            {/* Action Buttons at Bottom Center */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl transition-colors">
              <div className="flex flex-wrap justify-center gap-3">
                {/* Edit Button */}
                <Link
                  href={`/landlord/properties/${property.propertyId}/edit`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                
                {/* View Button */}
                <Link
                  href={`/property/${property.propertyId}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </Link>
                
                {/* Duplicate Button */}
                <Link
                  href={`/landlord/properties/create?duplicate=${property.propertyId}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Duplicate
                </Link>
                
                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
                      // Handle delete logic here
                      console.log('Delete property:', property.propertyId);
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4 transition-colors">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">No properties found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first property'
            }
          </p>
        </div>
      )}
    </div>
  );
}
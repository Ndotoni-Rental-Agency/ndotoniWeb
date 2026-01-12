'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generateClient } from 'aws-amplify/api';
import { listProperties, getProperty } from '@/graphql/queries';
import { updatePropertyStatus } from '@/graphql/mutations';
import PropertyStatusBadge from '@/components/property/PropertyStatusBadge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button, Input } from '@/components/ui';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Property, PropertyStatus } from '@/API';
import Link from 'next/link';

// Force dynamic rendering for pages using AuthGuard (which uses useSearchParams)
export const dynamic = 'force-dynamic';

const client = generateClient();

export default function AdminPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.address.region.toLowerCase().includes(query) ||
          p.address.district.toLowerCase().includes(query) ||
          p.address.ward.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(filtered);
  }, [searchQuery, statusFilter, properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await client.graphql({
        query: listProperties,
        variables: { limit: 1000 },
      });

      const propertiesData = (response as any).data?.listProperties?.properties || [];
      setProperties(propertiesData);
      setFilteredProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyStatusChange = async (propertyId: string, newStatus: PropertyStatus) => {
    try {
      const property = properties.find((p) => p.propertyId === propertyId);
      if (!property) return;

      const response = await client.graphql({
        query: updatePropertyStatus,
        variables: {
          landlordId: property.landlordId,
          propertyId,
          status: newStatus,
        },
      });

      const updatedProperty = (response as any).data?.updatePropertyStatus;
      if (updatedProperty) {
        setProperties((prev) =>
          prev.map((p) => (p.propertyId === propertyId ? updatedProperty : p))
        );
      }
    } catch (error) {
      console.error('Error updating property status:', error);
      alert('Failed to update property status. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'TZS') => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Property Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review and manage property listings
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | 'all')}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value={PropertyStatus.DRAFT}>Draft</option>
          <option value={PropertyStatus.AVAILABLE}>Available</option>
          <option value={PropertyStatus.RENTED}>Rented</option>
          <option value={PropertyStatus.MAINTENANCE}>Maintenance</option>
        </select>
      </div>

      {/* Properties List */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredProperties.map((property) => (
            <Card key={property.propertyId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {property.title}
                      </h3>
                      <PropertyStatusBadge 
                        status={property.status} 
                        size="sm"
                      />
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {property.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</span>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {property.address.ward}, {property.address.district}, {property.address.region}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</span>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatCurrency(property.pricing.monthlyRent, property.pricing.currency)}/month
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</span>
                        <p className="text-sm text-gray-900 dark:text-white">{property.propertyType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-500">
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(property.createdAt)}
                      </div>
                      {property.specifications.bedrooms && (
                        <div>
                          <span className="font-medium">Bedrooms:</span> {property.specifications.bedrooms}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link href={`/property/${property.propertyId}`}>
                    <Button variant="outline" size="sm">
                      View Property
                    </Button>
                  </Link>
                  {property.status === PropertyStatus.DRAFT && (
                    <>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handlePropertyStatusChange(property.propertyId, PropertyStatus.MAINTENANCE)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePropertyStatusChange(property.propertyId, PropertyStatus.AVAILABLE)}
                      >
                        Approve & Publish
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'No properties found matching your filters.'
                : 'No properties found. Properties will appear here once they are created.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
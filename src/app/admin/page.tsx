'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PropertyStatusBadge from '@/components/property/PropertyStatusBadge';

// Force dynamic rendering for pages using AuthGuard (which uses useSearchParams)
export const dynamic = 'force-dynamic';

interface AdminProperty {
  propertyId: string;
  title: string;
  description: string;
  pricing: {
    monthlyRent: number;
    currency: string;
  };
  address: {
    region: string;
    district: string;
    ward: string;
    street: string;
  };
  propertyType: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'ARCHIVED';
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'PENDING';
  createdBy: string;
  createdAt: string;
  submittedBy: {
    firstName: string;
    lastName: string;
    email: string;
    userType: 'TENANT' | 'LANDLORD';
  };
}

export default function AdminPropertiesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | string>('PENDING_REVIEW');

  useEffect(() => {
    // Check if user is admin
    // if (!isAuthenticated) {
    //   router.push('/');
    //   return;
    // }
    
    fetchPendingProperties();
  }, [isAuthenticated, user, router]);

  const fetchPendingProperties = async () => {
    try {
      // Mock data for now - replace with actual GraphQL query
      const mockProperties: AdminProperty[] = [
        {
          propertyId: 'pending-1',
          title: 'Cozy Studio in Kinondoni',
          description: 'A beautiful studio apartment perfect for young professionals.',
          pricing: {
            monthlyRent: 450000,
            currency: 'TZS'
          },
          address: {
            region: 'Dar es Salaam',
            district: 'Kinondoni',
            ward: 'Sinza',
            street: 'Sinza Road'
          },
          propertyType: 'STUDIO',
          status: 'PENDING_REVIEW',
          verificationStatus: 'UNVERIFIED',
          createdBy: 'tenant-123',
          createdAt: '2024-01-16T10:30:00Z',
          submittedBy: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            userType: 'TENANT'
          }
        },
        {
          propertyId: 'pending-2',
          title: 'Family House in Temeke',
          description: 'Spacious 3-bedroom house with garden, perfect for families.',
          pricing: {
            monthlyRent: 1200000,
            currency: 'TZS'
          },
          address: {
            region: 'Dar es Salaam',
            district: 'Temeke',
            ward: 'Kigamboni',
            street: 'Kigamboni Road'
          },
          propertyType: 'HOUSE',
          status: 'PENDING_REVIEW',
          verificationStatus: 'UNVERIFIED',
          createdBy: 'tenant-456',
          createdAt: '2024-01-15T14:20:00Z',
          submittedBy: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            userType: 'TENANT'
          }
        }
      ];
      
      setProperties(mockProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyAction = async (propertyId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      // TODO: Implement GraphQL mutation for property approval/rejection
      console.log(`${action} property ${propertyId}`, reason ? `Reason: ${reason}` : '');
      
      // Update local state
      setProperties(prev => prev.map(property => {
        if (property.propertyId === propertyId) {
          return {
            ...property,
            status: action === 'approve' ? 'LIVE' : 'REJECTED',
            verificationStatus: action === 'approve' ? 'VERIFIED' : 'UNVERIFIED'
          };
        }
        return property;
      }));
      
      // Show success message
      alert(`Property ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing property:`, error);
      alert(`Failed to ${action} property. Please try again.`);
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.status === filter;
  });

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
              <p className="text-gray-600 mt-1">Review and manage property submissions</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="all">All Properties</option>
                <option value="LIVE">Live</option>
                <option value="REJECTED">Rejected</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {filteredProperties.map((property) => (
            <div key={property.propertyId} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                      <PropertyStatusBadge 
                        status={property.status} 
                        verificationStatus={property.verificationStatus}
                        size="sm"
                      />
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{property.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Location</span>
                        <p className="text-sm text-gray-900">
                          {property.address.ward}, {property.address.district}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Price</span>
                        <p className="text-sm text-gray-900">
                          {formatCurrency(property.pricing.monthlyRent, property.pricing.currency)}/month
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Type</span>
                        <p className="text-sm text-gray-900">{property.propertyType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Submitted by:</span> {property.submittedBy.firstName} {property.submittedBy.lastName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {property.submittedBy.email}
                      </div>
                      <div>
                        <span className="font-medium">User Type:</span> {property.submittedBy.userType}
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span> {formatDate(property.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {property.status === 'PENDING_REVIEW' && (
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        const reason = prompt('Reason for rejection (optional):');
                        handlePropertyAction(property.propertyId, 'reject', reason || undefined);
                      }}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handlePropertyAction(property.propertyId, 'approve')}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve & Publish
                    </button>
                  </div>
                )}
                
                {property.status === 'LIVE' && (
                  <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                    <span className="text-sm text-green-600 font-medium">✓ Property is live and visible to users</span>
                  </div>
                )}
                
                {property.status === 'REJECTED' && (
                  <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                    <span className="text-sm text-red-600 font-medium">✗ Property was rejected</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500">
              {filter === 'PENDING_REVIEW' 
                ? 'No properties are currently pending review'
                : 'No properties match the selected filter'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
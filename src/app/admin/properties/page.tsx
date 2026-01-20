'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import PropertyStatusBadge from '@/components/property/PropertyStatusBadge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button, Input, Modal } from '@/components/ui';
import { MagnifyingGlassIcon, TrashIcon, PencilIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Property, PropertyStatus } from '@/API';
import Link from 'next/link';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';

// Force dynamic rendering for pages using AuthGuard (which uses useSearchParams)
export const dynamic = 'force-dynamic';

export default function AdminPropertiesPage() {
  const { user } = useAuth();
  const { listProperties, approveProperty, rejectProperty, deleteProperty, isLoading } = useAdmin();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [propertyToApprove, setPropertyToApprove] = useState<Property | null>(null);
  const [propertyToReject, setPropertyToReject] = useState<Property | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  
  const { notification, showSuccess, showError, closeNotification } = useNotification();

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
          p.address.district.toLowerCase().includes(query) 
      );
    }

    setFilteredProperties(filtered);
  }, [searchQuery, statusFilter, properties]);

  const fetchProperties = async () => {
    try {
      const response = await listProperties(undefined, 1000);
      setProperties(response.properties);
      setFilteredProperties(response.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      showError('Error', 'Failed to load properties. Please try again.');
      setProperties([]);
      setFilteredProperties([]);
    }
  };

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    try {
      const result = await deleteProperty(propertyToDelete.propertyId);
      
      if (result.success) {
        setProperties(prev => prev.filter(p => p.propertyId !== propertyToDelete.propertyId));
        setFilteredProperties(prev => prev.filter(p => p.propertyId !== propertyToDelete.propertyId));
        showSuccess('Success', result.message);
        setPropertyToDelete(null);
      }
    } catch (error) {
      showError('Error', error instanceof Error ? error.message : 'Failed to delete property');
    }
  };

  const handleApproveClick = (property: Property) => {
    setPropertyToApprove(property);
  };

  const handleApproveConfirm = async () => {
    if (!propertyToApprove) return;

    try {
      const result = await approveProperty(propertyToApprove.propertyId);
      
      if (result.success) {
        // Update local state
        setProperties(prev => 
          prev.map(p => p.propertyId === propertyToApprove.propertyId 
            ? { ...p, status: PropertyStatus.AVAILABLE }
            : p
          )
        );
        showSuccess('Success', result.message);
        setPropertyToApprove(null);
      }
    } catch (error) {
      showError('Error', error instanceof Error ? error.message : 'Failed to approve property');
    }
  };

  const handleRejectClick = (property: Property) => {
    setPropertyToReject(property);
    setRejectReason('');
  };

  const handleRejectConfirm = async () => {
    if (!propertyToReject || !rejectReason.trim()) {
      showError('Error', 'Please provide a reason for rejection');
      return;
    }

    try {
      const result = await rejectProperty(propertyToReject.propertyId, rejectReason);
      
      if (result.success) {
        // Update local state
        setProperties(prev => 
          prev.map(p => p.propertyId === propertyToReject.propertyId 
            ? { ...p, status: PropertyStatus.DELETED }
            : p
          )
        );
        showSuccess('Success', result.message);
        setPropertyToReject(null);
        setRejectReason('');
      }
    } catch (error) {
      showError('Error', error instanceof Error ? error.message : 'Failed to reject property');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | 'all')}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Approval Actions for DRAFT properties */}
                  {property.status === PropertyStatus.DRAFT && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveClick(property)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectClick(property)}
                      >
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-auto">
                    <Link href={`/property/${property.propertyId}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/properties/${property.propertyId}/edit`}>
                      <Button variant="outline" size="sm">
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(property)}
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
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

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!propertyToDelete}
        onClose={() => setPropertyToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Property"
        message="Are you sure you want to delete this property?"
        itemName={propertyToDelete?.title}
        isLoading={isLoading}
      />

      {/* Approve Confirmation Modal */}
      {propertyToApprove && (
        <Modal
          isOpen={!!propertyToApprove}
          onClose={() => setPropertyToApprove(null)}
          title="Approve Property"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to approve{' '}
              <span className="font-semibold">{propertyToApprove.title}</span>?
              This will make it available for rent.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setPropertyToApprove(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleApproveConfirm}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Confirmation Modal */}
      {propertyToReject && (
        <Modal
          isOpen={!!propertyToReject}
          onClose={() => {
            setPropertyToReject(null);
            setRejectReason('');
          }}
          title="Reject Property"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Are you sure you want to reject{' '}
              <span className="font-semibold">{propertyToReject.title}</span>?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for rejection *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setPropertyToReject(null);
                  setRejectReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim()}
              >
                Reject
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}
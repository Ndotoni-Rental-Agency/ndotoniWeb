'use client';

import { useState, useEffect } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
// TODO: will import listLandlordApplications from '@/graphql/queries' once backend is implemented
// import { listLandlordApplications } from '@/graphql/queries';
import { Card, CardContent } from '@/components/ui/Card';
import { Button, Input } from '@/components/ui';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAdminLandlordApplications } from '@/hooks/useAdminLandlordApplications';
import { LandlordApplicationModal } from '@/components/admin/LandlordApplicationModal';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface LandlordApplication {
  applicationId: string;
  userId: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  rejectionReason?: string;
}

export default function AdminLandlordApplicationsPage() {
  const [applications, setApplications] = useState<LandlordApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LandlordApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'all'>('all');
  const [selectedApplication, setSelectedApplication] = useState<LandlordApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { listApplications, approveApplication, rejectApplication, isLoading, isProcessing } = useAdminLandlordApplications();
  const { notification, showSuccess, showError, closeNotification } = useNotification();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.firstName.toLowerCase().includes(query) ||
          app.lastName.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query) ||
          app.applicationId.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(filtered);
  }, [searchQuery, statusFilter, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const apps = await listApplications();
      setApplications(apps);
      setFilteredApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showError('Error', 'Failed to load landlord applications. Please try again.');
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application: LandlordApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleApprove = async (applicationId: string) => {
    const result = await approveApplication(applicationId);
    
    if (result.success) {
      setApplications(prev => 
        prev.map(app => app.applicationId === applicationId 
          ? { ...app, status: 'APPROVED' as const }
          : app
        )
      );
      setFilteredApplications(prev => 
        prev.map(app => app.applicationId === applicationId 
          ? { ...app, status: 'APPROVED' as const }
          : app
        )
      );
      showSuccess('Success', result.message);
      setIsModalOpen(false);
      setSelectedApplication(null);
    } else {
      showError('Error', result.message);
    }
  };

  const handleReject = async (applicationId: string, reason?: string) => {
    const result = await rejectApplication(applicationId, reason);
    
    if (result.success) {
      setApplications(prev => 
        prev.map(app => app.applicationId === applicationId 
          ? { ...app, status: 'REJECTED' as const, rejectionReason: reason }
          : app
        )
      );
      setFilteredApplications(prev => 
        prev.map(app => app.applicationId === applicationId 
          ? { ...app, status: 'REJECTED' as const, rejectionReason: reason }
          : app
        )
      );
      showSuccess('Success', result.message);
      setIsModalOpen(false);
      setSelectedApplication(null);
    } else {
      showError('Error', result.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
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
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'PENDING' | 'APPROVED' | 'REJECTED' | 'all')}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((application) => (
            <Card key={application.applicationId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {application.firstName} {application.lastName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : application.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                        <p className="text-sm text-gray-900 dark:text-white">{application.email}</p>
                      </div>
                      {application.phoneNumber && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</span>
                          <p className="text-sm text-gray-900 dark:text-white">{application.phoneNumber}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</span>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(application.submittedAt)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Application ID</span>
                        <p className="text-xs text-gray-900 dark:text-white font-mono">
                          {application.applicationId.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewApplication(application)}
                  >
                    View Details
                  </Button>
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
                ? 'No applications found matching your filters.'
                : 'No landlord applications found. Applications will appear here once users submit them.'}
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

      {/* Application Detail Modal */}
      <LandlordApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onApprove={handleApprove}
        onReject={handleReject}
        isProcessing={isProcessing}
      />

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

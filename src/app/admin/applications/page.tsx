'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generateClient } from 'aws-amplify/api';
import { listPropertyApplications, getApplication, listAllApplications } from '@/graphql/queries';
import { ApplicationCard } from '@/components/admin';
import { Button, Input } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Application, ApplicationStatus } from '@/API';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const client = generateClient();

export default function AdminApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
      filtered = filtered.filter((app) => {
        const applicant = app.applicant;
        const property = app.property;
        return (
          (applicant?.firstName?.toLowerCase().includes(query) ||
            applicant?.lastName?.toLowerCase().includes(query) ||
            applicant?.email?.toLowerCase().includes(query)) ||
          property?.title?.toLowerCase().includes(query) ||
          app.applicationId.toLowerCase().includes(query)
        );
      });
    }

    setFilteredApplications(filtered);
  }, [searchQuery, statusFilter, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await client.graphql({
        query: listAllApplications,
        variables: { limit: 1000 },
      });

      const applicationsData = (response as any).data?.listAllApplications?.applications || [];
      setApplications(applicationsData);
      setFilteredApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = async (application: Application) => {
    try {
      // Fetch full application details
      const response = await client.graphql({
        query: getApplication,
        variables: { applicationId: application.applicationId },
      });

      const fullApplication = (response as any).data?.getApplication;
      if (fullApplication) {
        setSelectedApplication(fullApplication);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      // Fallback to basic application data
      setSelectedApplication(application);
      setIsDetailModalOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            Applications Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage rental applications
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value={ApplicationStatus.SUBMITTED}>Submitted</option>
          <option value={ApplicationStatus.UNDER_REVIEW}>Under Review</option>
          <option value={ApplicationStatus.APPROVED}>Approved</option>
          <option value={ApplicationStatus.REJECTED}>Rejected</option>
          <option value={ApplicationStatus.WITHDRAWN}>Withdrawn</option>
        </select>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.applicationId}
              application={application}
              onView={handleViewApplication}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'No applications found matching your filters.'
                : 'No applications found. Applications will appear here once tenants submit them.'}
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
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedApplication(null);
        }}
        title={`Application Details #${selectedApplication?.applicationId.slice(-8)}`}
        size="lg"
      >
        {selectedApplication && (
          <div className="space-y-6">
            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Status
              </h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedApplication.status.replace(/_/g, ' ')}
              </p>
            </div>

            {/* Applicant Info */}
            {selectedApplication.applicant && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Applicant
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedApplication.applicant.firstName}{' '}
                    {selectedApplication.applicant.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedApplication.applicant.email}
                  </p>
                  {selectedApplication.applicant.phoneNumber && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedApplication.applicant.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Property Info */}
            {selectedApplication.property && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Property
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedApplication.property.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedApplication.property.address.street},{' '}
                    {selectedApplication.property.address.ward},{' '}
                    {selectedApplication.property.address.district},{' '}
                    {selectedApplication.property.address.region}
                  </p>
                  <Link
                    href={`/property/${selectedApplication.property.propertyId}`}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block"
                  >
                    View Property →
                  </Link>
                </div>
              </div>
            )}

            {/* Application Details */}
            {selectedApplication.applicantDetails && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Application Details
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Occupation</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedApplication.applicantDetails.occupation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Income</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('en-TZ', {
                          style: 'currency',
                          currency: 'TZS',
                          minimumFractionDigits: 0,
                        }).format(selectedApplication.applicantDetails.monthlyIncome)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Move-in Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedApplication.applicantDetails.moveInDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Lease Duration</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedApplication.applicantDetails.leaseDuration} months
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Submitted</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedApplication.submittedAt)}
                </p>
              </div>
              {selectedApplication.updatedAt && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedApplication.updatedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Rejection Reason */}
            {selectedApplication.rejectionReason && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Rejection Reason
                </h3>
                <p className="text-sm text-gray-900 dark:text-white bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  {selectedApplication.rejectionReason}
                </p>
              </div>
            )}

            {/* Landlord Notes */}
            {selectedApplication.landlordNotes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Landlord Notes
                </h3>
                <p className="text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  {selectedApplication.landlordNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

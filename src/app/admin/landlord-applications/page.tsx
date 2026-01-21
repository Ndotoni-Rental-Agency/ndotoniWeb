'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button, Input } from '@/components/ui';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAdminLandlordApplications } from '@/hooks/useAdminLandlordApplications';
import { LandlordApplicationModal } from '@/components/admin/LandlordApplicationModal';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';
import { LandlordApplication, LandlordApplicationStatus } from '@/API';

export const dynamic = 'force-dynamic';

export default function AdminLandlordApplicationsPage() {
  const [applications, setApplications] = useState<LandlordApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LandlordApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'all'>('all');
  const [selectedApplication, setSelectedApplication] =
    useState<LandlordApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    listApplications,
    approveApplication,
    rejectApplication,
    isProcessing,
  } = useAdminLandlordApplications();

  const { notification, showSuccess, showError, closeNotification } =
    useNotification();

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Apply filters/search
  useEffect(() => {
    let filtered = [...applications];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter(app => {
        const firstName = app.applicant?.firstName?.toLowerCase() ?? '';
        const lastName = app.applicant?.lastName?.toLowerCase() ?? '';
        const appId = app.applicationId.toLowerCase();

        return firstName.includes(q) || lastName.includes(q) || appId.includes(q);
      });
    }

    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const apps = await listApplications();
      setApplications([]);
      setFilteredApplications([]);
    } catch (err) {
      console.error(err);
      showError('Error', 'Failed to load landlord applications.');
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Approve handler
  const handleApprove = async (applicationId: string) => {
    const result = await approveApplication(applicationId);

    if (!result.success) {
      showError('Error', result.message);
      return;
    }

    setApplications(prev =>
      prev.map(app =>
        app.applicationId === applicationId
          ? {
              ...app,
              status: LandlordApplicationStatus.APPROVED,
              reviewedAt: new Date().toISOString(),
            }
          : app
      )
    );

    showSuccess('Approved', result.message);
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  // Reject handler
  const handleReject = async (applicationId: string, reason?: string) => {
    const result = await rejectApplication(applicationId, reason);

    if (!result.success) {
      showError('Error', result.message);
      return;
    }

    setApplications(prev =>
      prev.map(app =>
        app.applicationId === applicationId
          ? {
              ...app,
              status: LandlordApplicationStatus.REJECTED,
              rejectionReason: reason ?? null,
              reviewedAt: new Date().toISOString(),
            }
          : app
      )
    );

    showSuccess('Rejected', result.message);
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  // Date formatter
  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by name or application ID"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="rounded-lg border px-4 py-2 text-sm bg-white dark:bg-gray-800"
        >
          <option value="all">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      {filteredApplications.length ? (
        <div className="space-y-4">
          {filteredApplications.map(app => {
            const fullName = `${app.applicant?.firstName ?? 'Unknown'} ${app.applicant?.lastName ?? 'User'}`;
            return (
              <Card key={app.applicationId}>
                <CardContent className="p-6">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{fullName}</h3>
                      <p className="text-sm text-gray-500">
                        Submitted: {formatDate(app?.submittedAt ?? "")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          app.status === LandlordApplicationStatus.APPROVED
                            ? 'bg-green-100 text-green-800'
                            : app.status === LandlordApplicationStatus.REJECTED
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {app.status}
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApplication(app);
                          setIsModalOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No landlord applications found.
          </CardContent>
        </Card>
      )}

      {/* Modal */}
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

      {/* Notification */}
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

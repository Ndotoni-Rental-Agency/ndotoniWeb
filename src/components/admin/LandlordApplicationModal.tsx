'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui';
import { CheckCircleIcon, XCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { LandlordApplication } from '@/API';

interface LandlordApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: LandlordApplication | null;
  onApprove: (applicationId: string) => Promise<void>;
  onReject: (applicationId: string, reason?: string) => Promise<void>;
  isProcessing: boolean;
}

export function LandlordApplicationModal({
  isOpen,
  onClose,
  application,
  onApprove,
  onReject,
  isProcessing,
}: LandlordApplicationModalProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!application) return null;

  const fullName =
    `${application.applicant?.firstName ?? 'Unknown'} ${
      application.applicant?.lastName ?? 'User'
    }`;

  const submittedAt = application.submittedAt
    ? new Date(application.submittedAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const handleClose = () => {
    onClose();
    setRejectionReason('');
    setShowRejectForm(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Landlord Application" size="lg">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <UserCircleIcon className="h-12 w-12 text-gray-400" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {fullName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Application ID: {application.applicationId}
            </p>
          </div>

          <span
            className={`ml-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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

        {/* Applicant Details */}
        <section className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
            Applicant Information
          </h3>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400">Full Name</dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                {fullName}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400">Phone Number</dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                {application.phoneNumber || '—'}
              </dd>
            </div>

            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400">Submitted At</dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                {submittedAt}
              </dd>
            </div>
          </dl>
        </section>

        {/* Rejection Reason */}
        {application.status === 'REJECTED' && application.rejectionReason && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-xs font-semibold text-red-900 dark:text-red-400 mb-1">
              Rejection Reason
            </p>
            <p className="text-sm text-red-800 dark:text-red-300">
              {application.rejectionReason}
            </p>
          </div>
        )}

        {/* Reject Form */}
        {showRejectForm && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rejection Reason (Optional)
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="Explain why this application is rejected…"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        {application.status === 'PENDING' && (
          <div className="flex justify-end gap-3 border-t pt-4 border-gray-200 dark:border-gray-700">
            {!showRejectForm ? (
              <>
                <Button
                  variant="outline"
                  disabled={isProcessing}
                  onClick={() => setShowRejectForm(true)}
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="primary"
                  loading={isProcessing}
                  onClick={async () => {
                    await onApprove(application.applicationId);
                    handleClose();
                  }}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  loading={isProcessing}
                  onClick={async () => {
                    await onReject(application.applicationId, rejectionReason || undefined);
                    handleClose();
                  }}
                >
                  Confirm Rejection
                </Button>
              </>
            )}
          </div>
        )}

        {(application.status === 'APPROVED' || application.status === 'REJECTED') && (
          <div className="flex justify-end border-t pt-4 border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

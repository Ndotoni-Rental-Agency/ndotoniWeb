'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, Input } from '@/components/ui';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

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

  const handleApprove = async () => {
    await onApprove(application.applicationId);
    onClose();
    setRejectionReason('');
    setShowRejectForm(false);
  };

  const handleReject = async () => {
    await onReject(application.applicationId, rejectionReason || undefined);
    onClose();
    setRejectionReason('');
    setShowRejectForm(false);
  };

  const handleClose = () => {
    onClose();
    setRejectionReason('');
    setShowRejectForm(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Landlord Application Details" size="lg">
      <div className="space-y-6">
        {/* User Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            Applicant Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {application.firstName} {application.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {application.email}
              </p>
            </div>
            {application.phoneNumber && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {application.phoneNumber}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
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
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Submitted At</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(application.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Rejection Reason (if rejected) */}
        {application.status === 'REJECTED' && application.rejectionReason && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <p className="text-xs font-semibold text-red-900 dark:text-red-400 mb-1">
              Rejection Reason
            </p>
            <p className="text-sm text-red-800 dark:text-red-300">
              {application.rejectionReason}
            </p>
          </div>
        )}

        {/* Rejection Form */}
        {showRejectForm && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rejection Reason (Optional)
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="e.g., We can't approve you because of 1, 2, 3..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
        )}

        {/* Action Buttons */}
        {application.status === 'PENDING' && (
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {!showRejectForm ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(true)}
                  disabled={isProcessing}
                >
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApprove}
                  loading={isProcessing}
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
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
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  loading={isProcessing}
                >
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  Confirm Rejection
                </Button>
              </>
            )}
          </div>
        )}

        {/* Close button for approved/rejected applications */}
        {(application.status === 'APPROVED' || application.status === 'REJECTED') && (
          <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

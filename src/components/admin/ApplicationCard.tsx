import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Application, ApplicationStatus } from '@/API';
import { cn } from '@/lib/utils/common';
import Link from 'next/link';

interface ApplicationCardProps {
  application: Application;
  onView?: (application: Application) => void;
  className?: string;
}

export function ApplicationCard({ application, onView, className }: ApplicationCardProps) {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case ApplicationStatus.UNDER_REVIEW:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case ApplicationStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case ApplicationStatus.WITHDRAWN:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const applicant = application.applicant;
  const property = application.property;

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Application #{application.applicationId.slice(-8)}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(application.status)
                )}
              >
                {application.status.replace(/_/g, ' ')}
              </span>
            </div>

            {applicant && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Applicant: {applicant.firstName} {applicant.lastName}
                </p>
              </div>
            )}

            {property && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Property: {property.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {property.address.ward}, {property.address.district}, {property.address.region}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: property.pricing.currency || 'TZS',
                    minimumFractionDigits: 0,
                  }).format(property.pricing.monthlyRent)}/month
                </p>
              </div>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
              <span>Submitted: {formatDate(application.submittedAt)}</span>
              {application.applicantDetails && (
                <span>
                  Move-in: {formatDate(application.applicantDetails.moveInDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {property && (
            <Link href={`/property/${property.propertyId}`}>
              <Button variant="outline" size="sm">
                View Property
              </Button>
            </Link>
          )}
          {onView && (
            <Button variant="primary" size="sm" onClick={() => onView(application)}>
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

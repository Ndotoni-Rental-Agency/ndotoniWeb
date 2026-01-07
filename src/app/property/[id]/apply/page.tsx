'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cachedGraphQL, getProperty, submitApplication } from '@/lib/graphql';
import { Property } from '@/types/property';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { useApplicationForm } from '@/hooks/useApplicationForm';
import { buildApplicationInput } from '@/lib/utils/application';
import { ApplicantDetailsSection } from '@/components/application/ApplicantDetailsSection';
import { EmergencyContactSection } from '@/components/application/EmergencyContactSection';
import { EmploymentDetailsSection } from '@/components/application/EmploymentDetailsSection';
import { ReferencesSection } from '@/components/application/ReferencesSection';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const {
    formData,
    formErrors,
    updateField,
    updateReference,
    addReference,
    removeReference,
    validateForm,
  } = useApplicationForm();

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      setLoading(true);
      const response = await cachedGraphQL.query({
        query: getProperty,
        variables: { propertyId },
      });
      const propertyData = response.data?.getProperty;
      if (propertyData) {
        setProperty(propertyData);
      } else {
        setError('Property not found');
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!property || !user) {
      setError('Missing property or user information');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const input = buildApplicationInput(formData, property.propertyId);

      const response = await cachedGraphQL.mutate({
        query: submitApplication,
        variables: { input },
      });

      if (response.data?.submitApplication) {
        router.push(`/property/${property.propertyId}?applicationSubmitted=true`);
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && !property) {
    return <ErrorState error={error} />;
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader property={property} />

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-8">
          <ApplicantDetailsSection
            formData={formData}
            formErrors={formErrors}
            onFieldChange={updateField}
          />

          <EmergencyContactSection
            formData={formData}
            formErrors={formErrors}
            onFieldChange={updateField}
          />

          <EmploymentDetailsSection
            formData={formData}
            formErrors={formErrors}
            onFieldChange={updateField}
          />

          <ReferencesSection
            formData={formData}
            formErrors={formErrors}
            onFieldChange={updateField}
            onReferenceChange={updateReference}
            onAddReference={addReference}
            onRemoveReference={removeReference}
          />

          <FormActions
            propertyId={property.propertyId}
            submitting={submitting}
          />
        </form>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

// Helper Components
function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg">
          <h3 className="font-medium">Error</h3>
          <p className="text-sm mt-1">{error}</p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            ← Back to Properties
          </Link>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ property }: { property: Property }) {
  return (
    <div className="mb-8">
      <Link
        href={`/property/${property.propertyId}`}
        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mb-4 inline-flex items-center gap-2 font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Property
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Apply for {property.title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Please fill out the application form below. All fields marked with * are required.
      </p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
      {message}
    </div>
  );
}

function FormActions({ propertyId, submitting }: { propertyId: string; submitting: boolean }) {
  return (
    <div className="flex gap-4">
      <Link
        href={`/property/${propertyId}`}
        className="flex-1 py-3 px-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-center transition-colors"
      >
        Cancel
      </Link>
      <button
        type="submit"
        disabled={submitting}
        className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </div>
  );
}

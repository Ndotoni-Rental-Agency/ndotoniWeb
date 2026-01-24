'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/API';
import { DynamicAuthModal } from '@/components/ui/DynamicModal';

function AuthGuardContent({ 
  children, 
  requiredRole, 
  fallbackPath = '/',
  showAuthModal = true
}: {
  children: React.ReactNode;
  requiredRole?: UserType | UserType[];
  fallbackPath?: string;
  showAuthModal?: boolean;
  showBecomeLandlordForTenants?: boolean;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  
  // Check if auth is required from URL params (set by middleware)
  const authRequired = searchParams.get('auth') === 'required';
  const redirectPath = searchParams.get('redirect');

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      if (showAuthModal && authRequired) {
        setShowModal(true);
      } else {
        router.push(fallbackPath);
      }
      return;
    }

    // Check role-based access
    if (requiredRole && user) {
      const hasRequiredRole = Array.isArray(requiredRole) 
        ? requiredRole.includes(user.userType)
        : user.userType === requiredRole;

      if (!hasRequiredRole) {
        // Redirect based on user type
        if (user.userType === 'ADMIN') {
          router.push('/admin');
        }
        else if( user.hasProperties) {
          router.push('/landlord');
        }
        else{
          router.push('/');
        }
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, fallbackPath, showAuthModal, authRequired]);

  const handleAuthSuccess = () => {
    setShowModal(false);
    // If there's a redirect path, go there, otherwise stay on current page
    if (redirectPath) {
      router.push(redirectPath);
    }
  };

  const handleAuthModalClose = () => {
    setShowModal(false);
    router.push(fallbackPath);
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if required
  if (!isAuthenticated && showModal) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to sign in to access this page.
            </p>
          </div>
        </div>
        <DynamicAuthModal
          isOpen={showModal}
          onClose={handleAuthModalClose}
          initialMode="signin"
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check role-based access
  if (requiredRole && user) {
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(user.userType)
      : user.userType === requiredRole;

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserType | UserType[];
  fallbackPath?: string;
  showAuthModal?: boolean;
  showBecomeLandlordForTenants?: boolean;
}

export default function AuthGuard(props: AuthGuardProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <AuthGuardContent {...props} />
    </Suspense>
  );
}
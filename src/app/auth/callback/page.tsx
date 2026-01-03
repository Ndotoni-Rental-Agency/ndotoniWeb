'use client';

import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    try {
      // Parse the URL fragment for OAuth tokens
      const hash = window.location.hash.substring(1);
      const search = window.location.search.substring(1);
      
      // Try both hash and search params (different providers use different methods)
      const hashParams = new URLSearchParams(hash);
      const searchParams = new URLSearchParams(search);
      
      const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
      const error = hashParams.get('error') || searchParams.get('error');
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
      const state = hashParams.get('state') || searchParams.get('state');
      
      // Determine provider from referrer or state
      let provider = 'google';
      if (document.referrer.includes('facebook.com') || state === 'facebook') {
        provider = 'facebook';
      }

      if (error) {
        // Send error to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: `${provider.toUpperCase()}_AUTH_ERROR`,
            error: errorDescription || error
          }, window.location.origin);
        }
      } else if (accessToken) {
        // Send success to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: `${provider.toUpperCase()}_AUTH_SUCCESS`,
            accessToken: accessToken
          }, window.location.origin);
        }
      } else {
        // No token found, send error
        if (window.opener) {
          window.opener.postMessage({
            type: `${provider.toUpperCase()}_AUTH_ERROR`,
            error: 'No access token received'
          }, window.location.origin);
        }
      }
    } catch (err) {
      // Handle any parsing errors
      if (window.opener) {
        window.opener.postMessage({
          type: 'AUTH_ERROR',
          error: 'Failed to process authentication response'
        }, window.location.origin);
      }
    }

    // Close the popup window after a short delay
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
        <p className="text-sm text-gray-500 mt-2">This window will close automatically</p>
      </div>
    </div>
  );
}
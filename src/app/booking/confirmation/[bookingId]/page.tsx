'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GraphQLClient } from '@/lib/graphql-client';
import { useAuth } from '@/contexts/AuthContext';

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const bookingId = params?.bookingId as string;
  
  const [booking, setBooking] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch booking details
  useEffect(() => {
    if (!bookingId || !isAuthenticated) return;
    
    const fetchBooking = async () => {
      try {
        // TODO: Add getBooking query to fetch booking details
        // For now, get from session storage if available
        const bookingData = sessionStorage.getItem(`booking_${bookingId}`);
        const propertyData = sessionStorage.getItem(`property_${bookingId}`);
        
        if (bookingData && propertyData) {
          setBooking(JSON.parse(bookingData));
          setProperty(JSON.parse(propertyData));
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, isAuthenticated]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load booking details'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const bookingUrl = `${window.location.origin}/bookings/${bookingId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingUrl)}`;

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 print-area">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600">Your reservation has been successfully confirmed</p>
            </div>

            {/* Booking Details */}
            <div className="border-t border-b py-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Information</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-mono font-semibold text-gray-900">{bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                    Confirmed
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Property</p>
                  <p className="font-semibold text-lg text-gray-900">{property.title}</p>
                  {property.location && (
                    <p className="text-sm text-gray-600">{property.location}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Check-in</p>
                    <p className="font-medium text-gray-900">{formatDate(booking.checkInDate)}</p>
                    <p className="text-xs text-gray-500">After 2:00 PM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Check-out</p>
                    <p className="font-medium text-gray-900">{formatDate(booking.checkOutDate)}</p>
                    <p className="text-xs text-gray-500">Before 11:00 AM</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Guests</p>
                  <p className="font-medium text-gray-900">
                    {booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Total Amount Paid</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatPrice(booking.pricing?.total || 0, booking.pricing?.currency || 'TZS')}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center mb-8 pb-8 border-b">
              <p className="text-sm font-medium text-gray-700 mb-3">Your Booking QR Code</p>
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="Booking QR Code" 
                  className="w-48 h-48"
                />
              </div>
              <p className="text-xs text-gray-500 mt-3">Show this QR code at check-in</p>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Important Information
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• A confirmation email has been sent to your email address</li>
                <li>• Check-in time: 2:00 PM - 6:00 PM</li>
                <li>• Check-out time: Before 11:00 AM</li>
                <li>• Please bring a valid government-issued ID</li>
                <li>• Contact the host 24 hours before arrival if you need assistance</li>
              </ul>
            </div>

            {/* Host Contact (if available) */}
            {property.host && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Host Information</h3>
                <p className="text-sm text-gray-700">
                  Hosted by {property.host.firstName} {property.host.lastName}
                </p>
                {property.host.phoneNumber && (
                  <p className="text-sm text-gray-600 mt-1">
                    Contact: {property.host.phoneNumber}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 no-print">
              <button
                onClick={handlePrint}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Download / Print Confirmation
              </button>
              
              <button
                onClick={() => router.push('/bookings')}
                className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 rounded-lg font-semibold transition"
              >
                View My Bookings
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

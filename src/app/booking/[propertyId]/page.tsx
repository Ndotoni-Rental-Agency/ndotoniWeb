'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { MpesaPayment } from '@/components/payment/MpesaPayment';
import { GraphQLClient } from '@/lib/graphql-client';
import { getShortTermProperty, getPayment } from '@/graphql/queries';
import { createBooking, initiatePayment } from '@/graphql/mutations';
import { useAuth } from '@/contexts/AuthContext';

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const propertyId = params?.propertyId as string;
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [paymentMessage, setPaymentMessage] = useState<string>('');

  // Redirect to login if not authenticated (shouldn't happen if coming from property page)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      router.push('/auth/signin');
    }
  }, [authLoading, isAuthenticated, router]);

  // Get booking details from URL params
  useEffect(() => {
    const checkIn = searchParams?.get('checkIn');
    const checkOut = searchParams?.get('checkOut');
    const guests = searchParams?.get('guests');

    if (checkIn && checkOut && guests) {
      setBookingData({
        checkIn,
        checkOut,
        guests: parseInt(guests),
      });
    } else {
      if (propertyId) {
        router.push(`/short-property/${propertyId}`);
      }
    }
  }, [searchParams, propertyId, router]);

  // Fetch property details
  useEffect(() => {
    if (!propertyId) return;
    
    const fetchProperty = async () => {
      try {
        const response = await GraphQLClient.execute<{ getShortTermProperty: any }>(
          getShortTermProperty,
          { propertyId }
        );

        if (response.getShortTermProperty) {
          setProperty(response.getShortTermProperty);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const calculateNights = () => {
    if (!bookingData) return 0;
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculatePricing = () => {
    if (!property || !bookingData) return null;

    const nights = calculateNights();
    const subtotal = property.nightlyRate * nights;
    const cleaningFee = property.cleaningFee || 0;
    const serviceFee = subtotal * ((property.serviceFeePercentage || 10) / 100);
    const taxes = (subtotal + cleaningFee + serviceFee) * ((property.taxPercentage || 0) / 100);
    const total = subtotal + cleaningFee + serviceFee + taxes;

    return {
      nights,
      subtotal,
      cleaningFee,
      serviceFee,
      taxes,
      total,
      currency: property.currency,
    };
  };

  const handleCreateBooking = async (guestDetails: any) => {
    try {
      setLoading(true);

      const pricing = calculatePricing();
      if (!pricing) return;

      const response = await GraphQLClient.execute<{ createBooking: any }>(
        createBooking,
        {
          input: {
            propertyId,
            checkInDate: bookingData.checkIn,
            checkOutDate: bookingData.checkOut,
            numberOfGuests: bookingData.guests,
            numberOfAdults: guestDetails.adults || bookingData.guests,
            numberOfChildren: guestDetails.children || 0,
            numberOfInfants: guestDetails.infants || 0,
            specialRequests: guestDetails.specialRequests || '',
            paymentMethodId: 'MPESA',
          },
        }
      );

      if (response.createBooking?.booking) {
        setBooking(response.createBooking.booking);
        return response.createBooking.booking;
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Expose createBooking to window for payment button access
  useEffect(() => {
    (window as any).__createBooking = handleCreateBooking;
    return () => {
      delete (window as any).__createBooking;
    };
  }, [handleCreateBooking]);

  const handlePaymentSuccess = () => {
    setPaymentStatus('CAPTURED');
    setPaymentMessage('Payment successful!');
    setShowConfirmation(true);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setPaymentStatus('FAILED');
    setPaymentMessage(error);
    setShowConfirmation(true);
  };

  const handleRetryPayment = () => {
    setShowConfirmation(false);
    setPaymentStatus('');
    setPaymentMessage('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading || !property || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const pricing = calculatePricing();
  if (!pricing) return null;

  if (showConfirmation && booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <BookingConfirmation 
            booking={booking} 
            property={property}
            paymentStatus={paymentStatus}
            paymentMessage={paymentMessage}
            onRetry={handleRetryPayment}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Confirm and pay</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <GuestDetailsForm
              property={property}
              bookingData={bookingData}
              userData={isAuthenticated && user ? {
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                email: user.email || '',
                phone: user.phoneNumber || user.whatsappNumber || '',
              } : undefined}
            />
          </div>

          <div>
            <BookingSummaryWithPayment
              property={property}
              bookingData={bookingData}
              pricing={pricing}
              booking={booking}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onPaymentStatusChange={(status: string, message: string) => {
                setPaymentStatus(status);
                setPaymentMessage(message);
              }}
              onShowConfirmation={(show: boolean) => setShowConfirmation(show)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GuestDetailsForm({ property, bookingData, userData }: any) {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    adults: bookingData.guests,
    children: 0,
    infants: 0,
    specialRequests: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
      }));
    }
  }, [userData]);

  useEffect(() => {
    (window as any).__bookingFormData = formData;
  }, [formData]);

  const totalGuests = formData.adults + formData.children;

  return (
    <div className="bg-white rounded-lg p-6 shadow space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Your information</h2>
        
        {userData && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              We've pre-filled your information. You can edit it if needed.
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="255712345678"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Guest details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adults (Age 13+)</label>
            <select
              value={formData.adults}
              onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Children (Age 2-12)</label>
            <select
              value={formData.children}
              onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
              disabled={totalGuests >= property.maxGuests}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100"
            >
              {Array.from({ length: Math.max(0, property.maxGuests - formData.adults) + 1 }, (_, i) => i).map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Infants (Under 2)</label>
            <select
              value={formData.infants}
              onChange={(e) => setFormData({ ...formData, infants: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {Array.from({ length: 6 }, (_, i) => i).map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Infants don't count toward guest limit</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Special requests (optional)</label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="Any special requests or requirements..."
        />
      </div>
    </div>
  );
}

function BookingSummaryWithPayment({ property, bookingData, pricing, booking, onPaymentSuccess, onPaymentError, onPaymentStatusChange, onShowConfirmation }: any) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [localBooking, setLocalBooking] = useState(booking);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [error, setError] = useState('');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalBooking(booking);
  }, [booking]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Notify parent of status changes
  useEffect(() => {
    if (onPaymentStatusChange) {
      onPaymentStatusChange(paymentStatus, paymentMessage);
    }
  }, [paymentStatus, paymentMessage, onPaymentStatusChange]);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Poll payment status
  const startPolling = (id: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes

    const interval = setInterval(async () => {
      attempts++;

      try {
        const response = await GraphQLClient.execute<{
          getPayment: {
            paymentId: string;
            status: string;
            transactionID?: string;
            errorMessage?: string;
            completedAt?: string;
          };
        }>(getPayment, { paymentId: id });

        if (response.getPayment) {
          const payment = response.getPayment;
          setPaymentStatus(payment.status);

          if (payment.status === 'CAPTURED' || payment.status === 'AUTHORIZED') {
            clearInterval(interval);
            setPollingInterval(null);
            setIsProcessing(false);
            setPaymentMessage('Payment successful! 🎉');
            onPaymentSuccess?.();
          } else if (payment.status === 'FAILED') {
            clearInterval(interval);
            setPollingInterval(null);
            setIsProcessing(false);
            setPaymentMessage(payment.errorMessage || 'Payment failed. You can retry below.');
            if (onPaymentError) {
              onPaymentError(payment.errorMessage || 'Payment failed');
            }
          }

          if (attempts >= maxAttempts) {
            clearInterval(interval);
            setPollingInterval(null);
            setIsProcessing(false);
            setPaymentMessage('Payment timeout. Please check your booking status or retry payment.');
          }
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }, 10000); // Check every 10 seconds

    setPollingInterval(interval);
  };

  const handlePayNow = async () => {
    setError('');
    setIsProcessing(true);

    try {
      const formData = (window as any).__bookingFormData;
      
      if (!formData || !formData.name || !formData.email || !formData.phone) {
        setError('Please fill in all required fields');
        setIsProcessing(false);
        return;
      }

      // Validate Tanzania phone number
      const phoneNumber = formData.phone;
      if (!/^255[67]\d{8}$/.test(phoneNumber)) {
        setError('Please enter a valid Tanzanian phone number (e.g., 255712345678)');
        setIsProcessing(false);
        return;
      }

      // Create booking
      const createdBooking = await (window as any).__createBooking(formData);
      if (!createdBooking) {
        setError('Failed to create booking');
        setIsProcessing(false);
        return;
      }

      setLocalBooking(createdBooking);
      
      // Immediately initiate payment
      const paymentResponse = await GraphQLClient.execute<{
        initiatePayment: {
          payment: {
            paymentId: string;
            bookingId: string;
            amount: number;
            currency: string;
            status: string;
            createdAt: string;
          };
          message: string;
        };
      }>(initiatePayment, {
        input: {
          bookingId: createdBooking.bookingId,
          phoneNumber,
        },
      });

      if (paymentResponse.initiatePayment) {
        const { payment, message } = paymentResponse.initiatePayment;
        setPaymentId(payment.paymentId);
        setPaymentStatus(payment.status);
        setPaymentMessage(message);
        
        // Start polling for status
        startPolling(payment.paymentId);
      } else {
        throw new Error('Payment initiation failed - no response from server');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMessage = err.errors?.[0]?.message || err.message || 'Failed to process payment. Please try again.';
      setError(errorMessage);
      setPaymentStatus('FAILED');
      setPaymentMessage(errorMessage);
      setIsProcessing(false);
      
      // Show confirmation modal with error
      if (localBooking && onShowConfirmation) {
        onShowConfirmation(true);
      }
    }
  };

  const handleRetry = () => {
    // Clear previous state
    setPaymentId(null);
    setPaymentStatus('');
    setPaymentMessage('');
    setError('');
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    
    // Retry payment
    handlePayNow();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow sticky top-24">
      <div className="flex gap-4 pb-6 border-b">
        {property.thumbnail && (
          <img src={property.thumbnail} alt={property.title} className="w-24 h-24 rounded-lg object-cover" />
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{property.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Hosted by {property.host?.firstName} {property.host?.lastName}
          </p>
        </div>
      </div>

      <div className="py-6 border-b space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Dates</span>
          <span className="font-medium">{formatDate(bookingData.checkIn)} - {formatDate(bookingData.checkOut)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Guests</span>
          <span className="font-medium">{bookingData.guests} guest{bookingData.guests > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="py-6 border-b space-y-3">
        <h3 className="font-semibold text-gray-900 mb-3">Price details</h3>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {formatPrice(property.nightlyRate, pricing.currency)} × {pricing.nights} night{pricing.nights > 1 ? 's' : ''}
          </span>
          <span>{formatPrice(pricing.subtotal, pricing.currency)}</span>
        </div>

        {pricing.cleaningFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Cleaning fee</span>
            <span>{formatPrice(pricing.cleaningFee, pricing.currency)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Service fee</span>
          <span>{formatPrice(pricing.serviceFee, pricing.currency)}</span>
        </div>

        {pricing.taxes > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Taxes</span>
            <span>{formatPrice(pricing.taxes, pricing.currency)}</span>
          </div>
        )}
      </div>

      <div className="pt-6 pb-6 border-b">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(pricing.total, pricing.currency)}</span>
        </div>
      </div>

      <div className="pt-6">
        {!paymentId ? (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {error}
              </div>
            )}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition"
            >
              {isProcessing ? 'Processing...' : 'Pay now'}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            {localBooking && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="text-gray-600">Booking ID</p>
                <p className="font-mono font-semibold">{localBooking.bookingId}</p>
              </div>
            )}

            <div className={`p-4 rounded-lg ${
              paymentStatus === 'CAPTURED' || paymentStatus === 'AUTHORIZED' 
                ? 'bg-green-50 border border-green-200' 
                : paymentStatus === 'FAILED'
                ? 'bg-red-50 border border-red-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  paymentStatus === 'CAPTURED' || paymentStatus === 'AUTHORIZED'
                    ? 'bg-green-100 text-green-800'
                    : paymentStatus === 'FAILED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {paymentStatus}
                </div>
              </div>

              {isProcessing && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
                  <p className="text-sm font-medium text-gray-900">Waiting for payment confirmation...</p>
                  <p className="text-xs text-gray-600 mt-1">Check your phone for M-Pesa prompt</p>
                </div>
              )}

              {paymentMessage && (
                <p className="text-sm text-gray-700 mt-2">{paymentMessage}</p>
              )}
            </div>

            {/* Show retry button if payment failed or timed out */}
            {(paymentStatus === 'FAILED' || (!isProcessing && paymentStatus === 'PROCESSING')) && (
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Retry Payment
              </button>
            )}

            {/* Payment instructions */}
            {isProcessing && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">How to complete payment:</h4>
                <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Check your phone for M-Pesa USSD prompt</li>
                  <li>Enter your M-Pesa PIN to confirm</li>
                  <li>Wait for confirmation (this may take a few moments)</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingConfirmation({ booking, property, paymentStatus, paymentMessage, onRetry }: any) {
  const router = useRouter();
  const isFailed = paymentStatus === 'FAILED';

  return (
    <div className="bg-white rounded-lg p-8 shadow text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
        isFailed ? 'bg-red-100' : 'bg-emerald-100'
      }`}>
        {isFailed ? (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {isFailed ? 'Payment Failed' : 'Booking confirmed!'}
      </h2>
      <p className="text-gray-600 mb-6">
        {isFailed 
          ? 'Your booking was created but payment failed. Please try again.'
          : 'Your booking has been confirmed and payment received.'
        }
      </p>

      {paymentMessage && (
        <div className={`mb-6 p-4 rounded-lg text-sm ${
          isFailed ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'
        }`}>
          {paymentMessage}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
        <div className="text-sm text-gray-600 mb-1">Booking ID</div>
        <div className="font-mono font-semibold">{booking.bookingId}</div>
      </div>

      {!isFailed && (
        <p className="text-sm text-gray-600 mb-6">
          A confirmation email has been sent to your email address with all the booking details.
        </p>
      )}

      <div className="space-y-3">
        {isFailed ? (
          <>
            <button
              onClick={onRetry}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Try Payment Again
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition"
            >
              Back to home
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push(`/bookings/${booking.bookingId}`)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition"
            >
              View booking details
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition"
            >
              Back to home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { initiatePayment } from '@/graphql/mutations';
import { getPayment } from '@/graphql/queries';

interface MpesaPaymentProps {
  booking: {
    bookingId: string;
    pricing: {
      total: number;
      currency: string;
    };
    propertyTitle: string;
  };
  initialPhoneNumber?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export function MpesaPayment({ booking, initialPhoneNumber = '', onSuccess, onError }: MpesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [message, setMessage] = useState('');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Update phone number when initialPhoneNumber changes
  useEffect(() => {
    if (initialPhoneNumber && !phoneNumber) {
      setPhoneNumber(initialPhoneNumber);
    }
  }, [initialPhoneNumber, phoneNumber]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Format phone number as user types (Tanzania format)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Auto-add 255 prefix if not present
    if (value.length > 0 && !value.startsWith('255')) {
      if (value.startsWith('0')) {
        // User typed 0712345678 → convert to 255712345678
        value = '255' + value.substring(1);
      } else if (value.startsWith('7') || value.startsWith('6')) {
        // User typed 712345678 → convert to 255712345678
        value = '255' + value;
      }
    }
    
    // Limit to 12 digits (255 + 9 digits)
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    
    setPhoneNumber(value);
  };

  // Format phone number for display (add spaces for readability)
  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return '';
    
    // Format as: 255 712 345 678
    if (phone.length >= 3) {
      const parts = [
        phone.substring(0, 3),  // 255
        phone.substring(3, 6),  // 712
        phone.substring(6, 9),  // 345
        phone.substring(9, 12), // 678
      ].filter(Boolean);
      
      return parts.join(' ');
    }
    
    return phone;
  };

  // Validate Tanzania phone number (255XXXXXXXXX)
  const isValidPhone = (phone: string) => {
    return /^255[67]\d{8}$/.test(phone); // 255 + (6 or 7) + 8 digits
  };

  // Validate phone number
  const handlePayment = async () => {
    if (!isValidPhone(phoneNumber)) {
      setMessage('Please enter a valid Tanzanian phone number (e.g., 255712345678)');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await GraphQLClient.execute<{
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
          bookingId: booking.bookingId,
          phoneNumber,
        },
      });

      if (response.initiatePayment) {
        const { payment, message: responseMessage } = response.initiatePayment;
        
        setPaymentId(payment.paymentId);
        setStatus(payment.status);
        setMessage(responseMessage);

        // Start polling for status
        startPolling(payment.paymentId);
      }
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      setMessage(error.message || 'Payment failed. Please try again.');
      setLoading(false);
      onError?.(error.message);
    }
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
          setStatus(payment.status);

          if (payment.status === 'CAPTURED' || payment.status === 'AUTHORIZED') {
            clearInterval(interval);
            setPollingInterval(null);
            setLoading(false);
            setMessage('Payment successful! 🎉');
            onSuccess?.(id);
          } else if (payment.status === 'FAILED') {
            clearInterval(interval);
            setPollingInterval(null);
            setLoading(false);
            setMessage(payment.errorMessage || 'Payment failed. You can retry below.');
            onError?.(payment.errorMessage || 'Payment failed');
          }

          if (attempts >= maxAttempts) {
            clearInterval(interval);
            setPollingInterval(null);
            setLoading(false);
            setMessage('Payment timeout. Please check your booking status or retry payment.');
          }
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }, 10000); // Check every 10 seconds

    setPollingInterval(interval);
  };

  // Retry payment
  const handleRetry = () => {
    // Clear previous state
    setPaymentId(null);
    setStatus('');
    setMessage('');
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    
    // Initiate new payment
    handlePayment();
  };

  return (
    <div className="mpesa-payment">
      <div className="payment-header">
        <h2>Pay with M-Pesa</h2>
        <div className="amount">
          <span className="currency">{booking.pricing.currency}</span>
          <span className="value">{booking.pricing.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="payment-details">
        <p className="property-title">{booking.propertyTitle}</p>
        <p className="booking-id">Booking ID: {booking.bookingId}</p>
      </div>

      {!paymentId ? (
        <div className="payment-form">
          <div className="form-group">
            <label htmlFor="phone">M-Pesa Phone Number (Tanzania)</label>
            <input
              id="phone"
              type="tel"
              placeholder="0712345678 or 712345678"
              value={formatPhoneDisplay(phoneNumber)}
              onChange={handlePhoneChange}
              disabled={loading}
              className={`phone-input ${phoneNumber && isValidPhone(phoneNumber) ? 'valid' : phoneNumber ? 'invalid' : ''}`}
              maxLength={15} // Increased for spaces
            />
            <p className="help-text">
              {phoneNumber && phoneNumber.startsWith('255') ? (
                <span className="auto-formatted">✓ Auto-formatted to {formatPhoneDisplay(phoneNumber)}</span>
              ) : (
                'Enter your Vodacom M-Pesa number (we\'ll add 255 automatically)'
              )}
            </p>
            {phoneNumber && !isValidPhone(phoneNumber) && phoneNumber.length >= 9 && (
              <p className="error-text">
                Please enter a valid number (should be 12 digits starting with 255)
              </p>
            )}
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !isValidPhone(phoneNumber)}
            className="pay-button"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      ) : (
        <div className="payment-status">
          <div className={`status-badge status-${status.toLowerCase()}`}>
            {status}
          </div>

          {loading && (
            <div className="loading-indicator">
              <div className="spinner" />
              <p>Waiting for payment confirmation...</p>
              <p className="small">Please check your phone for M-Pesa prompt</p>
            </div>
          )}

          {/* Show retry button if payment failed or timed out */}
          {(status === 'FAILED' || (!loading && status === 'PROCESSING')) && (
            <button onClick={handleRetry} className="retry-button">
              Retry Payment
            </button>
          )}
        </div>
      )}

      {message && (
        <div className={`message ${status === 'PAID' ? 'success' : 'info'}`}>
          {message}
        </div>
      )}

      <div className="payment-instructions">
        <h3>How to pay:</h3>
        <ol>
          <li>Enter your M-Pesa phone number</li>
          <li>Click "Pay Now"</li>
          <li>Check your phone for M-Pesa USSD prompt</li>
          <li>Enter your M-Pesa PIN to confirm</li>
          <li>Wait for confirmation</li>
        </ol>
      </div>

      <style jsx>{`
        .mpesa-payment {
          max-width: 500px;
          margin: 0 auto;
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .payment-header {
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .payment-header h2 {
          margin: 0 0 12px 0;
          font-size: 24px;
          color: #111827;
        }

        .amount {
          font-size: 32px;
          font-weight: bold;
          color: #059669;
        }

        .currency {
          font-size: 18px;
          margin-right: 4px;
        }

        .payment-details {
          margin-bottom: 24px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .property-title {
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .booking-id {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
        }

        .phone-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .phone-input:focus {
          outline: none;
          border-color: #059669;
        }

        .phone-input.valid {
          border-color: #059669;
          background: #f0fdf4;
        }

        .phone-input.invalid {
          border-color: #ef4444;
        }

        .phone-input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .help-text {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #6b7280;
        }

        .auto-formatted {
          color: #059669;
          font-weight: 500;
        }

        .error-text {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #ef4444;
        }

        .pay-button {
          width: 100%;
          padding: 14px;
          background: #059669;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .pay-button:hover:not(:disabled) {
          background: #047857;
        }

        .pay-button:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .payment-status {
          text-align: center;
          padding: 24px;
        }

        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .status-pending,
        .status-processing {
          background: #fef3c7;
          color: #92400e;
        }

        .status-paid {
          background: #d1fae5;
          color: #065f46;
        }

        .status-failed {
          background: #fee2e2;
          color: #991b1b;
        }

        .retry-button {
          margin-top: 16px;
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .retry-button:hover {
          background: #2563eb;
        }

        .loading-indicator {
          margin-top: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 12px;
          border: 4px solid #e5e7eb;
          border-top-color: #059669;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .small {
          font-size: 14px;
          color: #6b7280;
        }

        .message {
          margin-top: 16px;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
        }

        .message.success {
          background: #d1fae5;
          color: #065f46;
        }

        .message.info {
          background: #dbeafe;
          color: #1e40af;
        }

        .payment-instructions {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .payment-instructions h3 {
          font-size: 16px;
          margin: 0 0 12px 0;
          color: #374151;
        }

        .payment-instructions ol {
          margin: 0;
          padding-left: 20px;
          color: #6b7280;
        }

        .payment-instructions li {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth';

interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  startDate: string;
  endDate?: string;
  monthlyRent: number;
  status: 'active' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  nextPaymentDate?: string;
  currentMonthDue: number;
  daysUntilDue: number;
  leaseType: 'monthly' | 'yearly' | 'short-term';
  amenities: string[];
  totalPaid: number;
  lastPaymentDate?: string;
  securityDeposit: number;
  utilities: {
    electricity: number;
    water: number;
    internet: number;
  };
}

export default function StaysPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder data - replace with actual API call
    const placeholderBookings: Booking[] = [
      {
        id: '1',
        propertyId: 'prop-1',
        propertyTitle: 'Modern 2BR Apartment in Masaki',
        propertyAddress: 'Masaki Peninsula, Dar es Salaam',
        propertyImage: '/images/properties/masaki-apt.jpg',
        landlordName: 'John Mwalimu',
        landlordPhone: '+255 123 456 789',
        landlordEmail: 'john@example.com',
        startDate: '2024-01-15',
        monthlyRent: 800000,
        status: 'active',
        paymentStatus: 'overdue',
        nextPaymentDate: '2024-12-15',
        currentMonthDue: 850000, // Rent + utilities
        daysUntilDue: -2, // 2 days overdue
        leaseType: 'yearly',
        amenities: ['WiFi', 'Parking', 'Security', 'Generator'],
        totalPaid: 9600000,
        lastPaymentDate: '2024-11-15',
        securityDeposit: 1600000,
        utilities: {
          electricity: 35000,
          water: 10000,
          internet: 5000
        }
      },
      {
        id: '2',
        propertyId: 'prop-2',
        propertyTitle: 'Cozy Studio in Mikocheni',
        propertyAddress: 'Mikocheni, Dar es Salaam',
        propertyImage: '/images/properties/mikocheni-studio.jpg',
        landlordName: 'Sarah Hassan',
        landlordPhone: '+255 987 654 321',
        landlordEmail: 'sarah@example.com',
        startDate: '2023-03-01',
        endDate: '2023-12-31',
        monthlyRent: 450000,
        status: 'completed',
        paymentStatus: 'paid',
        leaseType: 'yearly',
        amenities: ['WiFi', 'Security'],
        totalPaid: 4500000,
        currentMonthDue: 0,
        daysUntilDue: 0,
        lastPaymentDate: '2023-12-01',
        securityDeposit: 900000,
        utilities: {
          electricity: 25000,
          water: 8000,
          internet: 0
        }
      },
      {
        id: '3',
        propertyId: 'prop-3',
        propertyTitle: 'Family House in Upanga',
        propertyAddress: 'Upanga West, Dar es Salaam',
        propertyImage: '/images/properties/upanga-house.jpg',
        landlordName: 'Michael Kimaro',
        landlordPhone: '+255 555 123 456',
        landlordEmail: 'michael@example.com',
        startDate: '2022-06-01',
        endDate: '2023-02-28',
        monthlyRent: 650000,
        status: 'completed',
        paymentStatus: 'paid',
        leaseType: 'monthly',
        amenities: ['Parking', 'Garden', 'Security'],
        totalPaid: 5850000,
        currentMonthDue: 0,
        daysUntilDue: 0,
        lastPaymentDate: '2023-02-01',
        securityDeposit: 650000,
        utilities: {
          electricity: 40000,
          water: 15000,
          internet: 0
        }
      }
    ];

    setTimeout(() => {
      setBookings(placeholderBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const currentBookings = bookings.filter(booking => booking.status === 'active');
  const pastBookings = bookings.filter(booking => booking.status === 'completed' || booking.status === 'cancelled');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentUrgency = (daysUntilDue: number, paymentStatus: string) => {
    if (paymentStatus === 'overdue') {
      return {
        message: `${Math.abs(daysUntilDue)} days overdue`,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200'
      };
    } else if (daysUntilDue <= 3 && daysUntilDue > 0) {
      return {
        message: `Due in ${daysUntilDue} days`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200'
      };
    } else if (daysUntilDue <= 7 && daysUntilDue > 3) {
      return {
        message: `Due in ${daysUntilDue} days`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200'
      };
    } else if (paymentStatus === 'paid') {
      return {
        message: 'Paid for this month',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200'
      };
    }
    return {
      message: `Due in ${daysUntilDue} days`,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 border-gray-200'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your stays...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white">Stays</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Current Residence Section */}
        {currentBookings.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Where you're staying</h2>
            <div className="space-y-6">
              {currentBookings.map((booking) => {
                const paymentUrgency = getPaymentUrgency(booking.daysUntilDue, booking.paymentStatus);
                return (
                  <Link 
                    key={booking.id} 
                    href={`/property/${booking.propertyId}`}
                    className="block group"
                  >
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow bg-white dark:bg-gray-800">
                      <div className="flex flex-col sm:flex-row">
                        {/* Property Image */}
                        <div className="flex-shrink-0 w-full sm:w-80 h-64 sm:h-auto bg-gray-200 dark:bg-gray-700 relative">
                          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                            <svg className="w-20 h-20 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          {booking.paymentStatus === 'overdue' && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Payment Overdue
                            </div>
                          )}
                        </div>

                        {/* Property Details */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{booking.propertyAddress}</p>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                                {booking.propertyTitle}
                              </h3>
                            </div>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <svg className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Moved in {formatDate(booking.startDate)}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <svg className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(booking.monthlyRent)}</span>
                              <span className="ml-1">per month</span>
                            </div>

                            {booking.paymentStatus !== 'paid' && (
                              <div className={`flex items-start p-3 rounded-lg ${paymentUrgency.bgColor} dark:bg-opacity-20 border dark:border-opacity-30`}>
                                <svg className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${paymentUrgency.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <p className={`text-sm font-medium ${paymentUrgency.color}`}>
                                    {paymentUrgency.message}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Amount due: {formatCurrency(booking.currentMonthDue)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
                            {booking.paymentStatus !== 'paid' && (
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Handle payment
                                }}
                                className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-2.5 rounded-lg font-medium transition-colors text-sm"
                              >
                                Pay rent
                              </button>
                            )}
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                // Handle contact
                              }}
                              className="border border-gray-900 dark:border-white hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm"
                            >
                              Contact host
                            </button>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                // Handle details
                              }}
                              className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors text-sm underline"
                            >
                              Show details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Past Rentals Section */}
        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Where you've been</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastBookings.map((booking) => (
                <Link 
                  key={booking.id} 
                  href={`/property/${booking.propertyId}`}
                  className="group"
                >
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow bg-white dark:bg-gray-800">
                    {/* Property Image */}
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 relative">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{booking.propertyAddress}</p>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors mb-3">
                        {booking.propertyTitle}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{formatCurrency(booking.monthlyRent)}/month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for No Bookings */}
        {currentBookings.length === 0 && pastBookings.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No stays yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              When you book a place to stay, you'll find it here.
            </p>
            <Link 
              href="/search"
              className="inline-block bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start searching
            </Link>
          </div>
        )}
      </div>
      </div>
    </AuthGuard>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockBookings: Booking[] = [
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
      setBookings(mockBookings);
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-1 text-gray-600">Manage your current and past rentals</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Residence Section */}
        {currentBookings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Current Residence</h2>
            {currentBookings.map((booking) => {
              const paymentUrgency = getPaymentUrgency(booking.daysUntilDue, booking.paymentStatus);
              return (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                {/* Payment Alert Banner */}
                {booking.paymentStatus !== 'paid' && (
                  <div className={`p-4 border-b ${paymentUrgency.bgColor} border`}>
                    <div className="flex items-center space-x-3">
                      <svg className={`w-6 h-6 ${paymentUrgency.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className={`font-semibold ${paymentUrgency.color}`}>
                          Payment {booking.paymentStatus === 'overdue' ? 'Overdue' : 'Due Soon'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {paymentUrgency.message} • Amount due: {formatCurrency(booking.currentMonthDue)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                    {/* Property Image */}
                    <div className="flex-shrink-0 mb-6 lg:mb-0">
                      <div className="w-full lg:w-80 h-48 lg:h-56 bg-gray-200 rounded-xl overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{booking.propertyTitle}</h3>
                          <p className="text-gray-600 mb-3">{booking.propertyAddress}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              Payment {booking.paymentStatus}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-red-500 mb-1">
                            {formatCurrency(booking.monthlyRent)}
                          </div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>

                      {/* Payment Breakdown */}
                      <div className="bg-blue-50 rounded-xl p-6 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">This Month's Payment Breakdown</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Monthly Rent</span>
                              <span className="font-semibold">{formatCurrency(booking.monthlyRent)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Electricity</span>
                              <span className="font-semibold">{formatCurrency(booking.utilities.electricity)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Water</span>
                              <span className="font-semibold">{formatCurrency(booking.utilities.water)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Internet</span>
                              <span className="font-semibold">{formatCurrency(booking.utilities.internet)}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-lg font-bold border-t pt-3">
                              <span className="text-gray-900">Total Due</span>
                              <span className="text-red-600">{formatCurrency(booking.currentMonthDue)}</span>
                            </div>
                            {booking.lastPaymentDate && (
                              <div className="text-sm text-gray-500">
                                Last payment: {formatDate(booking.lastPaymentDate)}
                              </div>
                            )}
                            <div className="text-sm text-gray-500">
                              Security deposit: {formatCurrency(booking.securityDeposit)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lease Information */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500 mb-1">Lease Started</div>
                          <div className="font-semibold text-gray-900">{formatDate(booking.startDate)}</div>
                        </div>
                        {booking.nextPaymentDate && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">Next Payment Due</div>
                            <div className="font-semibold text-gray-900">{formatDate(booking.nextPaymentDate)}</div>
                          </div>
                        )}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm text-gray-500 mb-1">Total Paid</div>
                          <div className="font-semibold text-gray-900">{formatCurrency(booking.totalPaid)}</div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-2">Amenities</div>
                        <div className="flex flex-wrap gap-2">
                          {booking.amenities.map((amenity, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Landlord Contact */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{booking.landlordName}</div>
                            <div className="text-gray-600 text-sm">Property Owner</div>
                          </div>
                          <div className="flex gap-2">
                            <a 
                              href={`tel:${booking.landlordPhone}`} 
                              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                              title="Call landlord"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </a>
                            <a 
                              href={`mailto:${booking.landlordEmail}`} 
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                              title="Email landlord"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {booking.paymentStatus !== 'paid' && (
                          <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
                            </svg>
                            Pay Rent - {formatCurrency(booking.currentMonthDue)}
                          </button>
                        )}
                        <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
                          Report Issue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* Past Rentals Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Rental History</h2>
          
          {pastBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pastBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Property Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{booking.propertyTitle}</h3>
                        <p className="text-gray-600 text-sm mb-2 truncate">{booking.propertyAddress}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Duration</div>
                            <div className="font-semibold text-gray-900">
                              {formatDate(booking.startDate)} - {booking.endDate ? formatDate(booking.endDate) : 'Present'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Total Paid</div>
                            <div className="font-semibold text-gray-900">{formatCurrency(booking.totalPaid)}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <Link 
                            href={`/property/${booking.propertyId}`}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                          >
                            View Property
                          </Link>
                          <span className="text-gray-300">•</span>
                          <button className="text-gray-500 hover:text-gray-600 text-sm font-medium">
                            Download Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rental history</h3>
              <p className="text-gray-500 mb-4">You haven't completed any rentals yet.</p>
              <Link 
                href="/search"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                Find Your First Property
              </Link>
            </div>
          )}
        </div>

        {/* Empty State for No Bookings */}
        {currentBookings.length === 0 && pastBookings.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No bookings yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your rental journey by finding the perfect property for your needs.
            </p>
            <Link 
              href="/search"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Properties
            </Link>
          </div>
        )}

        {/* Find New Property CTA - Bottom of Page */}
        {(currentBookings.length > 0 || pastBookings.length > 0) && (
          <div className="mt-16 text-center py-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Looking for a New Place?</h3>
            <p className="text-red-100 mb-6 max-w-md mx-auto">
              Explore thousands of properties and find your next perfect home
            </p>
            <Link 
              href="/search"
              className="bg-white text-red-500 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find New Property
            </Link>
          </div>
        )}
      </div>
      </div>
    </AuthGuard>
  );
}
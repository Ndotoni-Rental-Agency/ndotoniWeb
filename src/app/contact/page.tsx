'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: 'general' | 'support' | 'partnership' | 'property';
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'message' | 'offices' | 'hours'>('message');
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      title: 'Chat with us',
      description: 'Get instant help from our support team',
      action: 'Start Live Chat',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Call us',
      description: 'Speak directly with our team',
      action: '+255 123 456 789',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Email us',
      description: 'Send us a detailed message',
      action: 'hello@ndotoni.co.tz',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const offices = [
    {
      city: 'Dar es Salaam',
      country: 'Tanzania',
      address: 'Masaki Peninsula, Plot 123, Toure Drive',
      phone: '+255 123 456 789',
      email: 'dar@ndotoni.co.tz',
      isMain: true
    },
    {
      city: 'Arusha',
      country: 'Tanzania', 
      address: 'Njiro Road, Block C',
      phone: '+255 123 456 792',
      email: 'arusha@ndotoni.co.tz',
      isMain: false
    },
    {
      city: 'Mwanza',
      country: 'Tanzania',
      address: 'Nyerere Road, Building 45',
      phone: '+255 123 456 793', 
      email: 'mwanza@ndotoni.co.tz',
      isMain: false
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      {/* Simple Header Section */}
      <div className="py-12 sm:py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors">
              Contact <span className="text-red-500 dark:text-red-400">Us</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-12 px-4 transition-colors">
              Ready to find your perfect home or list your property? We're here to make it happen.
            </p>
            
            {/* Quick Contact Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 md:group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {method.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center transition-colors">{method.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 text-center transition-colors">{method.description}</p>
                  <button className={`w-full text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${method.color}`}>
                    {method.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="py-8 sm:py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="bg-white dark:bg-gray-700 rounded-full p-1 shadow-lg w-full max-w-md sm:max-w-none sm:w-auto overflow-x-auto transition-colors">
              {[
                { key: 'message', label: 'Send Message' },
                { key: 'offices', label: 'Our Offices' },
                { key: 'hours', label: 'Business Hours' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-red-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'message' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-8 shadow-lg transition-colors">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center sm:text-left transition-colors">Send us a Message</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center sm:text-left transition-colors">Fill out the form below and we'll get back to you within 24 hours</p>
                
                {submitStatus === 'success' && (
                  <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 rounded-r-xl transition-colors">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-green-400 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-green-800 dark:text-green-400 font-medium transition-colors">Message sent successfully!</p>
                        <p className="text-green-700 dark:text-green-300 text-sm transition-colors">We'll get back to you soon.</p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 rounded-r-xl transition-colors">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-red-800 dark:text-red-400 font-medium transition-colors">Failed to send message</p>
                        <p className="text-red-700 dark:text-red-300 text-sm transition-colors">Please try again or contact us directly.</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                        placeholder="+255 123 456 789"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="inquiryType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors">
                        Inquiry Type *
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        required
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Customer Support</option>
                        <option value="partnership">Business Partnership</option>
                        <option value="property">Property Related</option>
                      </select>
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 resize-none group-hover:border-gray-300 dark:group-hover:border-gray-500"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl md:hover:scale-[1.02] disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="md:animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'offices' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-8 shadow-lg transition-colors">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center sm:text-left transition-colors">Our Offices</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center sm:text-left transition-colors">Visit us at any of our locations across Tanzania</p>
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                  {offices.map((office, index) => (
                    <div key={index} className={`relative p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${office.isMain ? 'bg-red-500 text-white' : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-400'}`}>
                      {office.isMain && (
                        <div className="absolute -top-3 -right-3 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Main Office
                        </div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${office.isMain ? 'bg-white/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                          <svg className={`w-8 h-8 ${office.isMain ? 'text-white' : 'text-red-500 dark:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-xl mb-2 ${office.isMain ? 'text-white' : 'text-gray-900 dark:text-white'} transition-colors`}>
                            {office.city}
                          </h4>
                          <p className={`text-sm mb-4 ${office.isMain ? 'text-red-100' : 'text-gray-600 dark:text-gray-400'} transition-colors`}>
                            {office.country}
                          </p>
                          <div className={`space-y-3 ${office.isMain ? 'text-red-100' : 'text-gray-600 dark:text-gray-400'} transition-colors`}>
                            <p className="flex items-center">
                              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {office.address}
                            </p>
                            <p className="flex items-center">
                              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <a href={`tel:${office.phone}`} className="hover:underline">
                                {office.phone}
                              </a>
                            </p>
                            <p className="flex items-center">
                              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <a href={`mailto:${office.email}`} className="hover:underline">
                                {office.email}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-8 shadow-lg transition-colors">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center sm:text-left transition-colors">Business Hours</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center sm:text-left transition-colors">We're here to help you during these hours</p>
                
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 transition-colors">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Regular Hours</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-blue-200 dark:border-blue-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors">Monday - Friday</span>
                        <span className="text-gray-600 dark:text-gray-400 font-semibold transition-colors">8:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-blue-200 dark:border-blue-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors">Saturday</span>
                        <span className="text-gray-600 dark:text-gray-400 font-semibold transition-colors">9:00 AM - 2:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors">Sunday</span>
                        <span className="text-red-500 dark:text-red-400 font-semibold transition-colors">Closed</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 transition-colors">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Emergency Support</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-green-100 dark:bg-green-900/30 rounded-xl transition-colors">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-green-800 dark:text-green-400 transition-colors">24/7 Available</p>
                          <p className="text-sm text-green-700 dark:text-green-300 transition-colors">For urgent property issues</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl transition-colors">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-blue-800 dark:text-blue-400 transition-colors">Emergency Hotline</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors">+255 123 456 999</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-xl transition-colors">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-400 transition-colors">Holiday Hours</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 transition-colors">Our hours may vary during public holidays. Please check our website or call ahead.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-red-500 dark:bg-red-600 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-red-100 dark:text-red-200 text-lg mb-8 max-w-2xl mx-auto transition-colors">
            Join thousands of satisfied customers who have found their perfect properties with ndotoni.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/search"
              className="bg-white text-red-500 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors"
            >
              Browse Properties
            </Link>
            <Link 
              href="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-red-500 px-8 py-3 rounded-full font-medium transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
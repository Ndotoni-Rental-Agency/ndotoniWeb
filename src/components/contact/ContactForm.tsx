'use client';

import { useState } from 'react';
import { ContactFormData, SubmitStatus } from './types';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry', // Default subject
    message: '',
    inquiryType: 'general' // Default type
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

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
    setSubmitStatus('idle');
    
    try {
      await onSubmit(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      ref={ref}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg max-w-2xl mx-auto transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center transition-colors">
        {t('contact.form.title')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center transition-colors">
        {t('contact.form.subtitle')}
      </p>
      
      {submitStatus === 'success' && (
        <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 rounded-r-xl transition-colors">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-400 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-green-800 dark:text-green-400 font-medium transition-colors">{t('contact.form.messageSent')}</p>
              <p className="text-green-700 dark:text-green-300 text-sm transition-colors">{t('contact.form.messageSentDesc')}</p>
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
              <p className="text-red-800 dark:text-red-400 font-medium transition-colors">{t('contact.form.messageFailed')}</p>
              <p className="text-red-700 dark:text-red-300 text-sm transition-colors">{t('contact.form.messageFailedDesc')}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            {t('contact.form.fullName')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
            placeholder={t('contact.form.placeholders.name')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="group">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              {t('contact.form.emailAddress')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
              placeholder={t('contact.form.placeholders.email')}
            />
          </div>
          <div className="group">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              {t('contact.form.phoneNumber')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500"
              placeholder={t('contact.form.placeholders.phone')}
            />
          </div>
        </div>

        <div className="group">
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            {t('contact.form.message')} *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 resize-none group-hover:border-gray-300 dark:group-hover:border-gray-500"
            placeholder={t('contact.form.placeholders.message')}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black dark:from-emerald-700 dark:to-emerald-800 dark:hover:from-emerald-800 dark:hover:to-emerald-900 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('contact.form.sendingMessage')}
            </>
          ) : (
            <>
              {t('contact.form.sendMessage')}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}


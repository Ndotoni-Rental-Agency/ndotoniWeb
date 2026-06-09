'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useHousingRequestModal } from '@/hooks/useHousingRequestModal';
import { HousingRequestModal } from '@/components/housing/HousingRequestModal';
import { MessageCircle, Search } from 'lucide-react';

export function NeedHelpBanner() {
  const { language } = useLanguage();
  const { isOpen, openModal, closeModal, titleId } = useHousingRequestModal();

  return (
    <>
      <section className="py-12 sm:py-14">
        <div className="rounded-2xl bg-stone-50 dark:bg-gray-800/50 border border-stone-200/80 dark:border-gray-700 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-ink-900 dark:text-white mb-2">
                {language === 'sw'
                  ? 'Hupati unachotafuta?'
                  : "Can't find what you're looking for?"}
              </h3>
              <p className="text-ink-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg">
                {language === 'sw'
                  ? 'Tuambie mahitaji yako na timu yetu itakutafutia nyumba inayofaa. Au tuandikie moja kwa moja WhatsApp.'
                  : 'Tell us what you need and our team will find the right home for you. Or message us directly on WhatsApp.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 shadow-green-sm hover:shadow-green transition-all active:scale-[0.98]"
              >
                <Search size={16} strokeWidth={2.5} />
                {language === 'sw' ? 'Tuambie unahitaji nini' : 'Tell us what you need'}
              </button>
              <a
                href="https://wa.me/255790720329?text=Habari%2C%20natafuta%20nyumba%20Dar%20es%20salaam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-gray-700 text-ink-700 dark:text-gray-200 text-sm font-bold border border-stone-200 dark:border-gray-600 hover:border-brand-300 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all"
              >
                <MessageCircle size={16} strokeWidth={2.5} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <HousingRequestModal isOpen={isOpen} onClose={closeModal} titleId={titleId} />
    </>
  );
}

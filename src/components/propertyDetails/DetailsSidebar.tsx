'use client';

import design from '@/components/design/Brand.module.css';

import { MessageCircle, ShieldCheck, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';
import { generateWhatsAppUrl } from '@/lib/utils/whatsapp';
import { Property } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { submitContactInquiry } from '@/graphql/mutations';
import { featureFlags } from '@/config/features';
import { COMPANY_INFO } from '@/config/company';

type Props = {
  property: Property;
  formatPrice: (n: number, c?: string) => string;
  onContactAgent: () => void;
  isInitializingChat: boolean;
  region: string;
  district: string;
  ward?: string;
  street?: string;
};

// Generate a simple session ID for anonymous visitor tracking
function getSessionId(): string {
  const key = 'ndotoni_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export default function DetailsSidebar({
  property,
  formatPrice,
  onContactAgent,
  isInitializingChat,
}: Props) {
  const { t, language } = useLanguage();
  const sw = language === 'sw';
  const whatsappNumber =
    property.landlord?.whatsappNumber || property.agent?.whatsappNumber;
  const teamMessage = sw
    ? `Habari timu ya Ndotoni, naomba msaada kuhusu nyumba hii: ${property.title}`
    : `Hello Ndotoni team, I'd like help with this home: ${property.title}`;
  const teamChatUrl = `${COMPANY_INFO.social.whatsapp}?text=${encodeURIComponent(
    `${teamMessage}\nhttps://ndotoni.com/property/${property.propertyId}`,
  )}`;
  const { user, isAuthenticated } = useAuth();
  const [showLandlordNotice, setShowLandlordNotice] = useState(false);
  const handleWhatsAppContact = () => {
    const whatsappNumber =
      property?.landlord?.whatsappNumber || property?.agent?.whatsappNumber;
    if (whatsappNumber) {
      // Determine visitor identity
      const visitorName =
        isAuthenticated && user
          ? `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
            'Logged-in User'
          : `Anonymous (${getSessionId()})`;
      const visitorEmail =
        isAuthenticated && user?.email ? user.email : 'makoye2025@gmail.com';
      const visitorPhone =
        isAuthenticated && user?.phoneNumber ? user.phoneNumber : undefined;

      // Fire-and-forget tracking notification
      GraphQLClient.executePublic(submitContactInquiry, {
        input: {
          name: visitorName,
          email: visitorEmail,
          ...(visitorPhone && { phone: visitorPhone }),
          inquiryType: 'PROPERTY',
          subject: `WhatsApp contact: ${property.title}`,
          message: `A user clicked "Contact via WhatsApp" for property: ${property.title} (ID: ${property.propertyId})\nLandlord WhatsApp: ${whatsappNumber}\nVisitor: ${visitorName}${visitorPhone ? `\nPhone: ${visitorPhone}` : ''}\nReferrer: ${document.referrer || 'direct'}\n\nProperty URL: ${window.location.href}`,
        },
      }).catch(() => {
        /* silent — don't block redirect */
      });

      const whatsappUrl = generateWhatsAppUrl(
        whatsappNumber,
        property.title,
        property.propertyId,
        `${sw ? 'Habari! Nyumba hii bado ipo? Naweza kupanga kuitembelea? Mnahitaji kodi ya miezi mingapi mapema, na jumla ya gharama za kuhamia ni kiasi gani?' : 'Hello! Is this home still available? Can I arrange a viewing? How many months of rent are required in advance, and what is the total move-in cost?'}\n\n${window.location.origin}/property/${property.propertyId}`,
      );
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setShowLandlordNotice(false);
    }
  };

  return (
    <>
      <Dialog open={showLandlordNotice} onClose={() => setShowLandlordNotice(false)} className="fixed inset-0 z-[80]">
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
          <Dialog.Panel className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-gray-900 sm:p-8">
            <button type="button" onClick={() => setShowLandlordNotice(false)} aria-label={sw ? 'Funga' : 'Close'}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-ink-500 hover:bg-stone-100 dark:hover:bg-gray-800">
              <X size={20} />
            </button>
            <ShieldCheck className="mb-4 h-8 w-8 text-brand-700 dark:text-brand-300" aria-hidden="true" />
            <Dialog.Title className="pr-6 text-xl font-bold text-ink-900 dark:text-white">
              {sw ? 'Kabla ya kuzungumza na mwenye nyumba' : 'Before you contact the landlord'}
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-gray-300">
              {sw
                ? 'Jilinde dhidi ya utapeli. Ishirikishe timu ya Ndotoni kuhusu mazungumzo na makubaliano yenu. Kabla ya kulipa au kuamua kupanga, zungumza nasi tukusaidie kuthibitisha tangazo, mwenye nyumba na masharti ya kodi.'
                : 'Protect yourself from scams. Keep the Ndotoni team informed about your conversation and any agreements. Before paying or deciding to rent, talk to us for help checking the listing, landlord and rental terms.'}
            </Dialog.Description>
            <div className="mt-6 space-y-3">
              <a href={teamChatUrl} target="_blank" rel="noopener noreferrer" onClick={() => setShowLandlordNotice(false)}
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-brand-700 px-4 text-sm font-bold text-white hover:bg-brand-800">
                {sw ? 'Zungumza na Ndotoni kwanza' : 'Talk to Ndotoni first'}
              </a>
              <button type="button" onClick={handleWhatsAppContact}
                className="min-h-12 w-full rounded-full border border-stone-300 px-4 text-sm font-semibold text-ink-900 hover:bg-stone-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800">
                {sw ? 'Endelea kwa mwenye nyumba' : 'Continue to landlord'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <div className={`${design.contactPanel} space-y-5`}>
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
            {sw ? 'HATUA INAYOFUATA' : 'YOUR NEXT STEP'}
          </p>
          <h2 className="font-poster text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
            {sw ? 'Panga kutembelea' : 'Come see the home'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-gray-300">
            {sw
              ? 'Uliza kama bado ipo na panga muda wa kuiona.'
              : 'Ask about availability and arrange a time to view it.'}
          </p>
        </div>
        {property.updatedAt &&
          Number.isFinite(Date.parse(property.updatedAt)) && (
            <p className="text-xs text-ink-500 dark:text-gray-400">
              {sw ? 'Tangazo lilisasishwa: ' : 'Listing updated: '}
              <time dateTime={property.updatedAt}>
                {new Intl.DateTimeFormat(sw ? 'sw-TZ' : 'en-TZ', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'Africa/Dar_es_Salaam',
                }).format(new Date(property.updatedAt))}
              </time>
              {' · '}
              {sw
                ? 'Thibitisha kama bado ipo.'
                : 'Confirm current availability.'}
            </p>
          )}
        {/* Contact Actions */}
        <div className="space-y-3">
          <a href={teamChatUrl} target="_blank" rel="noopener noreferrer"
            className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-brand-700 px-5 text-base font-bold text-white transition-colors hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900">
            <MessageCircle size={21} aria-hidden="true" />
            {sw ? 'Uliza kuhusu nyumba hii' : 'Enquire about this property'}
            <span className="text-xs font-normal opacity-80">WhatsApp</span>
          </a>
          {whatsappNumber && (
            <button
              type="button"
              onClick={() => setShowLandlordNotice(true)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-stone-300 px-5 text-sm font-semibold text-ink-900 transition-colors hover:bg-stone-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
              title={t('propertyDetails.contactViaWhatsApp')}
            >
              <MessageCircle size={21} strokeWidth={2.25} aria-hidden="true" />
              {sw ? 'Mwenye nyumba · WhatsApp' : 'Landlord · WhatsApp'}
            </button>
          )}
          {featureFlags.enableInAppChat && (
            <button
              onClick={onContactAgent}
              disabled={isInitializingChat}
              className="min-h-12 w-full rounded-xl border-2 border-ink-900 bg-white font-bold text-ink-900 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              {isInitializingChat
                ? t('propertyDetails.startingChat')
                : sw ? 'Mtumie ujumbe ndani ya Ndotoni' : 'Message landlord in Ndotoni'}
            </button>
          )}
        </div>

        {/* Landlord / agent */}
        {(property.landlord || property.agent) && (
          <div className="flex items-center justify-between gap-3 border-t border-stone-200 pt-5 dark:border-gray-700">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">
                {(property.landlord || property.agent)?.firstName ||
                  (property.landlord
                    ? t('propertyDetails.propertyLandlord')
                    : t('propertyDetails.propertyAgent'))}
              </p>
              {(property.landlord || property.agent)?.firstName && (
                <p className="text-xs text-ink-500 dark:text-gray-400">
                  {property.landlord
                    ? t('propertyDetails.propertyLandlord')
                    : t('propertyDetails.propertyAgent')}
                </p>
              )}
            </div>
            {whatsappNumber && (
              <a
                href={`/agent/${whatsappNumber}`}
                className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-brand-800 hover:underline dark:text-brand-300"
              >
                {sw ? 'Nyumba zake zingine →' : 'More of their homes →'}
              </a>
            )}
          </div>
        )}

      </div>
      {teamChatUrl && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg lg:hidden dark:border-gray-700 dark:bg-gray-900/95">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            {property?.pricing && (
              <p className="min-w-0 shrink">
                <span className="block truncate text-lg font-extrabold tabular-nums leading-tight text-ink-900 dark:text-white">
                  {formatPrice(
                    property.pricing.monthlyRent,
                    property.pricing.currency,
                  )}
                </span>
                <span className="text-xs text-ink-500 dark:text-gray-400">
                  {t('propertyDetails.perMonth')}
                </span>
              </p>
            )}
            <a
              href={teamChatUrl} target="_blank" rel="noopener noreferrer"
              className="ml-auto flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-bold text-white hover:bg-brand-800"
            >
              <MessageCircle size={20} strokeWidth={2.25} aria-hidden="true" />
              {sw ? 'Uliza kuhusu nyumba hii' : 'Enquire about this property'}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

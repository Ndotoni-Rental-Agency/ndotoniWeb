'use client';

import { generateWhatsAppUrl } from '@/lib/utils/whatsapp';
import { Property } from '@/API';
import { toTitleCase } from '@/lib/utils/common';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { submitContactInquiry } from '@/graphql/mutations';
import { featureFlags } from '@/config/features';
import VerifiedPropertyBadge from '@/components/property/VerifiedPropertyBadge';
import { MapPin, ShieldCheck } from 'lucide-react';

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
  region,
  district,
  ward,
  street,
}: Props) {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const contact = property.landlord || property.agent;
  const whatsappNumber = property.landlord?.whatsappNumber || property.agent?.whatsappNumber;
  const pricing = property.pricing;

  const openWhatsApp = () => {
    if (!whatsappNumber) return;

    const visitorName = isAuthenticated && user
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Logged-in User'
      : `Anonymous (${getSessionId()})`;
    // Anonymous visitors have no email; the inquiry API requires one, so use a shared no-reply address.
    const visitorEmail = isAuthenticated && user?.email ? user.email : 'anonymous@ndotoni.com';
    const visitorPhone = isAuthenticated && user?.phoneNumber ? user.phoneNumber : undefined;

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
    }).catch(() => {/* silent — don't block redirect */});

    window.open(generateWhatsAppUrl(whatsappNumber, property.title, property.propertyId), '_blank');
  };

  const whatsAppIcon = (
    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  );

  const whatsAppButtonClass =
    'w-full min-h-12 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-base font-bold transition-colors inline-flex items-center justify-center gap-2 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2';

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-gray-700 space-y-5 lg:sticky lg:top-24">
        <div className="space-y-2">
          <h1 className="font-display text-2xl sm:text-[28px] tracking-tight text-ink-900 dark:text-white leading-tight text-balance">
            {property.title}
          </h1>
          <VerifiedPropertyBadge verified={property.verified} size="md" />
        </div>

        <div className="flex items-start gap-2 text-base text-ink-700 dark:text-gray-300">
          <MapPin className="w-5 h-5 text-brand-700 dark:text-brand-300 mt-0.5 flex-shrink-0" aria-hidden />
          <span>{toTitleCase([street, ward, district, region].filter(Boolean).join(', '))}</span>
        </div>

        {pricing && (
          <dl className="border-y border-stone-200 dark:border-gray-700 py-4 space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="sr-only">{t('listing.perMonth')}</dt>
              <dd className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 dark:text-white tabular-nums">
                {formatPrice(pricing.monthlyRent, pricing.currency)}
              </dd>
              <span className="text-base text-ink-600 dark:text-gray-400">{t('listing.perMonth')}</span>
            </div>
            {pricing.deposit != null && pricing.deposit > 0 && (
              <div className="flex justify-between gap-3 text-base">
                <dt className="text-ink-600 dark:text-gray-400">{t('listing.deposit')}</dt>
                <dd className="font-semibold text-ink-900 dark:text-white tabular-nums">{formatPrice(pricing.deposit, pricing.currency)}</dd>
              </div>
            )}
            {pricing.utilitiesIncluded != null && (
              <div className="flex justify-between gap-3 text-base">
                <dt className="text-ink-600 dark:text-gray-400">{t('listing.billsIncluded')}</dt>
                <dd className="font-semibold text-ink-900 dark:text-white">{pricing.utilitiesIncluded ? t('common.yes') : t('common.no')}</dd>
              </div>
            )}
            {pricing.serviceCharge != null && pricing.serviceCharge > 0 && (
              <div className="flex justify-between gap-3 text-base">
                <dt className="text-ink-600 dark:text-gray-400">{t('listing.serviceCharge')}</dt>
                <dd className="font-semibold text-ink-900 dark:text-white tabular-nums">{formatPrice(pricing.serviceCharge, pricing.currency)}</dd>
              </div>
            )}
          </dl>
        )}

        {contact && (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-base font-semibold text-ink-900 dark:text-white truncate">
                {toTitleCase(contact.firstName ?? '')}
              </div>
              <div className="text-sm text-ink-600 dark:text-gray-400">
                {property.landlord ? t('listing.landlord') : t('listing.agent')}
              </div>
            </div>
            {whatsappNumber && (
              <a
                href={`/agent/${whatsappNumber}`}
                className="inline-flex items-center min-h-11 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:underline underline-offset-4 text-right"
              >
                {t('listing.otherHomes').replace('{name}', toTitleCase(contact.firstName ?? ''))}
              </a>
            )}
          </div>
        )}

        {whatsappNumber && (
          <div className="space-y-1.5">
            <button onClick={openWhatsApp} className={whatsAppButtonClass}>
              {whatsAppIcon}
              {t('listing.askToView')}
            </button>
            <p className="text-center text-sm text-ink-600 dark:text-gray-400">{t('listing.askToViewHint')}</p>
          </div>
        )}

        {featureFlags.enableInAppChat && (
          <button
            onClick={onContactAgent}
            disabled={isInitializingChat}
            className="w-full min-h-11 text-sm font-semibold text-brand-700 dark:text-brand-300 underline underline-offset-4 disabled:opacity-60"
          >
            {isInitializingChat ? t('propertyDetails.startingChat') : t('listing.messageInApp')}
          </button>
        )}

        <section aria-labelledby="how-renting-works" className="rounded-xl bg-stone-50 dark:bg-gray-900/60 p-4 space-y-3">
          <h2 id="how-renting-works" className="text-base font-bold text-ink-900 dark:text-white">
            {t('listing.howTitle')}
          </h2>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-ink-700 dark:text-gray-300">
            <li>{t('listing.howStep1')}</li>
            <li>{t('listing.howStep2')}</li>
            <li>{t('listing.howStep3')}</li>
          </ol>
          <p className="flex items-start gap-2 text-sm font-semibold text-ink-900 dark:text-white">
            <ShieldCheck className="w-5 h-5 text-brand-700 dark:text-brand-300 flex-shrink-0" aria-hidden />
            {t('listing.neverPay')}
          </p>
        </section>
      </div>

      {/* Mobile: keep the one action within thumb reach */}
      {whatsappNumber && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-stone-200 dark:border-gray-700 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 max-w-xl mx-auto">
            {pricing && (
              <div className="min-w-0">
                <div className="text-base font-bold text-ink-900 dark:text-white tabular-nums truncate">
                  {formatPrice(pricing.monthlyRent, pricing.currency)}
                </div>
                <div className="text-xs text-ink-600 dark:text-gray-400">{t('listing.perMonth')}</div>
              </div>
            )}
            <button onClick={openWhatsApp} className={`${whatsAppButtonClass} flex-1`}>
              {whatsAppIcon}
              {t('listing.askToView')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

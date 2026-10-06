'use client';

import { MessageCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { generateWhatsAppUrl } from '@/lib/utils/whatsapp';
import { Property } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { checkAvailability, getBlockedDates } from '@/graphql/queries';
import { submitContactInquiry } from '@/graphql/mutations';
import CalendarDatePicker from '@/components/ui/CalendarDatePicker';
import { featureFlags } from '@/config/features';

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
  const { user, isAuthenticated } = useAuth();
  const [moveInDate, setMoveInDate] = useState('');
  const [leaseDuration, setLeaseDuration] = useState(12);
  const [isChecking, setIsChecking] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [isLoadingBlockedDates, setIsLoadingBlockedDates] = useState(true);
  const [showAvailabilityChecker, setShowAvailabilityChecker] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    available: boolean;
    message?: string;
    unavailableDates?: string[];
    moveOutDate?: string;
    suggestedMoveInDate?: string;
    suggestedMoveOutDate?: string;
  } | null>(null);

  // Fetch blocked dates when component mounts
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        setIsLoadingBlockedDates(true);
        const today = new Date();
        const threeYearsLater = new Date(today);
        threeYearsLater.setFullYear(today.getFullYear() + 3);

        const response = await GraphQLClient.execute<{
          getBlockedDates: {
            propertyId: string;
            blockedRanges: Array<{
              startDate: string;
              endDate: string;
              reason?: string;
            }>;
          };
        }>(getBlockedDates, {
          propertyId: property.propertyId,
          startDate: today.toISOString().split('T')[0],
          endDate: threeYearsLater.toISOString().split('T')[0],
        });

        if (response.getBlockedDates?.blockedRanges) {
          const newBlockedDates = new Set<string>();

          response.getBlockedDates.blockedRanges.forEach((range) => {
            const start = new Date(range.startDate);
            const end = new Date(range.endDate);

            for (
              let d = new Date(start);
              d <= end;
              d.setDate(d.getDate() + 1)
            ) {
              newBlockedDates.add(d.toISOString().split('T')[0]);
            }
          });

          setBlockedDates(newBlockedDates);
        }
      } catch (error) {
        console.error('Error fetching blocked dates:', error);
      } finally {
        setIsLoadingBlockedDates(false);
      }
    };

    fetchBlockedDates();
  }, [property.propertyId]);

  const handleCheckAvailability = async () => {
    if (!moveInDate) return;

    setIsChecking(true);
    setAvailabilityResult(null);

    try {
      // Calculate move-out date
      const moveIn = new Date(moveInDate);
      const moveOut = new Date(moveIn);
      moveOut.setMonth(moveOut.getMonth() + leaseDuration);
      const calculatedCheckOut = moveOut.toISOString().split('T')[0];

      const response = await GraphQLClient.execute<{
        checkAvailability: {
          available: boolean;
          unavailableDates: string[];
        };
      }>(checkAvailability, {
        propertyId: property.propertyId,
        checkInDate: moveInDate,
        checkOutDate: calculatedCheckOut,
      });

      if (response.checkAvailability.available) {
        setAvailabilityResult({
          available: true,
          moveOutDate: calculatedCheckOut,
          message: sw
            ? `Nyumba inapatikana kwa upangaji wa miezi ${leaseDuration}.`
            : `Property is available for a ${leaseDuration}-month lease!`,
        });
      } else {
        // Find the next available date after the blocked period
        const unavailableDates =
          response.checkAvailability.unavailableDates.sort();
        const lastBlockedDate = unavailableDates[unavailableDates.length - 1];
        const nextAvailable = new Date(lastBlockedDate);
        nextAvailable.setDate(nextAvailable.getDate() + 1);
        const nextAvailableStr = nextAvailable.toISOString().split('T')[0];

        // Calculate new move-out date from next available date
        const newMoveOut = new Date(nextAvailable);
        newMoveOut.setMonth(newMoveOut.getMonth() + leaseDuration);
        const newMoveOutStr = newMoveOut.toISOString().split('T')[0];

        setAvailabilityResult({
          available: false,
          unavailableDates: response.checkAvailability.unavailableDates,
          moveOutDate: calculatedCheckOut,
          message: sw
            ? `Nyumba haipatikani kuanzia ${moveInDate}. Jaribu kuhamia ${nextAvailableStr} kwa upangaji wa miezi ${leaseDuration}.`
            : `Property is not available from ${moveInDate}. Next available move-in date is ${nextAvailableStr} for a ${leaseDuration}-month lease.`,
          suggestedMoveInDate: nextAvailableStr,
          suggestedMoveOutDate: newMoveOutStr,
        });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityResult({
        available: false,
        message: sw
          ? 'Imeshindikana kuangalia upatikanaji. Jaribu tena.'
          : 'Failed to check availability. Please try again.',
      });
    } finally {
      setIsChecking(false);
    }
  };

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
      window.open(whatsappUrl, '_blank');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="space-y-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_24px_48px_-28px_rgba(17,24,39,0.35)] dark:border-gray-700 dark:bg-gray-800">
        {/* Price */}
        {property?.pricing && (
          <div>
            <p className="inline-flex -rotate-2 items-baseline gap-1.5 rounded-lg bg-sand-300 px-3.5 py-1.5 text-ink-900 shadow-[0_10px_20px_-10px_rgba(17,24,39,0.55)]">
              <span className="text-3xl font-extrabold tabular-nums tracking-tight">
                {formatPrice(
                  property.pricing.monthlyRent,
                  property.pricing.currency,
                )}
              </span>
              <span className="text-sm font-semibold">
                {t('properties.perMonthShort')}
              </span>
            </p>
            {((property.pricing.deposit ?? 0) > 0 ||
              (property.pricing.serviceCharge ?? 0) > 0) && (
              <dl className="mt-4 space-y-1 text-sm">
                {(property.pricing.deposit ?? 0) > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500 dark:text-gray-400">
                      {t('propertyDetails.securityDeposit')}
                    </dt>
                    <dd className="font-semibold tabular-nums text-ink-900 dark:text-white">
                      {formatPrice(
                        property.pricing.deposit!,
                        property.pricing.currency,
                      )}
                    </dd>
                  </div>
                )}
                {(property.pricing.serviceCharge ?? 0) > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500 dark:text-gray-400">
                      {t('propertyDetails.serviceCharge')}
                    </dt>
                    <dd className="font-semibold tabular-nums text-ink-900 dark:text-white">
                      {formatPrice(
                        property.pricing.serviceCharge!,
                        property.pricing.currency,
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        )}

        <div className="rounded-xl bg-stone-50 p-4 text-sm leading-relaxed text-ink-600 dark:bg-gray-900 dark:text-gray-300">
          {sw
            ? 'Kabla ya kuhamia: thibitisha miezi ya kodi ya kulipia mapema, amana, ada na kama nyumba bado ipo.'
            : 'Before moving in: confirm rent months payable in advance, deposit, fees and current availability.'}
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
          {whatsappNumber && (
            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-brand-500 px-5 text-base font-bold text-ink-900 transition-colors hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
              title={t('propertyDetails.contactViaWhatsApp')}
            >
              <MessageCircle size={21} strokeWidth={2.25} aria-hidden="true" />
              {sw ? 'Uliza WhatsApp' : 'Ask on WhatsApp'}
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
                : t('propertyDetails.contactAgent')}
            </button>
          )}
          {whatsappNumber && (
            <p className="text-center text-xs text-ink-500 dark:text-gray-400">
              {sw
                ? 'Uliza kama bado ipo na upange kuitembelea.'
                : 'Ask if it is still available and arrange a viewing.'}
            </p>
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

        {/* Availability Checker - Collapsible */}
        <div className="pt-5 border-t border-stone-200 dark:border-gray-700">
          <button
            onClick={() => setShowAvailabilityChecker(!showAvailabilityChecker)}
            className="flex min-h-11 w-full items-center justify-between text-left"
          >
            <h3 className="text-base font-bold text-ink-900 dark:text-white">
              {sw ? 'Angalia upatikanaji' : 'Check availability'}
            </h3>
            <svg
              className={`w-5 h-5 text-ink-500 dark:text-gray-400 transition-transform ${
                showAvailabilityChecker ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showAvailabilityChecker && (
            <div className="mt-4 space-y-4">
              {/* Move-in Date */}
              <div>
                <CalendarDatePicker
                  label={sw ? 'Tarehe ya kuhamia' : 'Move-in date'}
                  value={moveInDate}
                  onChange={setMoveInDate}
                  min={today}
                  placeholder={
                    sw ? 'Chagua tarehe ya kuhamia' : 'Select move-in date'
                  }
                  blockedDates={blockedDates}
                  disabled={isLoadingBlockedDates}
                />
                {isLoadingBlockedDates && (
                  <p className="mt-1 text-xs text-ink-500 dark:text-gray-400">
                    {sw ? 'Inapakia upatikanaji…' : 'Loading availability…'}
                  </p>
                )}
              </div>

              {/* Lease Duration */}
              <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-gray-300 mb-2">
                  {sw ? 'Muda wa upangaji' : 'Lease duration'}
                </label>
                <select
                  value={leaseDuration}
                  onChange={(e) => setLeaseDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-stone-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-ink-900 dark:text-white focus:ring-2 focus:ring-ink-900 focus:border-transparent transition dark:focus:ring-white"
                >
                  <option value={6}>{sw ? 'Miezi 6' : '6 months'}</option>
                  <option value={12}>{sw ? 'Miezi 12' : '12 months'}</option>
                  <option value={18}>{sw ? 'Miezi 18' : '18 months'}</option>
                  <option value={24}>{sw ? 'Miezi 24' : '24 months'}</option>
                  <option value={36}>{sw ? 'Miezi 36' : '36 months'}</option>
                </select>
                {moveInDate && availabilityResult?.moveOutDate && (
                  <p className="mt-2 text-sm text-ink-500 dark:text-gray-400">
                    {sw ? 'Tarehe ya kuondoka:' : 'Move-out:'}{' '}
                    {new Date(
                      availabilityResult.moveOutDate,
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Check Button */}
              <button
                onClick={handleCheckAvailability}
                disabled={isChecking || !moveInDate}
                className="min-h-12 w-full rounded-xl bg-ink-900 px-6 font-bold text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-ink-500 dark:bg-white dark:text-ink-900"
              >
                {isChecking
                  ? sw
                    ? 'Inaangalia…'
                    : 'Checking…'
                  : sw
                    ? 'Angalia upatikanaji'
                    : 'Check availability'}
              </button>

              {/* Result */}
              {availabilityResult && (
                <div
                  className={`p-4 rounded-lg ${
                    availabilityResult.available
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {availabilityResult.available ? (
                      <svg
                        className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          availabilityResult.available
                            ? 'text-green-800 dark:text-green-200'
                            : 'text-yellow-800 dark:text-yellow-200'
                        }`}
                      >
                        {availabilityResult.message}
                      </p>
                      {!availabilityResult.available &&
                        availabilityResult.suggestedMoveInDate && (
                          <button
                            onClick={() =>
                              setMoveInDate(
                                availabilityResult.suggestedMoveInDate!,
                              )
                            }
                            className="mt-3 text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 underline"
                          >
                            {sw ? 'Jaribu tarehe' : 'Try'}{' '}
                            {new Date(
                              availabilityResult.suggestedMoveInDate,
                            ).toLocaleDateString(sw ? 'sw-TZ' : 'en-TZ')}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {whatsappNumber && (
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
            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="ml-auto flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-bold text-ink-900 hover:bg-brand-400"
            >
              <MessageCircle size={20} strokeWidth={2.25} aria-hidden="true" />
              {sw ? 'Uliza WhatsApp' : 'Ask on WhatsApp'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

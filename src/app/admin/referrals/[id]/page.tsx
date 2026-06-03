'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_REFERRALS, type AdminReferral, type ReferralStatus } from '@/data/admin/referrals';
import { MOCK_TIMELINE_EVENTS } from '@/data/admin/referralTimeline';
import { MOCK_NOTES, type AdminNote } from '@/data/admin/referralNotes';
import { MOCK_REWARD_PAYMENTS } from '@/data/admin/rewardHistory';
import { ReferralStatusBadge, RewardStatusBadge } from '@/components/admin/referrals/ReferralStatusBadge';
import { cn } from '@/lib/utils/common';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  PlusIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-TZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-TZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  return `${d} days ago`;
}

// ────────────────────────────────────────────────────────────────────────────
// Section: Overview
// ────────────────────────────────────────────────────────────────────────────
function SectionOverview({ referral }: { referral: AdminReferral }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        {t('adminReferrals.detail.overview')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t('adminReferrals.detail.overviewId')}
          </p>
          <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
            {referral.id}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t('adminReferrals.detail.overviewSubmitted')}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(referral.submittedAt)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t('adminReferrals.detail.overviewUpdated')}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(referral.updatedAt)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t('adminReferrals.detail.overviewStatus')}
          </p>
          <ReferralStatusBadge
            status={referral.status}
            label={t(`adminReferrals.status.${referral.status}`)}
          />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t('adminReferrals.detail.overviewAssigned')}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {referral.assignedTo ?? (
              <span className="text-gray-400 dark:text-gray-500 italic">
                {t('adminReferrals.detail.overviewUnassigned')}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Section: Referrer
// ────────────────────────────────────────────────────────────────────────────
function SectionReferrer({ referral }: { referral: AdminReferral }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        {t('adminReferrals.detail.referrerSection')}
      </h2>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('adminReferrals.detail.referrerName')}</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{referral.referrerName}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <PhoneIcon className="w-4 h-4 flex-shrink-0" />
            <a href={`tel:${referral.referrerPhone}`} className="hover:text-[#00CD54] transition-colors">
              {referral.referrerPhone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Section: Landlord
// ────────────────────────────────────────────────────────────────────────────
function SectionLandlord({ referral }: { referral: AdminReferral }) {
  const { t } = useLanguage();

  const fields = [
    {
      icon: PhoneIcon,
      label: t('adminReferrals.detail.landlordPhone'),
      value: referral.landlordPhone,
      href: `tel:${referral.landlordPhone}`,
    },
    {
      icon: PhoneIcon,
      label: t('adminReferrals.detail.landlordWhatsApp'),
      value: referral.landlordWhatsApp || t('adminReferrals.detail.landlordNoWhatsApp'),
      href: referral.landlordWhatsApp ? `https://wa.me/${referral.landlordWhatsApp.replace(/\D/g, '')}` : undefined,
    },
    {
      icon: EnvelopeIcon,
      label: t('adminReferrals.detail.landlordEmail'),
      value: referral.landlordEmail || t('adminReferrals.detail.landlordNoEmail'),
      href: referral.landlordEmail ? `mailto:${referral.landlordEmail}` : undefined,
    },
    {
      icon: MapPinIcon,
      label: t('adminReferrals.detail.landlordArea'),
      value: referral.area,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        {t('adminReferrals.detail.landlordSection')}
      </h2>

      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t('adminReferrals.detail.landlordName')}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{referral.landlordName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex items-start gap-2.5">
            <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-[#00CD54] transition-colors break-all"
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 break-all">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {t('adminReferrals.detail.landlordNotes')}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {referral.notes || (
            <span className="italic text-gray-400 dark:text-gray-500">
              {t('adminReferrals.detail.landlordNoNotes')}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Section: Timeline
// ────────────────────────────────────────────────────────────────────────────
function SectionTimeline({ referralId }: { referralId: string }) {
  const { t } = useLanguage();
  const events = MOCK_TIMELINE_EVENTS.filter((e) => e.referralId === referralId);

  const iconByType: Record<string, React.ElementType> = {
    SUBMITTED: ClockIcon,
    ASSIGNED: UserIcon,
    STATUS_CHANGED: ArrowRightIcon,
    CONTACT_ATTEMPTED: PhoneIcon,
    CONTACT_SUCCESS: CheckCircleIcon,
    NOTE_ADDED: PencilSquareIcon,
    REWARD_PAID: CurrencyDollarIcon,
  };

  const colorByType: Record<string, string> = {
    SUBMITTED: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
    ASSIGNED: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    STATUS_CHANGED: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    CONTACT_ATTEMPTED: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    CONTACT_SUCCESS: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    NOTE_ADDED: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    REWARD_PAID: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  };

  return (
    <div id="timeline" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        {t('adminReferrals.detail.timelineSection')}
      </h2>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
          {t('adminReferrals.detail.timelineEmpty')}
        </p>
      ) : (
        <ol className="relative">
          {events.map((event, idx) => {
            const Icon = iconByType[event.type] ?? ClockIcon;
            const isLast = idx === events.length - 1;
            return (
              <li key={event.id} className="flex gap-3 pb-5 last:pb-0 relative">
                {/* Vertical connector */}
                {!isLast && (
                  <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                )}

                {/* Icon */}
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10', colorByType[event.type] ?? 'bg-gray-100')}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
                      {t(`adminReferrals.timeline.${event.titleKey}`)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
                      {formatDateTime(event.timestamp)}
                    </p>
                  </div>
                  {event.detail && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {event.detail}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1">
                    {event.actor}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Section: Admin Notes
// ────────────────────────────────────────────────────────────────────────────
function SectionNotes({ referralId }: { referralId: string }) {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<AdminNote[]>(
    MOCK_NOTES.filter((n) => n.referralId === referralId),
  );
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 600));
    const note: AdminNote = {
      id: `NOTE-NEW-${Date.now()}`,
      referralId,
      author: 'Admin',
      authorInitials: 'AD',
      authorColor: 'bg-gray-600',
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, note]);
    setNewNote('');
    setIsAdding(false);
  };

  const handleEdit = (note: AdminNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = async () => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingId
          ? { ...n, content: editContent, updatedAt: new Date().toISOString(), isEdited: true }
          : n,
      ),
    );
    setEditingId(null);
  };

  return (
    <div id="notes" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        {t('adminReferrals.detail.notesSection')}
      </h2>

      {/* Existing notes */}
      <div className="space-y-3">
        {notes.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            {t('adminReferrals.detail.notesEmpty')}
          </p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="flex gap-3">
            <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold', note.authorColor)}>
              {note.authorInitials}
            </div>
            <div className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {note.author}
                  </span>
                  {note.isEdited && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">(edited)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    {timeAgo(note.updatedAt ?? note.createdAt)}
                  </span>
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline underline-offset-2 transition-colors"
                  >
                    {t('adminReferrals.detail.notesEditButton')}
                  </button>
                </div>
              </div>

              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00CD54]/40 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity"
                    >
                      {t('adminReferrals.detail.notesSaveButton')}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {t('adminReferrals.detail.notesCancelButton')}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{note.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add note */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-2">
        <textarea
          rows={2}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={t('adminReferrals.detail.notesAddPlaceholder')}
          className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00CD54]/40 focus:border-[#00CD54]/60 resize-none transition-all"
        />
        <button
          onClick={handleAdd}
          disabled={!newNote.trim() || isAdding}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {isAdding ? (
            <>{t('adminReferrals.detail.notesAddingButton')}</>
          ) : (
            <>
              <PlusIcon className="w-3.5 h-3.5" />
              {t('adminReferrals.detail.notesAddButton')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Section: Status Management
// ────────────────────────────────────────────────────────────────────────────
const STATUS_ORDER: ReferralStatus[] = [
  'SUBMITTED',
  'IN_PROGRESS',
  'PROPERTY_LISTED',
  'PROPERTY_RENTED',
];

function SectionStatusManagement({
  referral,
  onStatusChange,
}: {
  referral: AdminReferral;
  onStatusChange: (s: ReferralStatus) => void;
}) {
  const { t } = useLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const currentIdx = STATUS_ORDER.indexOf(referral.status);
  const nextStatus = STATUS_ORDER[currentIdx + 1] as ReferralStatus | undefined;

  const handleUpdate = async (status: ReferralStatus) => {
    setIsUpdating(true);
    await new Promise((r) => setTimeout(r, 800));
    onStatusChange(status);
    setIsUpdating(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  return (
    <div id="status" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        {t('adminReferrals.detail.statusSection')}
      </h2>

      {/* Progress track */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
        {STATUS_ORDER.map((s, idx) => {
          const done = STATUS_ORDER.indexOf(referral.status) >= idx;
          const current = referral.status === s;
          return (
            <div key={s} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                    current
                      ? 'bg-[#00CD54] text-white ring-2 ring-[#00CD54]/30'
                      : done
                      ? 'bg-[#00CD54]/20 text-[#00CD54]'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400',
                  )}
                >
                  {done && !current ? '✓' : idx + 1}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium text-center max-w-[60px] leading-tight',
                    current
                      ? 'text-[#00CD54]'
                      : done
                      ? 'text-gray-600 dark:text-gray-400'
                      : 'text-gray-400 dark:text-gray-500',
                  )}
                >
                  {t(`adminReferrals.status.${s}`)}
                </span>
              </div>
              {idx < STATUS_ORDER.length - 1 && (
                <div
                  className={cn(
                    'w-6 sm:w-8 h-px flex-shrink-0 mt-[-12px]',
                    STATUS_ORDER.indexOf(referral.status) > idx
                      ? 'bg-[#00CD54]'
                      : 'bg-gray-200 dark:bg-gray-700',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Action button */}
      {nextStatus && (
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => handleUpdate(nextStatus)}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {isUpdating ? (
              t('adminReferrals.detail.statusUpdating')
            ) : (
              <>
                {t('adminReferrals.detail.statusNext')}: {t(`adminReferrals.status.${nextStatus}`)}
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
          {successMsg && (
            <span className="text-xs text-[#00CD54] font-medium flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" />
              {t('adminReferrals.detail.statusUpdateSuccess')}
            </span>
          )}
        </div>
      )}

      {!nextStatus && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
          <CheckCircleIcon className="w-4 h-4" />
          {t(`adminReferrals.status.${referral.status}`)} — final stage
        </p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Section: Reward Tracking
// ────────────────────────────────────────────────────────────────────────────
function SectionRewards({ referral }: { referral: AdminReferral }) {
  const { t } = useLanguage();
  const payments = MOCK_REWARD_PAYMENTS.filter((p) => p.referralId === referral.id);

  const [listingStatus, setListingStatus] = useState(referral.listingRewardStatus);
  const [profitStatus, setProfitStatus] = useState(referral.profitShareRewardStatus);
  const [markingListing, setMarkingListing] = useState(false);
  const [markingProfit, setMarkingProfit] = useState(false);

  const handleMarkPaid = async (type: 'listing' | 'profit') => {
    if (type === 'listing') {
      setMarkingListing(true);
      await new Promise((r) => setTimeout(r, 800));
      setListingStatus('PAID');
      setMarkingListing(false);
    } else {
      setMarkingProfit(true);
      await new Promise((r) => setTimeout(r, 800));
      setProfitStatus('PAID');
      setMarkingProfit(false);
    }
  };

  const rewardCards = [
    {
      icon: BuildingOfficeIcon,
      label: t('adminReferrals.detail.listingRewardLabel'),
      amount: t('adminReferrals.detail.listingRewardAmount'),
      status: listingStatus,
      canMark: listingStatus === 'ELIGIBLE',
      isMarking: markingListing,
      onMark: () => handleMarkPaid('listing'),
      paidAt: referral.listingRewardPaidAt,
    },
    {
      icon: ArrowTrendingUpIcon,
      label: t('adminReferrals.detail.profitShareLabel'),
      amount: t('adminReferrals.detail.profitShareAmount'),
      status: profitStatus,
      canMark: profitStatus === 'ELIGIBLE',
      isMarking: markingProfit,
      onMark: () => handleMarkPaid('profit'),
      paidAt: referral.profitShareRewardPaidAt,
    },
  ];

  return (
    <div id="rewards" className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        {t('adminReferrals.detail.rewardSection')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rewardCards.map(({ icon: Icon, label, amount, status, canMark, isMarking, onMark, paidAt }) => (
          <div
            key={label}
            className={cn(
              'rounded-xl border p-4 space-y-3',
              status === 'PAID'
                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon className={cn('w-4 h-4', status === 'PAID' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400')} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</span>
              </div>
              <RewardStatusBadge
                status={status}
                label={t(`adminReferrals.rewardStatus.${status}`)}
                size="sm"
              />
            </div>

            <p className={cn('text-lg font-bold', status === 'PAID' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white')}>
              {amount}
            </p>

            {paidAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('adminReferrals.detail.rewardPaidAt')} {formatDate(paidAt)}
              </p>
            )}

            {canMark && (
              <button
                onClick={onMark}
                disabled={isMarking}
                className="w-full py-1.5 text-xs font-semibold rounded-lg bg-[#00CD54] text-white hover:bg-[#00b048] disabled:opacity-50 transition-colors"
              >
                {isMarking ? t('adminReferrals.detail.rewardMarkingPaid') : t('adminReferrals.detail.rewardMarkPaid')}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment history */}
      {payments.length > 0 && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Payment History
          </p>
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 text-xs py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {p.rewardType === 'LISTING_REWARD' ? t('adminReferrals.detail.listingRewardLabel') : t('adminReferrals.detail.profitShareLabel')}
                </span>
                <span className="text-gray-400 dark:text-gray-500 ml-2">
                  {t('adminReferrals.detail.rewardPaidBy')} {p.paidBy}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  TZS {p.amountTZS.toLocaleString()}
                </p>
                <p className="text-gray-400 dark:text-gray-500">{formatDate(p.paidAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────
export default function AdminReferralDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [referral, setReferral] = useState<AdminReferral | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const found = MOCK_REFERRALS.find((r) => r.id === id) ?? null;
    setTimeout(() => {
      setReferral(found);
      setIsLoading(false);
    }, 400);
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Back link skeleton */}
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {[120, 140, 200, 280, 160].map((h, i) => (
              <div key={i} className={`h-${h > 200 ? 48 : h > 150 ? 36 : 28} rounded-xl bg-gray-100 dark:bg-gray-700/60 animate-pulse`} style={{ height: h }} />
            ))}
          </div>
          <div className="space-y-4">
            {[160, 200, 140].map((h, i) => (
              <div key={i} className="rounded-xl bg-gray-100 dark:bg-gray-700/60 animate-pulse" style={{ height: h }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Referral not found</p>
        <Link
          href="/admin/referrals"
          className="mt-3 inline-block text-sm text-[#00CD54] hover:underline underline-offset-2"
        >
          {t('adminReferrals.detail.backToList')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link
        href="/admin/referrals"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        {t('adminReferrals.detail.backToList')}
      </Link>

      {/* Page title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('adminReferrals.detail.pageTitle')} — {referral.id}
          </h1>
        </div>
        <ReferralStatusBadge
          status={referral.status}
          label={t(`adminReferrals.status.${referral.status}`)}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-4">
          <SectionOverview referral={referral} />
          <SectionStatusManagement
            referral={referral}
            onStatusChange={(s) => setReferral((prev) => prev ? { ...prev, status: s } : prev)}
          />
          <SectionTimeline referralId={referral.id} />
          <SectionNotes referralId={referral.id} />
        </div>

        {/* Right column — sidebar info */}
        <div className="space-y-4">
          <SectionReferrer referral={referral} />
          <SectionLandlord referral={referral} />
          <SectionRewards referral={referral} />
        </div>
      </div>
    </div>
  );
}

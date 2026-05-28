'use client';

import { useCallback, useEffect, useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { listHousingRequests, getSuggestedLandlords } from '@/graphql/queries';
import { updateHousingRequestStatus } from '@/graphql/mutations';
import {
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

type HousingRequestStatus = 'OPEN' | 'MATCHED' | 'FULFILLED' | 'EXPIRED' | 'CANCELLED';

interface HousingRequest {
  requestId: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  contactName?: string;
  region?: string;
  district?: string;
  ward?: string;
  street?: string;
  minBudget?: number;
  maxBudget?: number;
  currency: string;
  bedrooms?: number;
  propertyType?: string;
  moveInDate?: string;
  description: string;
  status: HousingRequestStatus;
  source: string;
  adminNotes?: string;
  matchedLandlords?: string[];
}

interface SuggestedLandlord {
  landlord: {
    userId: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    operatingDistricts: string[];
    propertyTypes: string[];
    propertyCount: number;
    minPrice?: number;
    maxPrice?: number;
  };
  matchReasons: string[];
}

const STATUS_COLORS: Record<HousingRequestStatus, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  MATCHED: 'bg-yellow-100 text-yellow-800',
  FULFILLED: 'bg-green-100 text-green-800',
  EXPIRED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-800',
};

const SOURCE_LABELS: Record<string, string> = {
  WHATSAPP: '💬 WhatsApp',
  WEB: '🌐 Web',
  ADMIN: '🛡️ Admin',
};

function formatBudget(min?: number, max?: number, currency = 'TZS') {
  if (!min && !max) return '—';
  const fmt = (n: number) => currency === 'USD' ? `$${n.toLocaleString()}` : `TZS ${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (max) return `Up to ${fmt(max)}`;
  return `From ${fmt(min!)}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function HousingRequestsPage() {
  const [requests, setRequests] = useState<HousingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<HousingRequestStatus | ''>('');
  const [selectedRequest, setSelectedRequest] = useState<HousingRequest | null>(null);
  const [suggestedLandlords, setSuggestedLandlords] = useState<SuggestedLandlord[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GraphQLClient.executeAuthenticated<{ listHousingRequests: { requests: HousingRequest[] } }>(
        listHousingRequests,
        { status: statusFilter || undefined, limit: 100 }
      );
      setRequests(data.listHousingRequests.requests);
    } catch (error) {
      console.error('Failed to load housing requests', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const handleSelectRequest = async (req: HousingRequest) => {
    setSelectedRequest(req);
    setNotesDraft(req.adminNotes || '');
    setSuggestedLandlords([]);
    setLoadingSuggestions(true);
    try {
      const data = await GraphQLClient.executeAuthenticated<{ getSuggestedLandlords: SuggestedLandlord[] }>(
        getSuggestedLandlords,
        { requestId: req.requestId, createdAt: req.createdAt }
      );
      setSuggestedLandlords(data.getSuggestedLandlords);
    } catch (error) {
      console.error('Failed to load suggestions', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleStatusUpdate = async (req: HousingRequest, newStatus: HousingRequestStatus) => {
    try {
      await GraphQLClient.executeAuthenticated(
        updateHousingRequestStatus,
        { requestId: req.requestId, createdAt: req.createdAt, status: newStatus }
      );
      await loadRequests();
      if (selectedRequest?.requestId === req.requestId) {
        setSelectedRequest({ ...req, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    setSavingNotes(true);
    try {
      await GraphQLClient.executeAuthenticated(
        updateHousingRequestStatus,
        { requestId: selectedRequest.requestId, createdAt: selectedRequest.createdAt, status: selectedRequest.status, adminNotes: notesDraft }
      );
      setSelectedRequest({ ...selectedRequest, adminNotes: notesDraft });
    } catch (error) {
      console.error('Failed to save notes', error);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* List Panel */}
      <div className="w-full lg:w-[420px] border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-2 flex-wrap">
          {(['', 'OPEN', 'MATCHED', 'FULFILLED', 'EXPIRED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {/* Request List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No requests found</div>
          ) : (
            requests.map((req) => (
              <button
                key={req.requestId}
                onClick={() => handleSelectRequest(req)}
                className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                  selectedRequest?.requestId === req.requestId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {req.contactName || req.phone}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[req.status]}`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1">{req.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span>{SOURCE_LABELS[req.source] || req.source}</span>
                  <span>{timeAgo(req.createdAt)}</span>
                  {req.district && <span>📍 {req.district}</span>}
                  {req.maxBudget && <span>💰 {req.currency === 'USD' ? `$${req.maxBudget.toLocaleString()}` : `${(req.maxBudget / 1000).toFixed(0)}K`}</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className={`${selectedRequest ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 lg:relative lg:inset-auto lg:z-auto' : 'hidden lg:flex'} flex-1 flex-col overflow-y-auto`}>
        {!selectedRequest ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a request to view details</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="lg:hidden text-sm text-blue-600 mb-2 flex items-center gap-1"
                >
                  ← Back
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedRequest.contactName || selectedRequest.phone}
                </h2>
                <p className="text-sm text-gray-500">{selectedRequest.phone} · {SOURCE_LABELS[selectedRequest.source]}</p>
              </div>
              <div className="flex gap-2">
                {selectedRequest.status === 'OPEN' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedRequest, 'MATCHED')}
                    className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-medium hover:bg-yellow-200"
                  >
                    Mark Matched
                  </button>
                )}
                {(selectedRequest.status === 'OPEN' || selectedRequest.status === 'MATCHED') && (
                  <button
                    onClick={() => handleStatusUpdate(selectedRequest, 'FULFILLED')}
                    className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs font-medium hover:bg-green-200"
                  >
                    Mark Fulfilled
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedRequest.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <DetailCard icon={MapPinIcon} label="Location" value={[selectedRequest.district, selectedRequest.region].filter(Boolean).join(', ') || '—'} />
              <DetailCard icon={CurrencyDollarIcon} label="Budget" value={formatBudget(selectedRequest.minBudget, selectedRequest.maxBudget, selectedRequest.currency)} />
              <DetailCard icon={HomeIcon} label="Bedrooms" value={selectedRequest.bedrooms ? `${selectedRequest.bedrooms} rooms` : '—'} />
              <DetailCard icon={CalendarIcon} label="Move-in" value={selectedRequest.moveInDate || '—'} />
              {selectedRequest.propertyType && (
                <DetailCard icon={HomeIcon} label="Type" value={selectedRequest.propertyType} />
              )}
              <DetailCard icon={PhoneIcon} label="Phone" value={selectedRequest.phone} />
            </div>

            {/* Admin Notes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Admin Notes</h3>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Add notes about this request (landlords contacted, progress, etc.)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes || notesDraft === (selectedRequest.adminNotes || '')}
                className="mt-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>

            {/* Suggested Landlords */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Suggested Landlords</h3>
              {loadingSuggestions ? (
                <p className="text-sm text-gray-400">Loading suggestions...</p>
              ) : suggestedLandlords.length === 0 ? (
                <p className="text-sm text-gray-400">No matching landlords found</p>
              ) : (
                <div className="space-y-3">
                  {suggestedLandlords.map((s) => (
                    <div key={s.landlord.userId} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {s.landlord.firstName} {s.landlord.lastName}
                        </span>
                        <span className="text-xs text-gray-400">{s.landlord.propertyCount} properties</span>
                      </div>
                      {s.landlord.whatsappNumber && (
                        <a
                          href={`https://wa.me/${s.landlord.whatsappNumber.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-600 hover:underline"
                        >
                          📞 {s.landlord.whatsappNumber}
                        </a>
                      )}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {s.matchReasons.map((reason, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px]">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

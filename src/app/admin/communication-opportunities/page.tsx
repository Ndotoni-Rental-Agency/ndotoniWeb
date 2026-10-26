'use client';

import { useCallback, useEffect, useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import {
  listCommunicationOpportunities,
  approveCommunicationOpportunity,
  dismissCommunicationOpportunity,
  sendCommunicationOpportunity,
} from '@/graphql/communication';

export const dynamic = 'force-dynamic';

type OpportunityStatus =
  | 'detected'
  | 'approved'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'dismissed'
  | 'expired';

interface CommunicationOpportunity {
  opportunityId: string;
  opportunityType: string;
  status: OpportunityStatus;
  bookingId?: string;
  propertyTitle?: string;
  checkInDate?: string;
  suggestedMessage: string;
  editedMessage?: string;
  deliveryOutcomes?: { channel: string; status: string; detail?: string }[];
  detectedAt: string;
  expiresAt: string;
  lastError?: string;
}

const STATUS_COLORS: Record<OpportunityStatus, string> = {
  detected: 'bg-blue-100 text-blue-800',
  approved: 'bg-indigo-100 text-indigo-800',
  sending: 'bg-yellow-100 text-yellow-800',
  sent: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  dismissed: 'bg-gray-100 text-gray-600',
  expired: 'bg-gray-100 text-gray-500',
};

type OpportunityTypeFilter = 'MISSING_CHECKIN_GUEST' | 'POST_STAY_REVIEW_REQUEST';

const TYPE_LABELS: Record<OpportunityTypeFilter, string> = {
  MISSING_CHECKIN_GUEST: 'Missing check-in (guest)',
  POST_STAY_REVIEW_REQUEST: 'Post-stay review request',
};

export default function CommunicationOpportunitiesPage() {
  const [opportunityType, setOpportunityType] =
    useState<OpportunityTypeFilter>('MISSING_CHECKIN_GUEST');
  const [items, setItems] = useState<CommunicationOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CommunicationOpportunity | null>(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listNextToken, setListNextToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async (append = false, token?: string | null) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const client = GraphQLClient.getInstance();
      const data = await client.request<{
        listCommunicationOpportunities: {
          opportunities: CommunicationOpportunity[];
          nextToken?: string | null;
        };
      }>(listCommunicationOpportunities, {
        opportunityType,
        limit: 50,
        nextToken: token ?? undefined,
      });
      const fetched = data.listCommunicationOpportunities.opportunities ?? [];
      setItems((prev) => (append ? [...prev, ...fetched] : fetched));
      setListNextToken(data.listCommunicationOpportunities.nextToken ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load opportunities');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [opportunityType]);

  useEffect(() => {
    setSelected(null);
    load(false);
  }, [load, opportunityType]);

  useEffect(() => {
    if (selected) {
      setMessageDraft(selected.editedMessage ?? selected.suggestedMessage);
    }
  }, [selected]);

  const refreshSelected = (updated: CommunicationOpportunity) => {
    setItems((prev) => prev.map((o) => (o.opportunityId === updated.opportunityId ? { ...o, ...updated } : o)));
    setSelected((prev) => (prev?.opportunityId === updated.opportunityId ? { ...prev, ...updated } : prev));
  };

  const handleApprove = async () => {
    if (!selected) return;
    setActionLoading(true);
    setError(null);
    try {
      const client = GraphQLClient.getInstance();
      const data = await client.request<{ approveCommunicationOpportunity: CommunicationOpportunity }>(
        approveCommunicationOpportunity,
        {
          opportunityId: selected.opportunityId,
          editedMessage: messageDraft !== selected.suggestedMessage ? messageDraft : undefined,
        }
      );
      refreshSelected(data.approveCommunicationOpportunity);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Approve failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSend = async () => {
    if (!selected) return;
    setActionLoading(true);
    setError(null);
    try {
      const client = GraphQLClient.getInstance();
      const data = await client.request<{ sendCommunicationOpportunity: CommunicationOpportunity }>(
        sendCommunicationOpportunity,
        { opportunityId: selected.opportunityId }
      );
      refreshSelected(data.sendCommunicationOpportunity);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Send failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async () => {
    if (!selected) return;
    setActionLoading(true);
    setError(null);
    try {
      const client = GraphQLClient.getInstance();
      const data = await client.request<{ dismissCommunicationOpportunity: CommunicationOpportunity }>(
        dismissCommunicationOpportunity,
        { opportunityId: selected.opportunityId }
      );
      refreshSelected(data.dismissCommunicationOpportunity);
      setSelected(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Dismiss failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Communication opportunities</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Human-in-the-loop proactive messages: check-in instructions or post-stay review invites.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {(Object.keys(TYPE_LABELS) as OpportunityTypeFilter[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOpportunityType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                opportunityType === type
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 text-red-800 px-4 py-3 text-sm">{error}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="font-medium">Review queue</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => load(false)}
                className="text-sm text-teal-700 hover:underline"
              >
                Refresh
              </button>
              {listNextToken && (
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={() => load(true, listNextToken)}
                  className="text-sm text-teal-700 hover:underline disabled:opacity-50"
                >
                  {loadingMore ? 'Loading…' : 'Load more detected'}
                </button>
              )}
            </div>
          </div>
          {loading ? (
            <p className="p-4 text-sm text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No detected opportunities.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[32rem] overflow-y-auto">
              {items.map((item) => (
                <li key={item.opportunityId}>
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      selected?.opportunityId === item.opportunityId ? 'bg-teal-50 dark:bg-teal-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">{item.propertyTitle ?? item.bookingId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Check-in {item.checkInDate} · {new Date(item.detectedAt).toLocaleString()}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          {!selected ? (
            <p className="text-sm text-gray-500">Select an opportunity to review the suggested message.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="font-medium">{selected.propertyTitle}</h2>
                <p className="text-xs text-gray-500">Booking {selected.bookingId}</p>
              </div>
              <textarea
                className="w-full h-64 text-sm font-mono border rounded-md p-3 dark:bg-gray-900 dark:border-gray-600"
                value={messageDraft}
                onChange={(e) => setMessageDraft(e.target.value)}
                disabled={selected.status !== 'detected' && selected.status !== 'approved' && selected.status !== 'failed'}
              />
              {selected.deliveryOutcomes && selected.deliveryOutcomes.length > 0 && (
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-medium">Delivery</p>
                  {selected.deliveryOutcomes.map((o, i) => (
                    <p key={i}>
                      {o.channel}: {o.status}
                      {o.detail ? ` (${o.detail})` : ''}
                    </p>
                  ))}
                </div>
              )}
              {selected.lastError && (
                <p className="text-sm text-red-600">Last error: {selected.lastError}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {(selected.status === 'detected' || selected.status === 'failed') && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleApprove}
                    className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                {selected.status === 'approved' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleSend}
                    className="px-3 py-2 text-sm rounded-md bg-teal-600 text-white disabled:opacity-50"
                  >
                    Send to guest
                  </button>
                )}
                {selected.status === 'failed' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleSend}
                    className="px-3 py-2 text-sm rounded-md bg-teal-600 text-white disabled:opacity-50"
                  >
                    Retry send
                  </button>
                )}
                {['detected', 'approved', 'failed'].includes(selected.status) && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleDismiss}
                    className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

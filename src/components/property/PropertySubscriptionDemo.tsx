'use client';

import { useState } from 'react';
import { usePropertySubscription } from '@/hooks/usePropertySubscription';
import type { PropertyUpdateEvent } from '@/API';

interface PropertySubscriptionDemoProps {
  propertyId: string;
}

/**
 * Demo component showing real-time property subscription
 * 
 * This component demonstrates:
 * - Connection state tracking
 * - Real-time update notifications
 * - Event history
 * - Error handling
 */
export function PropertySubscriptionDemo({ propertyId }: PropertySubscriptionDemoProps) {
  const [events, setEvents] = useState<PropertyUpdateEvent[]>([]);
  const [enabled, setEnabled] = useState(true);

  const { isConnected, error } = usePropertySubscription({
    propertyId,
    enabled,
    onUpdate: (event) => {
      console.log('📡 Update received:', event);
      setEvents(prev => [event, ...prev].slice(0, 10)); // Keep last 10 events
    },
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Live Updates
        </h3>
        
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            enabled
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {/* Connection Status */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-emerald-500' : 'bg-gray-400'
          }`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        {error && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        )}
      </div>

      {/* Event History */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Recent Updates ({events.length})
        </h4>
        
        {events.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            No updates yet. Waiting for changes...
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {events.map((event, index) => (
              <div
                key={`${event.propertyId}-${event.timestamp}-${index}`}
                className="bg-gray-50 dark:bg-gray-700 rounded p-3 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {event.eventType}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {event.changes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {event.changes.map((change, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-600 dark:text-gray-400"
                      >
                        <span className="font-mono">{change.field}</span>
                        {': '}
                        <span className="line-through">{JSON.stringify(change.oldValue)}</span>
                        {' → '}
                        <span className="font-semibold">{JSON.stringify(change.newValue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertySubscriptionDemo;

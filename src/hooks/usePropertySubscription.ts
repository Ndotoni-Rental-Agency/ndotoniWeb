import { useEffect, useRef, useState, useCallback } from 'react';
import { PropertySubscriptionManager } from '@/lib/subscriptions/PropertySubscriptionManager';
import type { PropertyUpdateEvent } from '@/API';

interface UsePropertySubscriptionOptions {
  propertyId: string;
  onUpdate?: (event: PropertyUpdateEvent) => void;
  enabled?: boolean;
}

/**
 * Hook to subscribe to real-time property updates
 * 
 * Uses the PropertySubscriptionManager for efficient subscription management.
 * Multiple components can subscribe to the same property without creating
 * duplicate subscriptions.
 * 
 * @param options - Configuration options
 * @param options.propertyId - The ID of the property to subscribe to
 * @param options.onUpdate - Callback function called when property is updated
 * @param options.enabled - Whether the subscription is active (default: true)
 * 
 * @example
 * ```tsx
 * const { isConnected, error } = usePropertySubscription({
 *   propertyId: 'property-123',
 *   onUpdate: (event) => {
 *     console.log('Property updated:', event);
 *     // Update local state with new property data
 *   }
 * });
 * ```
 */
export function usePropertySubscription({
  propertyId,
  onUpdate,
  enabled = true,
}: UsePropertySubscriptionOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const managerRef = useRef<PropertySubscriptionManager | null>(null);

  const handleUpdate = useCallback((event: PropertyUpdateEvent) => {
    console.log('📡 Property update received:', {
      propertyId: event.propertyId,
      eventType: event.eventType,
      changes: event.changes,
      timestamp: event.timestamp,
    });

    if (onUpdate) {
      onUpdate(event);
    }
  }, [onUpdate]);

  useEffect(() => {
    if (!enabled || !propertyId) {
      return;
    }

    // Get manager instance
    if (!managerRef.current) {
      managerRef.current = PropertySubscriptionManager.getInstance();
    }

    const manager = managerRef.current;

    // Subscribe to property updates
    const unsubscribe = manager.subscribe(propertyId, {
      onUpdate: handleUpdate,
      onError: (err) => {
        console.error('❌ Property subscription error:', err);
        setIsConnected(false);
        setError(err.message || 'Subscription error');
      },
      onConnect: () => {
        console.log('✅ Property subscription connected');
        setIsConnected(true);
        setError(null);
      },
      onDisconnect: () => {
        console.log('🔌 Property subscription disconnected');
        setIsConnected(false);
      },
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, [propertyId, enabled, handleUpdate]);

  return {
    isConnected,
    error,
  };
}

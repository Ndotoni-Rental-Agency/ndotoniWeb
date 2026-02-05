import { GraphQLClient } from '@/lib/graphql-client';
import { onPropertyUpdated } from '@/graphql/subscriptions';
import type { PropertyUpdateEvent } from '@/API';

type SubscriptionCallback = (event: PropertyUpdateEvent) => void;
type ErrorCallback = (error: Error) => void;

interface SubscriptionOptions {
  onUpdate: SubscriptionCallback;
  onError?: ErrorCallback;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

/**
 * Manages GraphQL subscriptions for property updates
 * 
 * Features:
 * - Automatic reconnection on connection loss
 * - Multiple subscribers per property
 * - Efficient resource management (single subscription per property)
 * - Connection state tracking
 * 
 * @example
 * ```typescript
 * const manager = PropertySubscriptionManager.getInstance();
 * 
 * const unsubscribe = manager.subscribe('property-123', {
 *   onUpdate: (event) => console.log('Property updated:', event),
 *   onError: (error) => console.error('Subscription error:', error),
 * });
 * 
 * // Later, cleanup
 * unsubscribe();
 * ```
 */
export class PropertySubscriptionManager {
  private static instance: PropertySubscriptionManager;
  private subscriptions: Map<string, {
    subscription: any;
    callbacks: Set<SubscriptionCallback>;
    errorCallbacks: Set<ErrorCallback>;
    connectCallbacks: Set<() => void>;
    disconnectCallbacks: Set<() => void>;
    isConnected: boolean;
  }> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): PropertySubscriptionManager {
    if (!PropertySubscriptionManager.instance) {
      PropertySubscriptionManager.instance = new PropertySubscriptionManager();
    }
    return PropertySubscriptionManager.instance;
  }

  /**
   * Subscribe to property updates
   * 
   * @param propertyId - The property ID to subscribe to
   * @param options - Subscription callbacks
   * @returns Unsubscribe function
   */
  subscribe(propertyId: string, options: SubscriptionOptions): () => void {
    const { onUpdate, onError, onConnect, onDisconnect } = options;

    // Get or create subscription for this property
    let subData = this.subscriptions.get(propertyId);

    if (!subData) {
      // Create new subscription
      subData = {
        subscription: null,
        callbacks: new Set(),
        errorCallbacks: new Set(),
        connectCallbacks: new Set(),
        disconnectCallbacks: new Set(),
        isConnected: false,
      };
      this.subscriptions.set(propertyId, subData);
      this.setupSubscription(propertyId);
    }

    // Add callbacks
    subData.callbacks.add(onUpdate);
    if (onError) subData.errorCallbacks.add(onError);
    if (onConnect) subData.connectCallbacks.add(onConnect);
    if (onDisconnect) subData.disconnectCallbacks.add(onDisconnect);

    // If already connected, call onConnect immediately
    if (subData.isConnected && onConnect) {
      onConnect();
    }

    // Return unsubscribe function
    return () => {
      this.unsubscribe(propertyId, onUpdate, onError, onConnect, onDisconnect);
    };
  }

  /**
   * Unsubscribe from property updates
   */
  private unsubscribe(
    propertyId: string,
    onUpdate: SubscriptionCallback,
    onError?: ErrorCallback,
    onConnect?: () => void,
    onDisconnect?: () => void
  ): void {
    const subData = this.subscriptions.get(propertyId);
    if (!subData) return;

    // Remove callbacks
    subData.callbacks.delete(onUpdate);
    if (onError) subData.errorCallbacks.delete(onError);
    if (onConnect) subData.connectCallbacks.delete(onConnect);
    if (onDisconnect) subData.disconnectCallbacks.delete(onDisconnect);

    // If no more callbacks, cleanup subscription
    if (subData.callbacks.size === 0) {
      this.cleanupSubscription(propertyId);
    }
  }

  /**
   * Setup GraphQL subscription for a property
   */
  private async setupSubscription(propertyId: string): Promise<void> {
    const subData = this.subscriptions.get(propertyId);
    if (!subData) return;

    try {
      console.log('🔌 Setting up subscription for property:', propertyId);
      console.log('🔌 Using auth mode: apiKey');
      console.log('🔌 Subscription query:', onPropertyUpdated);

      const client = GraphQLClient.getRawClient();

      const subscription = client.graphql({
        query: onPropertyUpdated,
        variables: { propertyId },
        authMode: 'apiKey',
      }).subscribe({
        next: ({ data }: any) => {
          console.log('📡 Raw subscription data received:', data);
          
          const event = data.onPropertyUpdated as PropertyUpdateEvent;
          if (!event) {
            console.warn('⚠️ No event data in subscription response');
            return;
          }

          console.log('📡 Property update received:', {
            propertyId: event.propertyId,
            eventType: event.eventType,
            timestamp: event.timestamp,
            changes: event.changes,
          });

          // Mark as connected
          if (!subData.isConnected) {
            subData.isConnected = true;
            console.log('✅ Subscription marked as connected');
            subData.connectCallbacks.forEach(cb => cb());
          }

          // Notify all subscribers
          subData.callbacks.forEach(callback => {
            try {
              callback(event);
            } catch (error) {
              console.error('Error in subscription callback:', error);
            }
          });
        },
        error: (error: any) => {
          console.error('❌ Subscription error for property:', propertyId, error);
          console.error('❌ Error details:', JSON.stringify(error, null, 2));

          // Mark as disconnected
          if (subData.isConnected) {
            subData.isConnected = false;
            subData.disconnectCallbacks.forEach(cb => cb());
          }

          // Notify error callbacks
          const errorObj = error instanceof Error ? error : new Error(error.message || 'Subscription error');
          subData.errorCallbacks.forEach(callback => {
            try {
              callback(errorObj);
            } catch (err) {
              console.error('Error in error callback:', err);
            }
          });

          // Attempt reconnection after delay
          setTimeout(() => {
            if (this.subscriptions.has(propertyId)) {
              console.log('🔄 Attempting to reconnect subscription for:', propertyId);
              this.cleanupSubscription(propertyId, false);
              this.setupSubscription(propertyId);
            }
          }, 5000);
        },
        complete: () => {
          console.log('🏁 Subscription completed for property:', propertyId);
        },
      });

      subData.subscription = subscription;
      console.log('✅ Subscription established for property:', propertyId);

    } catch (error) {
      console.error('❌ Failed to setup subscription:', error);
      console.error('❌ Setup error details:', JSON.stringify(error, null, 2));
      
      const errorObj = error instanceof Error ? error : new Error('Failed to setup subscription');
      subData.errorCallbacks.forEach(callback => {
        try {
          callback(errorObj);
        } catch (err) {
          console.error('Error in error callback:', err);
        }
      });
    }
  }

  /**
   * Cleanup subscription for a property
   */
  private cleanupSubscription(propertyId: string, removeFromMap = true): void {
    const subData = this.subscriptions.get(propertyId);
    if (!subData) return;

    console.log('🔌 Cleaning up subscription for property:', propertyId);

    // Unsubscribe from GraphQL
    if (subData.subscription) {
      try {
        subData.subscription.unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
      subData.subscription = null;
    }

    // Notify disconnect callbacks
    if (subData.isConnected) {
      subData.disconnectCallbacks.forEach(cb => {
        try {
          cb();
        } catch (error) {
          console.error('Error in disconnect callback:', error);
        }
      });
    }

    // Remove from map
    if (removeFromMap) {
      this.subscriptions.delete(propertyId);
    }
  }

  /**
   * Check if a property has an active subscription
   */
  isSubscribed(propertyId: string): boolean {
    return this.subscriptions.has(propertyId);
  }

  /**
   * Check if a property subscription is connected
   */
  isConnected(propertyId: string): boolean {
    const subData = this.subscriptions.get(propertyId);
    return subData?.isConnected ?? false;
  }

  /**
   * Get number of active subscriptions
   */
  getActiveSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  /**
   * Cleanup all subscriptions (useful for app cleanup)
   */
  cleanupAll(): void {
    console.log('🔌 Cleaning up all subscriptions');
    this.subscriptions.forEach((_, propertyId) => {
      this.cleanupSubscription(propertyId);
    });
    this.subscriptions.clear();
  }
}

export default PropertySubscriptionManager;

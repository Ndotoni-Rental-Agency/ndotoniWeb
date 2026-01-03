import { useEffect, useRef, useState } from 'react';
import { SubscriptionManager, PropertyUpdateEvent, Property } from '../lib/subscriptions/SubscriptionManager';

export interface UsePropertySubscriptionsOptions {
  onPropertyUpdate?: (update: PropertyUpdateEvent) => void;
  onNewProperty?: (property: Property) => void;
  onError?: (error: any) => void;
}

export function usePropertySubscriptions(options: UsePropertySubscriptionsOptions = {}) {
  const subscriptionManagerRef = useRef<SubscriptionManager | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    activeSubscriptions: 0,
    subscribedProperties: 0,
  });

  // Initialize subscription manager
  useEffect(() => {
    if (!subscriptionManagerRef.current) {
      const manager = new SubscriptionManager();
      
      // Set up event handlers
      manager.onPropertyUpdate = (update: PropertyUpdateEvent) => {
        console.log('🔄 Property update received:', update);
        if (options.onPropertyUpdate) {
          options.onPropertyUpdate(update);
        }
      };

      manager.onError = (error: any) => {
        console.error('❌ Subscription error:', error);
        setIsConnected(false);
        if (options.onError) {
          options.onError(error);
        }
      };

      subscriptionManagerRef.current = manager;
      setIsConnected(true);
    }

    return () => {
      if (subscriptionManagerRef.current) {
        subscriptionManagerRef.current = null;
        setIsConnected(false);
      }
    };
  }, []);

  const subscribeToProperty = async (propertyId: string) => {
    if (subscriptionManagerRef.current) {
      try {
        const result = await subscriptionManagerRef.current.subscribeToProperty(propertyId);
        console.log(`✅ Successfully subscribed to property: ${propertyId}`, result);
        
        // Update subscription status with actual counts
        const status = subscriptionManagerRef.current.getSubscriptionStatus();
        setSubscriptionStatus(status);
      } catch (error) {
        console.error(`❌ Failed to subscribe to property ${propertyId}:`, error);
        if (options.onError) {
          options.onError(error);
        }
      }
    }
  };

  const cleanup = () => {
    if (subscriptionManagerRef.current) {
      setIsConnected(false);
      setSubscriptionStatus({
        activeSubscriptions: 0,
        subscribedProperties: 0,
      });
    }
  };

  return {
    isConnected,
    subscriptionStatus,
    subscribeToProperty,
    cleanup
  };
}
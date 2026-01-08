import { generateClient } from 'aws-amplify/api';
import { 
  onPropertiesUpdated,
  onPropertyUpdated,
} from '../../graphql/subscriptions';
import { Property as GraphQLProperty } from 'nest-ql-schema/dist/generated/types';
import type { GraphQLSubscription } from 'aws-amplify/api';

const client = generateClient();

// Use the GraphQL generated Property type to avoid type conflicts
export type Property = GraphQLProperty;

export interface PropertySearchInput {
  region?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
}

export interface PropertyUpdateEvent {
  propertyId: string;
  eventType: string;
  property?: Property;
  changes?: Array<{
    field: string;
    oldValue?: string;
    newValue: string;
  }>;
  timestamp: string;
}

export class SubscriptionManager {
  private activeSubscriptions = new Map<string, any>();
  private subscribedProperties = new Set<string>();
  
  // Event handlers
  public onPropertyUpdate?: (update: PropertyUpdateEvent) => void;
  public onError?: (error: any) => void;

  // Get subscription status
  public getSubscriptionStatus() {
    return {
      activeSubscriptions: this.activeSubscriptions.size,
      subscribedProperties: this.subscribedProperties.size,
    };
  }

  /**
   * Subscribe to updates for specific properties
   */
  private async subscribeToPropertyUpdates(propertyIds: string[]) {
    const newIds = propertyIds.filter(id => !this.subscribedProperties.has(id));
    if (newIds.length === 0) return;

    try {
      const subscription = client.graphql({
        query: onPropertiesUpdated,
        variables: { propertyIds: newIds }
      }) as GraphQLSubscription<any>;
      
      const sub = subscription.subscribe({
        next: (event: any) => {
          const update = event.data?.onPropertiesUpdated;
          if (update && this.onPropertyUpdate) {
            console.log('📡 Received property update event:', update);
            this.onPropertyUpdate(update);
          }
        },
        error: (err: any) => {
          console.error('Property update subscription error:', JSON.stringify(err, null, 2));
          if (this.onError) {
            this.onError(err);
          }
        }
      });

      this.activeSubscriptions.set(`updates-${Date.now()}`, sub);
      newIds.forEach(id => this.subscribedProperties.add(id));
      console.log(`✅ Successfully subscribed to property updates for ${newIds.length} properties:`, newIds);
    } catch (error) {
      console.error('Failed to subscribe to property updates:', JSON.stringify(error, null, 2));
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  /**
   * Subscribe to a single property (for property detail pages)
   */
  async subscribeToProperty(propertyId: string) {
    const subscriptionKey = `single-${propertyId}`;
    
    // Don't duplicate subscription
    if (this.activeSubscriptions.has(subscriptionKey)) {
      return true; // Return true to indicate subscription exists
    }

    try {
      const subscription = client.graphql({
        query: onPropertyUpdated,
        variables: { propertyId }
      }) as GraphQLSubscription<any>;
      
      const sub = subscription.subscribe({
        next: (event: any) => {
          console.log('🎯 SUBSCRIPTION EVENT RECEIVED!');
          console.log('📡 Raw subscription event received:', JSON.stringify(event, null, 2));
          console.log('📡 Event keys:', Object.keys(event || {}));
          console.log('📡 Event.data keys:', Object.keys(event?.data || {}));
          
          const update = event.data?.onPropertyUpdated;
          if (update) {
            console.log('✅ Found property update data:', update);
            if (this.onPropertyUpdate) {
              console.log('✅ Calling onPropertyUpdate handler');
              this.onPropertyUpdate(update);
            } else {
              console.log('❌ No onPropertyUpdate handler set');
            }
          } else {
            console.log('❌ No update data found in event');
            console.log('📡 Available data:', event.data);
          }
        },
        error: (err: any) => {
          console.error('❌ SUBSCRIPTION ERROR:', JSON.stringify(err, null, 2));
          if (this.onError) {
            this.onError(err);
          }
        },
        complete: () => {
          console.log('🔚 Subscription completed/closed');
        }
      });

      this.activeSubscriptions.set(subscriptionKey, sub);
      console.log(`✅ Successfully subscribed to single property updates for property: ${propertyId}`);
      return true; // Return true to indicate successful subscription
    } catch (error) {
      console.error('Failed to subscribe to single property:', JSON.stringify(error, null, 2));
      if (this.onError) {
        this.onError(error);
      }
      return false; // Return false to indicate failed subscription
    }
  }
}
// Utility function to apply property changes
export function applyPropertyChanges(property: Property, changes: Array<{ field: string; newValue: string }>): Property {
  const updated = { ...property };
  
  changes.forEach(change => {
    const fieldPath = change.field.split('.');
    let target: any = updated;
    
    // Navigate to the nested field
    for (let i = 0; i < fieldPath.length - 1; i++) {
      if (!target[fieldPath[i]]) {
        target[fieldPath[i]] = {};
      }
      target = target[fieldPath[i]];
    }
    
    // Set the new value
    const finalField = fieldPath[fieldPath.length - 1];
    const newValue = change.newValue;
    
    // Try to parse numbers and booleans
    if (newValue === 'true') {
      target[finalField] = true;
    } else if (newValue === 'false') {
      target[finalField] = false;
    } else if (!isNaN(Number(newValue)) && newValue !== '') {
      target[finalField] = Number(newValue);
    } else {
      target[finalField] = newValue;
    }
  });
  
  return updated;
}
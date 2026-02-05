import { GraphQLClient } from '@/lib/graphql-client';
import { onNewMessage } from '@/graphql/subscriptions';
import type { ChatMessage } from '@/API';

type MessageCallback = (message: ChatMessage) => void;
type ErrorCallback = (error: Error) => void;

interface SubscriptionOptions {
  onMessage: MessageCallback;
  onError?: ErrorCallback;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

/**
 * Manages GraphQL subscriptions for chat messages
 * 
 * Features:
 * - Automatic reconnection on connection loss
 * - Multiple subscribers per conversation
 * - Efficient resource management (single subscription per conversation)
 * - Connection state tracking
 * 
 * @example
 * ```typescript
 * const manager = ChatSubscriptionManager.getInstance();
 * 
 * const unsubscribe = manager.subscribe('conversation-123', {
 *   onMessage: (message) => console.log('New message:', message),
 *   onError: (error) => console.error('Subscription error:', error),
 * });
 * 
 * // Later, cleanup
 * unsubscribe();
 * ```
 */
export class ChatSubscriptionManager {
  private static instance: ChatSubscriptionManager;
  private subscriptions: Map<string, {
    subscription: any;
    callbacks: Set<MessageCallback>;
    errorCallbacks: Set<ErrorCallback>;
    connectCallbacks: Set<() => void>;
    disconnectCallbacks: Set<() => void>;
    isConnected: boolean;
  }> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ChatSubscriptionManager {
    if (!ChatSubscriptionManager.instance) {
      ChatSubscriptionManager.instance = new ChatSubscriptionManager();
    }
    return ChatSubscriptionManager.instance;
  }

  /**
   * Subscribe to conversation messages
   * 
   * @param conversationId - The conversation ID to subscribe to
   * @param options - Subscription callbacks
   * @returns Unsubscribe function
   */
  subscribe(conversationId: string, options: SubscriptionOptions): () => void {
    const { onMessage, onError, onConnect, onDisconnect } = options;

    // Get or create subscription for this conversation
    let subData = this.subscriptions.get(conversationId);

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
      this.subscriptions.set(conversationId, subData);
      this.setupSubscription(conversationId);
    }

    // Add callbacks
    subData.callbacks.add(onMessage);
    if (onError) subData.errorCallbacks.add(onError);
    if (onConnect) subData.connectCallbacks.add(onConnect);
    if (onDisconnect) subData.disconnectCallbacks.add(onDisconnect);

    // If already connected, call onConnect immediately
    if (subData.isConnected && onConnect) {
      onConnect();
    }

    // Return unsubscribe function
    return () => {
      this.unsubscribe(conversationId, onMessage, onError, onConnect, onDisconnect);
    };
  }

  /**
   * Unsubscribe from conversation messages
   */
  private unsubscribe(
    conversationId: string,
    onMessage: MessageCallback,
    onError?: ErrorCallback,
    onConnect?: () => void,
    onDisconnect?: () => void
  ): void {
    const subData = this.subscriptions.get(conversationId);
    if (!subData) return;

    // Remove callbacks
    subData.callbacks.delete(onMessage);
    if (onError) subData.errorCallbacks.delete(onError);
    if (onConnect) subData.connectCallbacks.delete(onConnect);
    if (onDisconnect) subData.disconnectCallbacks.delete(onDisconnect);

    // If no more callbacks, cleanup subscription
    if (subData.callbacks.size === 0) {
      this.cleanupSubscription(conversationId);
    }
  }

  /**
   * Setup GraphQL subscription for a conversation
   */
  private async setupSubscription(conversationId: string): Promise<void> {
    const subData = this.subscriptions.get(conversationId);
    if (!subData) return;

    try {
      console.log('💬 Setting up chat subscription for conversation:', conversationId);

      const client = GraphQLClient.getRawClient();

      const subscription = client.graphql({
        query: onNewMessage,
        variables: { conversationId },
        authMode: 'userPool',
      }).subscribe({
        next: ({ data }: any) => {
          console.log('💬 Raw chat message received:', data);
          
          const message = data.onNewMessage as ChatMessage;
          if (!message) {
            console.warn('⚠️ No message data in subscription response');
            return;
          }

          console.log('💬 New message received:', {
            id: message.id,
            conversationId: message.conversationId,
            senderName: message.senderName,
            timestamp: message.timestamp,
          });

          // Mark as connected
          if (!subData.isConnected) {
            subData.isConnected = true;
            console.log('✅ Chat subscription marked as connected');
            subData.connectCallbacks.forEach(cb => cb());
          }

          // Notify all subscribers
          subData.callbacks.forEach(callback => {
            try {
              callback(message);
            } catch (error) {
              console.error('Error in chat subscription callback:', error);
            }
          });
        },
        error: (error: any) => {
          console.error('❌ Chat subscription error for conversation:', conversationId, error);

          // Mark as disconnected
          if (subData.isConnected) {
            subData.isConnected = false;
            subData.disconnectCallbacks.forEach(cb => cb());
          }

          // Notify error callbacks
          const errorObj = error instanceof Error ? error : new Error(error.message || 'Chat subscription error');
          subData.errorCallbacks.forEach(callback => {
            try {
              callback(errorObj);
            } catch (err) {
              console.error('Error in error callback:', err);
            }
          });

          // Attempt reconnection after delay
          setTimeout(() => {
            if (this.subscriptions.has(conversationId)) {
              console.log('🔄 Attempting to reconnect chat subscription for:', conversationId);
              this.cleanupSubscription(conversationId, false);
              this.setupSubscription(conversationId);
            }
          }, 5000);
        },
        complete: () => {
          console.log('🏁 Chat subscription completed for conversation:', conversationId);
        },
      });

      subData.subscription = subscription;
      console.log('✅ Chat subscription established for conversation:', conversationId);

    } catch (error) {
      console.error('❌ Failed to setup chat subscription:', error);
      
      const errorObj = error instanceof Error ? error : new Error('Failed to setup chat subscription');
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
   * Cleanup subscription for a conversation
   */
  private cleanupSubscription(conversationId: string, removeFromMap = true): void {
    const subData = this.subscriptions.get(conversationId);
    if (!subData) return;

    console.log('💬 Cleaning up chat subscription for conversation:', conversationId);

    // Unsubscribe from GraphQL
    if (subData.subscription) {
      try {
        subData.subscription.unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing from chat:', error);
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
      this.subscriptions.delete(conversationId);
    }
  }

  /**
   * Check if a conversation has an active subscription
   */
  isSubscribed(conversationId: string): boolean {
    return this.subscriptions.has(conversationId);
  }

  /**
   * Check if a conversation subscription is connected
   */
  isConnected(conversationId: string): boolean {
    const subData = this.subscriptions.get(conversationId);
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
    console.log('💬 Cleaning up all chat subscriptions');
    this.subscriptions.forEach((_, conversationId) => {
      this.cleanupSubscription(conversationId);
    });
    this.subscriptions.clear();
  }
}

export default ChatSubscriptionManager;

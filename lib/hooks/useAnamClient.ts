'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@anam-ai/js-sdk';
import { AnamConnectionStatus } from '@/lib/types/anam';

export function useAnamClient() {
  const [status, setStatus] = useState<AnamConnectionStatus>(
    AnamConnectionStatus.DISCONNECTED
  );
  const [error, setError] = useState<string | null>(null);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const clientRef = useRef<any>(null);

  const initializeClient = useCallback(async () => {
    try {
      setStatus(AnamConnectionStatus.CONNECTING);
      setError(null);

      // Fetch session token from API (includes persona config)
      const response = await fetch('/api/anam-session', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch session token');
      }

      const { sessionToken } = await response.json();

      // Create Anam client (persona config is embedded in token)
      const client = createClient(sessionToken);

      // Store client reference
      clientRef.current = client;

      // Set up event listeners
      client.addListener('CONNECTION_ESTABLISHED', () => {
        console.log('✅ Connected to Sofia');
        setStatus(AnamConnectionStatus.CONNECTED);
      });

      client.addListener('CONNECTION_CLOSED', () => {
        console.log('❌ Connection closed');
        setStatus(AnamConnectionStatus.DISCONNECTED);
      });

      client.addListener('MESSAGE_HISTORY_UPDATED', (messages: any[]) => {
        console.log('📝 Message history updated:', messages);
        setMessageHistory(messages);
      });

      return client;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Failed to initialize Anam client:', errorMessage);
      setError(errorMessage);
      setStatus(AnamConnectionStatus.ERROR);
      throw err;
    }
  }, []);

  const streamToVideo = useCallback(
    async (videoElementId: string) => {
      if (!clientRef.current) {
        const client = await initializeClient();
        await client.streamToVideoElement(videoElementId);
      } else {
        await clientRef.current.streamToVideoElement(videoElementId);
      }
    },
    [initializeClient]
  );

  const stopStreaming = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.stopStreaming();
      setStatus(AnamConnectionStatus.DISCONNECTED);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.stopStreaming();
      }
    };
  }, []);

  return {
    client: clientRef.current,
    status,
    error,
    messageHistory,
    initializeClient,
    streamToVideo,
    stopStreaming,
  };
}

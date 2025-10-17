'use client';

import { useEffect, useRef, useState } from 'react';
import { useAnamClient } from '@/lib/hooks/useAnamClient';
import { AnamConnectionStatus } from '@/lib/types/anam';

export default function SofiaVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { status, error, streamToVideo, stopStreaming, messageHistory, client } = useAnamClient();

  const VIDEO_ELEMENT_ID = 'sofia-video';

  const handleStartSession = async () => {
    if (videoRef.current && !isInitialized) {
      try {
        await streamToVideo(VIDEO_ELEMENT_ID);
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to start session:', err);
      }
    }
  };

  const handleEndSession = () => {
    stopStreaming();
    setIsInitialized(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (!client) {
      console.error('Anam client not available');
      return;
    }

    try {
      if (isMuted) {
        // Currently muted, so unmute
        const state = client.unmuteInputAudio();
        console.log('Unmuted microphone. New state:', state);
        setIsMuted(false);
      } else {
        // Currently unmuted, so mute
        const state = client.muteInputAudio();
        console.log('Muted microphone. New state:', state);
        setIsMuted(true);
      }
    } catch (err) {
      console.error('Failed to toggle mute:', err);
    }
  };

  // Auto-start on mount (optional)
  useEffect(() => {
    // Uncomment to auto-start:
    // handleStartSession();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      {/* Video Container */}
      <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          id={VIDEO_ELEMENT_ID}
          autoPlay
          playsInline
          muted={false}
          className="w-full h-full object-cover"
        />

        {/* Status and Controls Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <StatusBadge status={status} />
          {isInitialized && (
            <button
              onClick={toggleMute}
              className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-black/70 transition-all"
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-8">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-md">
              <h3 className="text-red-500 font-semibold mb-2">Connection Error</h3>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Not Connected Overlay */}
        {!isInitialized && !error && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">Sofia - B2B Research Specialist</h3>
              <p className="text-white/70 text-sm">Click "Start Session" to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isInitialized ? (
          <button
            onClick={handleStartSession}
            disabled={status === AnamConnectionStatus.CONNECTING}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {status === AnamConnectionStatus.CONNECTING ? 'Connecting...' : 'Start Session'}
          </button>
        ) : (
          <button
            onClick={handleEndSession}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            End Session
          </button>
        )}
      </div>

      {/* Message History (Optional Debug View) */}
      {messageHistory.length > 0 && (
        <div className="w-full max-h-64 overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-sm text-gray-700 dark:text-gray-300">
            Conversation History
          </h4>
          <div className="space-y-2">
            {messageHistory.map((msg: any, idx: number) => (
              <div
                key={idx}
                className="text-xs p-2 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <span className="font-semibold">{msg.role}:</span> {msg.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: AnamConnectionStatus }) {
  const statusConfig = {
    [AnamConnectionStatus.DISCONNECTED]: {
      label: 'Disconnected',
      color: 'bg-gray-500',
      icon: '⚪',
    },
    [AnamConnectionStatus.CONNECTING]: {
      label: 'Connecting',
      color: 'bg-yellow-500',
      icon: '🟡',
    },
    [AnamConnectionStatus.CONNECTED]: {
      label: 'Connected',
      color: 'bg-green-500',
      icon: '🟢',
    },
    [AnamConnectionStatus.ERROR]: {
      label: 'Error',
      color: 'bg-red-500',
      icon: '🔴',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
      <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
      <span className="text-white text-sm font-medium">{config.label}</span>
    </div>
  );
}

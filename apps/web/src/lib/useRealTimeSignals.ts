'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export interface LiveSignal {
  type:           string;
  reference_code: string;
  grade:          string;
  company:        string;
  economy:        string;
  capex_m:        number;
  sci_score:      number;
  sector:         string;
  timestamp:      string;
  provenance?: {
    source:   string;
    hash:     string;
    verified: boolean;
    tier:     string;
  };
}

const WS_URL = (process.env.NEXT_PUBLIC_API_URL || '')
  .replace('https://', 'wss://')
  .replace('http://', 'ws://') + '/ws';

export function useRealTimeSignals(maxSignals = 20) {
  const [signals,    setSignals]    = useState<LiveSignal[]>([]);
  const [connected,  setConnected]  = useState(false);
  const [totalSeen,  setTotalSeen]  = useState(0);
  const wsRef  = useRef<WebSocket | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen  = () => { setConnected(true); };
      ws.onclose = () => {
        setConnected(false);
        retryRef.current = setTimeout(connect, 5000);
      };
      ws.onerror = () => { ws.close(); };
      ws.onmessage = (evt) => {
        try {
          const msg: LiveSignal = JSON.parse(evt.data);
          if (msg.type === 'signal') {
            setSignals(prev => [msg, ...prev].slice(0, maxSignals));
            setTotalSeen(t => t + 1);
          }
        } catch {}
      };
    } catch {}
  }, [maxSignals]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(retryRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { signals, connected, totalSeen };
}

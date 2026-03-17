'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace('https://', 'wss://').replace('http://', 'ws://').replace('/api','').replace('api.','')
  : '';
const FULL_WS_URL = WS_URL ? `${WS_URL}/ws` : '';

// Static fallback signals for when WS is unavailable
const FALLBACK_SIGNALS = [
  { company:'Microsoft Corp', economy:'UAE',  iso3:'ARE', sector:'J', capex_m:850,  sci_score:91.2, grade:'PLATINUM', signal_type:'Greenfield', status:'CONFIRMED', reference_code:'MSS-J-ARE-20260317-0001', provenance:{verified:true,tier:'T1'} },
  { company:'Amazon AWS',     economy:'Saudi Arabia', iso3:'SAU', sector:'J', capex_m:5300, sci_score:88.4, grade:'PLATINUM', signal_type:'Expansion',  status:'ANNOUNCED', reference_code:'MSS-J-SAU-20260317-0002', provenance:{verified:true,tier:'T1'} },
  { company:'Siemens Energy', economy:'Egypt',  iso3:'EGY', sector:'D', capex_m:340,  sci_score:86.1, grade:'GOLD',     signal_type:'JV',         status:'CONFIRMED', reference_code:'MSS-D-EGY-20260317-0003', provenance:{verified:true,tier:'T1'} },
  { company:'CATL',           economy:'Indonesia', iso3:'IDN', sector:'C', capex_m:3200, sci_score:85.4, grade:'PLATINUM', signal_type:'Greenfield', status:'COMMITTED', reference_code:'MSS-C-IDN-20260317-0006', provenance:{verified:true,tier:'T1'} },
  { company:'Vestas Wind',    economy:'India',  iso3:'IND', sector:'D', capex_m:420,  sci_score:85.9, grade:'GOLD',     signal_type:'Greenfield', status:'ANNOUNCED', reference_code:'MSS-D-IND-20260317-0005', provenance:{verified:true,tier:'T1'} },
  { company:'NVIDIA Corp',    economy:'Singapore', iso3:'SGP', sector:'J', capex_m:4400, sci_score:89.2, grade:'PLATINUM', signal_type:'Greenfield', status:'ANNOUNCED', reference_code:'MSS-J-SGP-20260317-0007', provenance:{verified:true,tier:'T1'} },
  { company:'ACWA Power',     economy:'Morocco',  iso3:'MAR', sector:'D', capex_m:1100, sci_score:82.1, grade:'GOLD',     signal_type:'Greenfield', status:'CONFIRMED', reference_code:'MSS-D-MAR-20260317-0008', provenance:{verified:true,tier:'T1'} },
  { company:'Google Alphabet',economy:'UAE',   iso3:'ARE', sector:'J', capex_m:1000, sci_score:87.1, grade:'GOLD',     signal_type:'Greenfield', status:'ANNOUNCED', reference_code:'MSS-J-ARE-20260309-0001', provenance:{verified:true,tier:'T1'} },
];

export function useRealTimeSignals(maxSignals = 20) {
  const [signals,   setSignals]   = useState<any[]>(FALLBACK_SIGNALS.slice(0, Math.min(maxSignals, FALLBACK_SIGNALS.length)));
  const [connected, setConnected] = useState(false);
  const [totalSeen, setTotalSeen] = useState(FALLBACK_SIGNALS.length);
  const wsRef      = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const MAX_RETRIES = 3;

  const connect = useCallback(() => {
    if (!FULL_WS_URL || retriesRef.current >= MAX_RETRIES) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(FULL_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        retriesRef.current = 0;
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'signal' && data.signal) {
            setSignals(prev => {
              const next = [data.signal, ...prev.filter(s => s.reference_code !== data.signal.reference_code)];
              return next.slice(0, maxSignals);
            });
            setTotalSeen(t => t + 1);
          } else if (data.type === 'batch' && Array.isArray(data.signals)) {
            setSignals(prev => {
              const combined = [...data.signals, ...prev];
              const unique = combined.filter((s, i, arr) => arr.findIndex(x => x.reference_code === s.reference_code) === i);
              return unique.slice(0, maxSignals);
            });
            setTotalSeen(t => t + data.signals.length);
          }
        } catch {}
      };

      ws.onerror = () => {
        setConnected(false);
      };

      ws.onclose = () => {
        setConnected(false);
        retriesRef.current += 1;
        if (retriesRef.current < MAX_RETRIES) {
          setTimeout(connect, 3000 * retriesRef.current);
        }
      };
    } catch {
      setConnected(false);
    }
  }, [maxSignals]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    connect();
    return () => {
      wsRef.current?.close(1000, 'Component unmounted');
      wsRef.current = null;
    };
  }, [connect]);

  return { signals, connected, totalSeen };
}

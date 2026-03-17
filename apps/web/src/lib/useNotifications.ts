'use client';
import { useEffect, useCallback } from 'react';
import { useRealTimeSignals } from './useRealTimeSignals';

export function useSignalNotifications(enabled = true) {
  const { signals } = useRealTimeSignals(5);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      return result === 'granted';
    }
    return false;
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (signals.length === 0) return;

    const latest = signals[0];
    if (!latest || latest.grade !== 'PLATINUM') return;

    const notif = new Notification(`⭐ PLATINUM: ${latest.company}`, {
      body:    `${latest.economy} · $${latest.capex_m}M · SCI ${latest.sci_score}`,
      icon:    '/favicon.svg',
      badge:   '/favicon.svg',
      tag:     latest.reference_code,
      silent:  false,
    });

    notif.onclick = () => {
      window.focus();
      window.location.href = '/signals';
      notif.close();
    };

    return () => notif.close();
  }, [signals, enabled]);

  return { requestPermission };
}

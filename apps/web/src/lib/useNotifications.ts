'use client';
import { useEffect, useCallback, useRef } from 'react';
import { useRealTimeSignals } from './useRealTimeSignals';

type NotificationPermission = 'default' | 'granted' | 'denied';

export function useSignalNotifications(enabled = true) {
  const { signals, connected } = useRealTimeSignals(10);
  const lastNotifRef = useRef<string | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied')  return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }, []);

  const showNotification = useCallback((title: string, options: NotificationOptions = {}) => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const n = new Notification(title, {
      icon:   '/favicon.svg',
      badge:  '/favicon.svg',
      silent: false,
      ...options,
    });
    n.onclick = () => { window.focus(); n.close(); };
    setTimeout(() => n.close(), 8000);
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (!connected || signals.length === 0) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const latest = signals[0];
    if (!latest || !latest.reference_code) return;
    if (lastNotifRef.current === latest.reference_code) return;

    lastNotifRef.current = latest.reference_code;

    if (latest.grade === 'PLATINUM') {
      showNotification(`⭐ PLATINUM Signal: ${latest.company}`, {
        body:  `${latest.economy} · $${latest.capex_m}M · SCI ${latest.sci_score}`,
        tag:   latest.reference_code,
        data:  { href: '/signals' },
      });
    }
  }, [signals, connected, enabled, showNotification]);

  return {
    requestPermission,
    showNotification,
    permission: typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission as NotificationPermission
      : 'default' as NotificationPermission,
  };
}

/** Hook for in-app notification badge count */
export function useUnreadCount() {
  const { signals } = useRealTimeSignals(20);
  const platinumCount = signals.filter((s: any) => s.grade === 'PLATINUM').length;
  return { unread: platinumCount, total: signals.length };
}

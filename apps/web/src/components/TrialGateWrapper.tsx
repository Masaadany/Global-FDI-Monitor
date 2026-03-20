'use client';
import TrialGate from '@/components/TrialGate';
import type { ReactNode } from 'react';

export default function TrialGateWrapper({ children }: { children: ReactNode }) {
  return <TrialGate>{children}</TrialGate>;
}

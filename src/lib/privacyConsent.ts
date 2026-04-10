import { useSyncExternalStore } from 'react';

import { analyticsService } from './analytics';
import { crashlyticsService } from './crashlytics';

export const CONSENT_STORAGE_KEY = 'analytics_consent';

export type ConsentStatus = 'granted' | 'denied' | 'undetermined';
type Listener = () => void;

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function isConsentStatus(value: unknown): value is ConsentStatus {
  return value === 'granted' || value === 'denied' || value === 'undetermined';
}

export function readConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') {
    return 'undetermined';
  }

  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);

    if (!stored) {
      return 'undetermined';
    }

    return isConsentStatus(stored) ? stored : 'undetermined';
  } catch {
    return 'undetermined';
  }
}

function writeConsentStatus(status: ConsentStatus) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (status === 'undetermined') {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch {
    // Keep the consent state usable even if persistence fails.
  }
}

export function subscribeConsentStatus(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function syncConsentServices(status: ConsentStatus) {
  const enabled = status === 'granted';
  await analyticsService.setEnabled(enabled);
  await crashlyticsService.setCrashlyticsEnabled(enabled);
}

export async function getConsentStatus(): Promise<ConsentStatus> {
  return readConsentStatus();
}

export async function setConsent(status: 'granted' | 'denied'): Promise<void> {
  writeConsentStatus(status);
  emit();
  await syncConsentServices(status);
}

export async function resetConsent(): Promise<void> {
  writeConsentStatus('undetermined');
  emit();
  await syncConsentServices('undetermined');
}

export function useConsentStatus() {
  return useSyncExternalStore(subscribeConsentStatus, readConsentStatus, readConsentStatus);
}

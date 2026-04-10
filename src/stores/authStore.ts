import { useSyncExternalStore } from 'react';

export const AUTH_STORAGE_KEY = 'auth-storage';

export type AuthState = {
  userId: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
};

type AuthMethods = {
  setAuth: (userId: string, token: string) => void;
  clearAuth: () => void;
  login: (userId: string, token?: string | null) => void;
  logout: () => void;
  hydrate: () => void;
  reset: () => void;
};

export type AuthSnapshot = AuthState & AuthMethods;
type Listener = () => void;

function createState(
  userId: string | null = null,
  token: string | null = null,
  isAuthenticated = false,
): AuthState {
  return {
    userId,
    token,
    isAuthenticated,
    isLoggedIn: isAuthenticated,
  };
}

function readStorage(): AuthState {
  if (typeof window === 'undefined') {
    return createState();
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return createState();
    }

    const parsed = JSON.parse(raw) as Partial<AuthState>;

    return createState(
      parsed.userId ?? null,
      parsed.token ?? null,
      Boolean(parsed.isAuthenticated ?? parsed.isLoggedIn),
    );
  } catch {
    return createState();
  }
}

function writeStorage(next: AuthState) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (!next.isAuthenticated) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        userId: next.userId,
        token: next.token,
        isAuthenticated: next.isAuthenticated,
      }),
    );
  } catch {
    // Swallow storage failures so the in-memory state remains usable.
  }
}

let state = readStorage();
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: AuthState) {
  state = next;
  writeStorage(next);
  emit();
}

const methods: AuthMethods = {
  setAuth(userId, token) {
    setState(createState(userId, token, true));
  },

  clearAuth() {
    setState(createState());
  },

  login(userId, token = null) {
    setState(createState(userId, token, true));
  },

  logout() {
    setState(createState());
  },

  hydrate() {
    setState(readStorage());
  },

  reset() {
    setState(createState());
  },
};

export const authStore = {
  getState(): AuthSnapshot {
    return {
      ...state,
      ...methods,
    };
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useAuthStore<T>(selector: (snapshot: AuthSnapshot) => T) {
  return useSyncExternalStore(
    authStore.subscribe,
    () => selector(authStore.getState()),
    () => selector(authStore.getState()),
  );
}

export const selectUserId = (snapshot: AuthSnapshot) => snapshot.userId;
export const selectToken = (snapshot: AuthSnapshot) => snapshot.token;
export const selectIsAuthenticated = (snapshot: AuthSnapshot) => snapshot.isAuthenticated;
export const selectIsLoggedIn = (snapshot: AuthSnapshot) => snapshot.isLoggedIn;

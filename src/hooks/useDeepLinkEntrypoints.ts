import { useEffect, useRef } from 'react';

import { createDeepLinkEntryManager } from '../lib/deepLinkEntryManager';
import type { NotificationResponseLike } from '../types/notification';
import { selectIsLoggedIn, useAuthStore } from '../stores/authStore';

type UrlEvent = {
  url: string;
};

type DeepLinkEntrypointsManager = ReturnType<typeof createDeepLinkEntryManager>;

export type UseDeepLinkEntrypointsOptions = {
  isLoggedIn?: boolean;
  getInitialUrl?: () => Promise<string | null>;
  subscribeUrlEvents?: (handler: (event: UrlEvent) => void) => () => void;
  subscribeNotificationResponses?: (
    handler: (response: NotificationResponseLike) => void,
  ) => () => void;
  getLastNotificationResponse?: () => Promise<NotificationResponseLike>;
  manager?: DeepLinkEntrypointsManager;
};

export function useDeepLinkEntrypoints({
  isLoggedIn,
  getInitialUrl,
  subscribeUrlEvents,
  subscribeNotificationResponses,
  getLastNotificationResponse,
  manager,
}: UseDeepLinkEntrypointsOptions = {}) {
  const storeIsLoggedIn = useAuthStore(selectIsLoggedIn);
  const resolvedIsLoggedIn = isLoggedIn ?? storeIsLoggedIn;
  const managerRef = useRef<DeepLinkEntrypointsManager>(manager ?? createDeepLinkEntryManager());

  useEffect(() => {
    if (!getInitialUrl) {
      return;
    }

    let cancelled = false;

    void getInitialUrl().then((url) => {
      if (cancelled) {
        return;
      }

      void managerRef.current.handleInitialUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [getInitialUrl]);

  useEffect(() => {
    if (!subscribeUrlEvents) {
      return;
    }

    return subscribeUrlEvents((event) => {
      void managerRef.current.handleUrlEvent(event);
    });
  }, [subscribeUrlEvents]);

  useEffect(() => {
    if (!subscribeNotificationResponses) {
      return;
    }

    return subscribeNotificationResponses((response) => {
      void managerRef.current.handleNotificationResponse(response);
    });
  }, [subscribeNotificationResponses]);

  useEffect(() => {
    if (!getLastNotificationResponse) {
      return;
    }

    let cancelled = false;

    void getLastNotificationResponse().then((response) => {
      if (cancelled) {
        return;
      }

      void managerRef.current.handleLastNotificationResponse(response);
    });

    return () => {
      cancelled = true;
    };
  }, [getLastNotificationResponse]);

  useEffect(() => {
    void managerRef.current.handleLoginStateChange(resolvedIsLoggedIn);
  }, [resolvedIsLoggedIn]);
}

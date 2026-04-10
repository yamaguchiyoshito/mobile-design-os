import type { NotificationResponseLike } from '../types/notification';
import { deepLinkResolver } from './deepLinkResolver';
import { handleNotificationResponse } from './notificationDeepLink';

export type DeepLinkUrlEvent = {
  url: string;
};

type DeepLinkEntryManagerDeps = {
  navigate?: (url: string) => Promise<boolean>;
  consumePendingDeepLink?: () => Promise<void>;
  handleNotificationResponse?: (response: NotificationResponseLike) => Promise<boolean>;
};

export function createDeepLinkEntryManager({
  navigate = deepLinkResolver.navigate,
  consumePendingDeepLink = deepLinkResolver.consumePendingDeepLink,
  handleNotificationResponse: onNotificationResponse = handleNotificationResponse,
}: DeepLinkEntryManagerDeps = {}) {
  let initialUrlHandled = false;

  return {
    async handleInitialUrl(url?: string | null) {
      if (!url || initialUrlHandled) {
        return false;
      }

      initialUrlHandled = true;
      return navigate(url);
    },

    async handleUrlEvent(event: DeepLinkUrlEvent | string) {
      const url = typeof event === 'string' ? event : event.url;

      if (!url) {
        return false;
      }

      return navigate(url);
    },

    async handleNotificationResponse(response: NotificationResponseLike) {
      return onNotificationResponse(response);
    },

    async handleLastNotificationResponse(response: NotificationResponseLike) {
      return onNotificationResponse(response);
    },

    async handleLoginStateChange(isLoggedIn: boolean) {
      if (!isLoggedIn) {
        return;
      }

      await consumePendingDeepLink();
    },

    resetInitialUrlGuard() {
      initialUrlHandled = false;
    },
  };
}

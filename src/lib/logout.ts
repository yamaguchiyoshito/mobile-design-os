import { authStore } from '../stores/authStore';
import { clearWebViewCache } from './webViewCacheManager';

export async function logoutWithCleanup() {
  try {
    await clearWebViewCache();
  } finally {
    authStore.getState().clearAuth();
  }
}

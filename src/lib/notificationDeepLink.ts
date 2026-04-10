import type { NotificationData, NotificationResponseLike } from '../types/notification';
import { notificationDataSchema } from '../types/notification';
import { deepLinkResolver } from './deepLinkResolver';
import { logger } from './logger';

export function parseNotificationData(data: unknown): NotificationData | null {
  const parsed = notificationDataSchema.safeParse(data);

  if (!parsed.success) {
    logger.warn('notificationDeepLink: invalid notification data', {
      issues: parsed.error.issues,
      data,
    });
    return null;
  }

  return parsed.data;
}

export function extractNotificationData(response: NotificationResponseLike): unknown {
  return response?.notification?.request?.content?.data;
}

export async function handleNotificationTap(data: unknown): Promise<boolean> {
  const parsed = parseNotificationData(data);

  if (!parsed?.deepLink) {
    return false;
  }

  return deepLinkResolver.navigate(parsed.deepLink);
}

export async function handleNotificationResponse(
  response: NotificationResponseLike,
): Promise<boolean> {
  return handleNotificationTap(extractNotificationData(response));
}

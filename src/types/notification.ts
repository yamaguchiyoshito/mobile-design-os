import { z } from 'zod';

export const notificationDataSchema = z.object({
  category: z.enum(['order_status', 'message', 'promotion', 'critical']),
  deepLink: z.string().optional(),
  body: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export type NotificationData = z.infer<typeof notificationDataSchema>;

export type NotificationResponseLike = {
  notification?: {
    request?: {
      content?: {
        data?: unknown;
      };
    };
  };
} | null;

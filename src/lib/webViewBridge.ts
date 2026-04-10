import { z } from 'zod';

import { logger } from './logger';

export type NativeToWebMessage =
  | { type: 'INIT'; payload: { authToken: string; locale: string } }
  | { type: 'THEME_CHANGE'; payload: { colorScheme: 'light' | 'dark' } }
  | { type: 'NAVIGATE_BACK' };

export type WebToNativeMessage =
  | { type: 'READY' }
  | { type: 'CLOSE' }
  | { type: 'OPEN_EXTERNAL'; payload: { url: string } }
  | { type: 'PAYMENT_SUCCESS'; payload: { transactionId: string } }
  | { type: 'PAYMENT_CANCEL' }
  | { type: 'PAYMENT_ERROR'; payload: { code: string; message: string } }
  | { type: 'HEIGHT_CHANGED'; payload: { height: number } };

const webToNativeMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('READY') }),
  z.object({ type: z.literal('CLOSE') }),
  z.object({
    type: z.literal('OPEN_EXTERNAL'),
    payload: z.object({
      url: z.string().refine((value) => {
        if (/^(mailto:|tel:|sms:)/.test(value)) {
          return true;
        }

        try {
          const parsed = new URL(value);
          return parsed.protocol === 'https:' || parsed.protocol === 'http:';
        } catch {
          return false;
        }
      }),
    }),
  }),
  z.object({
    type: z.literal('PAYMENT_SUCCESS'),
    payload: z.object({ transactionId: z.string() }),
  }),
  z.object({ type: z.literal('PAYMENT_CANCEL') }),
  z.object({
    type: z.literal('PAYMENT_ERROR'),
    payload: z.object({ code: z.string(), message: z.string() }),
  }),
  z.object({
    type: z.literal('HEIGHT_CHANGED'),
    payload: z.object({ height: z.number().positive() }),
  }),
]);

export const webViewBridge = {
  parseIncoming(raw: string): WebToNativeMessage | null {
    try {
      const json = JSON.parse(raw);
      const parsed = webToNativeMessageSchema.safeParse(json);

      if (!parsed.success) {
        logger.warn('WebView bridge: unknown message', { raw, issues: parsed.error.issues });
        return null;
      }

      return parsed.data;
    } catch {
      logger.warn('WebView bridge: invalid JSON', { raw });
      return null;
    }
  },

  buildInjectScript(message: NativeToWebMessage) {
    const json = JSON.stringify(message);

    return `
      (function() {
        if (window.__nativeBridge__) {
          window.__nativeBridge__(${json});
        } else {
          window.__nativeBridgeQueue__ = window.__nativeBridgeQueue__ || [];
          window.__nativeBridgeQueue__.push(${json});
        }
        true;
      })();
    `;
  },
};

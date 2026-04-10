import { useCallback } from 'react';

import { WebViewContainer } from '../../../components/ui/WebViewContainer';
import { notify } from '../../../lib/notify';
import {
  webViewBridge,
  type NativeToWebMessage,
  type WebToNativeMessage,
} from '../../../lib/webViewBridge';

export type PaymentWebViewProps = {
  paymentUrl: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
  onError?: (payload: { code: string; message: string }) => void;
  getAuthTokenSync?: () => string;
  locale?: string;
  onInitScriptReady?: (script: string, message: NativeToWebMessage) => void;
  onBridgeMessage?: (message: WebToNativeMessage) => void;
  allowedOrigins?: string[];
  injectedJS?: string;
};

const DEFAULT_ALLOWED_ORIGINS = [
  'https://payment.example.com',
  'https://checkout.stripe.com',
  'https://secure.3dsecure.example.com',
] as const;

export function PaymentWebView({
  paymentUrl,
  onSuccess,
  onCancel,
  onError,
  getAuthTokenSync,
  locale = 'ja',
  onInitScriptReady,
  onBridgeMessage,
  allowedOrigins = [...DEFAULT_ALLOWED_ORIGINS],
  injectedJS,
}: PaymentWebViewProps) {
  const handleBridgeMessage = useCallback(
    (message: WebToNativeMessage) => {
      onBridgeMessage?.(message);

      switch (message.type) {
        case 'READY': {
          if (!getAuthTokenSync || !onInitScriptReady) {
            return;
          }

          const initMessage: NativeToWebMessage = {
            type: 'INIT',
            payload: { authToken: getAuthTokenSync(), locale },
          };

          onInitScriptReady(webViewBridge.buildInjectScript(initMessage), initMessage);
          return;
        }

        case 'PAYMENT_SUCCESS':
          onSuccess(message.payload.transactionId);
          return;

        case 'PAYMENT_CANCEL':
        case 'CLOSE':
          onCancel();
          return;

        case 'PAYMENT_ERROR':
          notify.error(message.payload.message);
          if (onError) {
            onError(message.payload);
            return;
          }

          onCancel();
          return;

        case 'OPEN_EXTERNAL':
          return;
      }
    },
    [getAuthTokenSync, locale, onBridgeMessage, onCancel, onError, onInitScriptReady, onSuccess],
  );

  return (
    <WebViewContainer
      uri={paymentUrl}
      title="お支払い"
      allowedOrigins={allowedOrigins}
      onBridgeMessage={handleBridgeMessage}
      injectedJS={injectedJS}
      testID="payment-webview"
    />
  );
}

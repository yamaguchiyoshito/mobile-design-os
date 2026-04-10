import { useEffect, useMemo, useRef, useState } from 'react';

import { deepLinkResolver } from '../../../lib/deepLinkResolver';
import { webViewBridge, type WebToNativeMessage } from '../../../lib/webViewBridge';
import { webViewSecurityPolicy } from '../../../lib/webViewSecurityPolicy';
import { WebViewErrorState } from './WebViewErrorState';
import { WebViewLoadingOverlay } from './WebViewLoadingOverlay';

export type WebViewContainerProps = {
  uri: string;
  title?: string;
  injectedJS?: string;
  allowedOrigins?: string[];
  onMessage?: (data: string) => void;
  onBridgeMessage?: (message: WebToNativeMessage) => void;
  onNavigate?: (url: string) => void;
  onLoadEnd?: () => void;
  showLoadingOverlay?: boolean;
  testID?: string;
  style?: React.CSSProperties;
  className?: string;
};

export function WebViewContainer({
  uri,
  title,
  injectedJS,
  allowedOrigins,
  onMessage,
  onBridgeMessage,
  onNavigate,
  onLoadEnd,
  showLoadingOverlay = true,
  testID,
  style,
  className,
}: WebViewContainerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const policy = useMemo(
    () =>
      allowedOrigins
        ? webViewSecurityPolicy.createCustomPolicy(allowedOrigins)
        : webViewSecurityPolicy.default,
    [allowedOrigins],
  );
  const dispatchResult = useMemo(() => webViewSecurityPolicy.dispatchUrl(uri), [uri]);
  const canRenderIframe = dispatchResult.action === 'allow' && policy.isAllowed(uri);

  useEffect(() => {
    setLoadState('loading');

    if (dispatchResult.action === 'deeplink') {
      void deepLinkResolver.navigate(uri);
      setLoadState('loaded');
      return;
    }

    if (dispatchResult.action === 'external') {
      setLoadState('error');
      webViewSecurityPolicy.openExternal(uri);
      return;
    }

    if (dispatchResult.action === 'block') {
      setLoadState('error');
      return;
    }

    if (!policy.isAllowed(uri)) {
      setLoadState('error');
      webViewSecurityPolicy.openExternal(uri);
      return;
    }

    onNavigate?.(uri);
  }, [dispatchResult.action, uri, policy, onNavigate]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handler = (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        const bridgeMessage = webViewBridge.parseIncoming(event.data);

        if (bridgeMessage?.type === 'OPEN_EXTERNAL') {
          webViewSecurityPolicy.openExternal(bridgeMessage.payload.url);
        }

        if (bridgeMessage) {
          onBridgeMessage?.(bridgeMessage);
        }

        onMessage?.(event.data);
      }
    };

    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, [onBridgeMessage, onMessage]);

  const composedInjectedJS = [webViewSecurityPolicy.baseInjectedJS, injectedJS]
    .filter(Boolean)
    .join('\n');
  const srcDoc = composedInjectedJS
    ? `<!doctype html><html><body style="margin:0"><script>${composedInjectedJS}</script></body></html>`
    : undefined;

  const handleError = () => {
    setLoadState('error');
  };

  return (
    <section
      aria-label={title ?? 'ウェブコンテンツ'}
      data-testid={testID}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 480,
        border: '1px solid #D0D5DD',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        ...style,
      }}
    >
      {loadState !== 'error' && canRenderIframe ? (
        <iframe
          ref={iframeRef}
          title={title ?? 'ウェブコンテンツ'}
          src={srcDoc ? undefined : uri}
          srcDoc={srcDoc}
          onLoad={() => {
            setLoadState('loaded');
            onLoadEnd?.();
          }}
          onError={handleError}
          onErrorCapture={handleError}
          style={{
            display: 'block',
            width: '100%',
            minHeight: 480,
            border: 'none',
            backgroundColor: '#FFFFFF',
          }}
        />
      ) : null}

      {showLoadingOverlay && loadState === 'loading' ? <WebViewLoadingOverlay /> : null}

      {loadState === 'error' ? (
        <WebViewErrorState
          onRetry={() => {
            if (!policy.isAllowed(uri)) {
              webViewSecurityPolicy.openExternal(uri);
              return;
            }

            setLoadState('loading');
            iframeRef.current?.contentWindow?.location.reload();
          }}
        />
      ) : null}
    </section>
  );
}

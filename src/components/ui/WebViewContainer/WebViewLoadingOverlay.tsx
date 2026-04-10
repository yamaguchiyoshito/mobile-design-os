import tokens from '../../../tokens';
import { Text } from '../Text';

export function WebViewLoadingOverlay() {
  return (
    <div
      role="progressbar"
      aria-label="ページを読み込んでいます"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `3px solid ${tokens.colorBorderDefault}`,
          borderTopColor: tokens.colorContentBrand,
          animation: 'ui-spin 0.8s linear infinite',
        }}
      />
      <Text as="span" variant="bodySm" tone="secondary" style={{ marginLeft: 12 }}>
        ページを読み込んでいます
      </Text>
    </div>
  );
}

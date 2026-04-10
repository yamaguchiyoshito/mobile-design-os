import { ErrorState } from '../ErrorState';

export type WebViewErrorStateProps = {
  onRetry: () => void;
};

export function WebViewErrorState({ onRetry }: WebViewErrorStateProps) {
  return <ErrorState message="ページを読み込めませんでした" onRetry={onRetry} />;
}

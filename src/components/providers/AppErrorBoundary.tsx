import { Component, type ErrorInfo, type ReactNode } from 'react';

import { crashlyticsService } from '../../lib/crashlytics';
import { logger } from '../../lib/logger';
import { ErrorState } from '../ui/ErrorState';

export type AppErrorBoundaryProps = {
  children: ReactNode;
  fallbackMessage?: string;
  onReset?: () => void;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.capture(error, { componentStack: errorInfo.componentStack });
    void crashlyticsService.recordError(error, errorInfo.componentStack ?? undefined);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          message={this.props.fallbackMessage ?? '予期しないエラーが発生しました'}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

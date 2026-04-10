import { sentryService } from './sentry';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

function shouldSilenceConsole() {
  return typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
}

function getConsoleMethod(level: LogLevel) {
  if (level === 'error') {
    return console.error;
  }

  if (level === 'warn') {
    return console.warn;
  }

  return console.log;
}

function log(level: LogLevel, message: string, context?: LogContext) {
  const breadcrumbLevel = level === 'warn' ? 'warning' : level;

  void sentryService.addBreadcrumb(breadcrumbLevel, message, context);

  if (level === 'error') {
    void sentryService.captureMessage(message, 'error', context);
  }

  if (!shouldSilenceConsole()) {
    getConsoleMethod(level)(message, context);
  }
}

export const logger = {
  debug(message: string, context?: LogContext) {
    log('debug', message, context);
  },

  info(message: string, context?: LogContext) {
    log('info', message, context);
  },

  warn(message: string, context?: LogContext) {
    log('warn', message, context);
  },

  error(message: string, context?: LogContext) {
    log('error', message, context);
  },

  capture(error: unknown, context?: LogContext) {
    void sentryService.captureException(error, context);

    if (!shouldSilenceConsole()) {
      console.error('[EXCEPTION]', error, context);
    }
  },
};

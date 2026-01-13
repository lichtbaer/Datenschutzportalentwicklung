type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogFields = Record<string, unknown>;

const REDACT_KEYS = new Set([
  'email',
  'uploaderEmail',
  'uploaderName',
  'projectTitle',
  'projectDetails',
  'institution',
  'fileName',
  'filename',
  'files',
  'fileNames',
  'headers',
  'responseText',
]);

function sanitize(fields?: LogFields): LogFields | undefined {
  if (!fields) return undefined;
  const out: LogFields = {};
  for (const [k, v] of Object.entries(fields)) {
    out[k] = REDACT_KEYS.has(k) ? '[redacted]' : v;
  }
  return out;
}

function shouldEmit(level: LogLevel): boolean {
  // In production we keep logs minimal (warn/error only).
  if (import.meta.env.PROD) return level === 'warn' || level === 'error';
  return true;
}

function emit(level: LogLevel, event: string, fields?: LogFields) {
  if (!shouldEmit(level)) return;
  const safe = sanitize(fields);
  const prefix = `[LOG] ${event}`;
  if (safe && Object.keys(safe).length > 0) {
    // Keep as structured object for devtools; sanitized for PII.
    // eslint-disable-next-line no-console
    console[level](prefix, safe);
  } else {
    // eslint-disable-next-line no-console
    console[level](prefix);
  }
}

export const log = {
  debug: (event: string, fields?: LogFields) => emit('debug', event, fields),
  info: (event: string, fields?: LogFields) => emit('info', event, fields),
  warn: (event: string, fields?: LogFields) => emit('warn', event, fields),
  error: (event: string, fields?: LogFields) => emit('error', event, fields),
};

export function generateRequestId(): string {
  // Prefer the browser-native UUID when available.
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-expect-error TS libdom randomUUID typing varies by config
    return crypto.randomUUID();
  }
  // Fallback (not cryptographically strong, but OK for correlation ID)
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}


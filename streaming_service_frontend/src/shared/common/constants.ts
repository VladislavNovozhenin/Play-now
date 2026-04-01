export const ACCESS_TOKEN = 'access_token';

export const DEFAULT_NOTIFICATION_DURATION = 3;

export const SERVER_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';

export const APP_LANGUAGES = {
  RU: 'ru',
  EN: 'en',
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  UNAUTHORIZED: 401,
  ACCESS_DENIED: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const NO_DATA = '-';

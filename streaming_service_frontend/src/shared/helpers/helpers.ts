import type { AppError, Song } from '@shared/ts/types';
import type { TFunction } from 'i18next';

const TRACK_URL = import.meta.env.VITE_TRACK_API;

export const parseApiError = (error: AppError, t: TFunction): string => {
  switch (error.type) {
    case 'api':
      return t(`errors.api`);
    case 'network':
      return t(`errors.network`);
    default:
      return t('errors.unknown');
  }
};

export const handleApiError = (error: AppError, showError: ({ title }: { title: string }) => void, t: TFunction) => {
  const errorMessage = parseApiError(error, t);
  showError({ title: errorMessage });
};

export const debounce = (fn: (value: string) => void, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debounced = (arg: string) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(arg);
    }, ms);
  };

  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
};

export const getTrackUrl = (track: Song) => {
  const encodedFileName = track.path.replace(' ', '%20');
  return `${TRACK_URL}${encodedFileName}`;
};

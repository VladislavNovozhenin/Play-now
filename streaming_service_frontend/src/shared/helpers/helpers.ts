import type { AppError } from '@shared/ts/types';
import type { TFunction } from 'i18next';

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

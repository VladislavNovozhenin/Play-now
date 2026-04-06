import { isNullOrUndefined } from '@shared/common/helpers';
import type { ApiError } from '@shared/ts/types';
import type { TFunction } from 'i18next';

export const handleApiError = (error: unknown, showError: ({ title }: { title: string }) => void, t: TFunction, name?: string) => {
  let messageValue = '';
  if (typeof error === 'object' && !isNullOrUndefined(error) && 'statusCode' in error) {
    if ('error' in error) {
      messageValue = t('errors.unknown');
    } else {
      const apiError = error as ApiError;
      messageValue = t(`errors.${apiError.statusCode}.${name}`, { defaultValue: t('errors.unknown') });
    }
  } else if (error instanceof Error) {
    if (error.message === 'Failed to fetch') {
      messageValue = t('errors.network');
    } else {
      messageValue = t(`${error.message}`, { defaultValue: t('errors.unknown') });
    }
  } else messageValue = t('errors.unknown');

  showError({ title: messageValue });
};

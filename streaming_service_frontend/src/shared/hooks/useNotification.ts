import { DEFAULT_NOTIFICATION_DURATION } from '@shared/common/constants';
import { isNullOrUndefined } from '@shared/common/helpers';
import { notification } from 'antd';
import type { ArgsProps } from 'antd/es/notification';

export const useNotification = () => {
  const showError = (config: ArgsProps) => {
    notification.error({
      ...config,
      placement: config?.placement ?? 'top',
      duration: config?.duration ?? DEFAULT_NOTIFICATION_DURATION,
    });
  };

  const showInfo = (config: ArgsProps) => {
    notification.info({
      ...config,
      placement: config?.placement ?? 'top',
      duration: config?.duration ?? DEFAULT_NOTIFICATION_DURATION,
    });
  };

  const showSuccess = (config: ArgsProps) => {
    notification.success({
      ...config,
      placement: config?.placement ?? 'top',
      duration: config?.duration ?? DEFAULT_NOTIFICATION_DURATION,
    });
  };

  const showWarning = (config: ArgsProps) => {
    notification.warning({
      ...config,
      placement: config?.placement ?? 'top',
      duration: config?.duration ?? DEFAULT_NOTIFICATION_DURATION,
    });
  };

  const clearNotifications = (key?: string) => {
    if (!isNullOrUndefined(key)) {
      notification.destroy(key);
      return;
    }
    notification.destroy();
  };
  return { showError, showInfo, showSuccess, showWarning, clearNotifications };
};

import { DEFAULT_NOTIFICATION_DURATION } from '@shared/common/constants';
import { isNullOrUndefined } from '@shared/common/helpers';
import { App } from 'antd';
import type { NotificationArgsProps } from 'antd';

export const useNotification = () => {
  const { notification } = App.useApp();
  const showError = (config: NotificationArgsProps) => {
    console.trace('🔥 NOTIFICATION ERROR CALLED');
    notification.error({
      ...config,
      placement: config?.placement ?? 'top',
      duration: config?.duration ?? DEFAULT_NOTIFICATION_DURATION,
    });
  };

  const showInfo = (config: NotificationArgsProps) => {
    notification.info({
      ...config,
      placement: config?.placement ?? 'top',
      duration: config?.duration ?? DEFAULT_NOTIFICATION_DURATION,
    });
  };

  const showSuccess = (config: NotificationArgsProps) => {
    notification.success({
      ...config,
      placement: config?.placement ?? 'top',
      duration: config?.duration ?? DEFAULT_NOTIFICATION_DURATION,
    });
  };

  const showWarning = (config: NotificationArgsProps) => {
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

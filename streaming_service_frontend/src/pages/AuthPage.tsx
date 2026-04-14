import { Modal } from 'antd';
import { AuthForm } from '../shared/components/auth-form/AuthForm';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { t } = useTranslation('common');

  return (
    <Modal className="auth-modal" footer={null} open={true} title={isLogin ? t('auth.login-title') : t('auth.register-title')} mask>
      <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
    </Modal>
  );
};

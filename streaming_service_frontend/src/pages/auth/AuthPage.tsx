import { Modal } from 'antd';
import { AuthForm } from './components/auth-form/AuthForm';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { t } = useTranslation('common');

  return (
    <Modal className='auth-modal' footer={null} open={true} title={isLogin ? t('login-title') : t('signup-title')}>
      <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
    </Modal>
  );
};

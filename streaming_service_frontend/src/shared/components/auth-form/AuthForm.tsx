import { Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import './auth-form.scss';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@shared/api/auth-api';
import { setUserValue } from '@store/useAppStore';
import { useNotification } from '@shared/hooks/useNotification';
import type { AppError, LoginRequest, RegisterRequest } from '@shared/ts/types';
import { handleApiError } from '@shared/helpers/helpers';

type AuthFormProps = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};
export const AuthForm = ({ isLogin, setIsLogin }: AuthFormProps) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    form.resetFields();
  }, [isLogin]);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authAPI.login(payload),
    onSuccess: (response, user) => {
      setUserValue({ token: response.access_token, username: user.username });
      showSuccess({ title: t('success-notification.login') });
    },
    onError: (error: AppError) => {
      handleApiError(error, showError, t);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterRequest) => authAPI.register(payload),
    onSuccess: (response, user) => {
      setUserValue({ token: response.access_token, username: user.username });
      showSuccess({ title: t('success-notification.register') });
    },
    onError: (error: AppError) => {
      handleApiError(error, showError, t);
    },
  });

  const handleSubmit = async () => {
    const value = form.getFieldsValue();
    try {
      if (isLogin) {
        await loginMutation.mutateAsync(value);
      } else {
        await registerMutation.mutateAsync(value);
      }
      navigate('/');
    } catch (error) {}
  };

  return (
    <Form onFinish={handleSubmit} form={form} className="auth-form">
      {!isLogin && (
        <>
          <FormItem
            name={'firstName'}
            rules={[
              { required: true, message: t('required') },
              { whitespace: true, message: t('required') },
            ]}>
            <Input placeholder={t('auth.enter-firstName')} />
          </FormItem>
          <FormItem
            name={'lastName'}
            rules={[
              { required: true, message: t('required') },
              { whitespace: true, message: t('required') },
            ]}>
            <Input placeholder={t('auth.enter-lastName')} />
          </FormItem>
        </>
      )}
      <FormItem
        name={'username'}
        rules={[
          { required: true, message: t('required') },
          { whitespace: true, message: t('required') },
        ]}>
        <Input placeholder={t('auth.enter-username')} />
      </FormItem>
      <FormItem
        name={'password'}
        rules={[
          { required: true, message: t('required') },
          { whitespace: true, message: t('required') },
        ]}>
        <Input placeholder={t('auth.enter-password')} />
      </FormItem>
      <div className="auth-form__btn-group">
        <button type="button" className="auth-form__btn-out" onClick={() => setIsLogin((prev) => !prev)}>
          {isLogin ? t('auth.dont-have-an-account-btn') : t('auth.already-have-an-account-btn')}
        </button>
        <button type="submit" className="auth-form__btn-enter">
          {isLogin ? t('auth.login-btn') : t('auth.register-btn')}
        </button>
      </div>
    </Form>
  );
};

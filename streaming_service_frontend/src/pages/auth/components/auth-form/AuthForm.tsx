import { Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import './auth-form.scss';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@pages/auth/api/api';
import type { LoginRequest, RegisterRequest } from '@pages/auth/ts/types';
import { setUserValue } from '@store/useAppStore';
import { useNotification } from '@shared/hooks/useNotification';

type AuthFormProps = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};
export const AuthForm = ({ isLogin, setIsLogin }: AuthFormProps) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { showSuccess } = useNotification();

  useEffect(() => {
    form.resetFields();
  }, [isLogin]);

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authAPI.login(payload),
    onSuccess: (response, user) => {
      setUserValue({ token: response.access_token, username: user.username });
      showSuccess({ title: t('login-success') });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterRequest) => authAPI.register(payload),
    onSuccess: (response, user) => {
      setUserValue({ token: response.access_token, username: user.username });
      showSuccess({ title: t('register-success') });
    },
    onError: (error) => {
      console.log(error);
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
            <Input placeholder={t('enter-firstName')} />
          </FormItem>
          <FormItem
            name={'lastName'}
            rules={[
              { required: true, message: t('required') },
              { whitespace: true, message: t('required') },
            ]}>
            <Input placeholder={t('enter-lastName')} />
          </FormItem>
        </>
      )}
      <FormItem
        name={'username'}
        rules={[
          { required: true, message: t('required') },
          { whitespace: true, message: t('required') },
        ]}>
        <Input placeholder={t('enter-username')} />
      </FormItem>
      <FormItem
        name={'password'}
        rules={[
          { required: true, message: t('required') },
          { whitespace: true, message: t('required') },
        ]}>
        <Input placeholder={t('enter-password')} />
      </FormItem>
      <div className="auth-form__btn-group">
        <button type="button" className="auth-form__btn-out" onClick={() => setIsLogin((prev) => !prev)}>
          {isLogin ? t('dont-have-an-account') : t('already-have-an-account')}
        </button>
        <button type="submit" className="auth-form__btn-enter">
          {isLogin ? t('login') : t('register')}
        </button>
      </div>
    </Form>
  );
};

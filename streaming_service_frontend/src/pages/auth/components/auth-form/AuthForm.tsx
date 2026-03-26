import { Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import './auth-form.scss';
import { useEffect } from 'react';
import { loginUser, registerUser } from '@pages/auth/helpers';
import { useNavigate } from 'react-router-dom';

type AuthFormProps = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};
export const AuthForm = ({ isLogin, setIsLogin }: AuthFormProps) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    form.resetFields();
  }, [isLogin]);

  const handleSubmit = async () => {
    const value = form.getFieldsValue();
    try {
      if (isLogin) {
        await loginUser(value);
      } else {
        registerUser(value);
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
          {isLogin ? t('login') : t('signup')}
        </button>
      </div>
    </Form>
  );
};

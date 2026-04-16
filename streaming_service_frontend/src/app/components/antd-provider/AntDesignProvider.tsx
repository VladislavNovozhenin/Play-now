import type React from 'react';
import { App as AntApp, ConfigProvider } from 'antd';
type AntDesignProviderProps = {
  children: React.ReactNode;
};
export const AntDesignProvider = ({ children }: AntDesignProviderProps) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Circular, sans-serif',
        },
      }}
      wave={{ disabled: true }}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
};

import { CustomMenu } from '@shared/components/custom-menu/CustomMenu';
import { CustomFooter } from '@widgets/custom-footer';
import { CustomHeader } from '@widgets/custom-header';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import './app-layout.scss';

const { Header, Footer, Sider, Content } = Layout;

export const AppLayout = () => {
  return (
    <Layout className="layout">
      <Header className="header">
        <CustomHeader />
      </Header>

      <Layout className="main-layout">
        <Sider className="aside">
          <CustomMenu />
        </Sider>
        <Content className="content" id='content'>
          <Outlet />
        </Content>
      </Layout>

      <Footer className="footer">
        <CustomFooter />
      </Footer>
    </Layout>
  );
};

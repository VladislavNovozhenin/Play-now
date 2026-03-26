import { CustomMenu } from '@shared/components/custom-menu/CustomMenu';
import { CustomFooter } from '@widgets/custom-footer';
import { CustomHeader } from '@widgets/custom-header';
import { Grid, Layout } from 'antd';
import clsx from 'clsx';
import { Outlet } from 'react-router-dom';
import './app-layout.scss';

const { Header, Footer, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export const AppLayout = () => {
  const { md } = useBreakpoint();
  return (
    <Layout className="layout">
      <Header className="header">
        <CustomHeader />
      </Header>

      <Layout className={clsx('layout', md ? 'layout--desktop' : 'layout--mobile')}>
        <Sider className="aside">
          <CustomMenu />
        </Sider>
        <Content className='content'>
          <Outlet />
        </Content>
      </Layout>

      <Footer className="footer">
        <CustomFooter />
      </Footer>
    </Layout>
  );
};

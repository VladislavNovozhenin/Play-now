import { CustomMenu } from '@shared/components/custom-menu/CustomMenu';
import { CustomHeader } from '@widgets/custom-header';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import './app-layout.scss';
import { Player } from '@shared/components/player/Player';

const { Header, Sider, Content } = Layout;

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
        <Content className="content" id="content">
          <Outlet />
        </Content>
      </Layout>

      <div className="global-player">
        <Player />
      </div>
    </Layout>
  );
};

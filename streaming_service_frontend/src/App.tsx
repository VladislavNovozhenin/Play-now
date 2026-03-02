import { AppRoutes } from '@app/router/appRoutes';
import { CustomMenu } from '@shared/components/custom-menu/CustomMenu';
import { CustomFooter } from '@widgets/custom-footer';
import { CustomHeader } from '@widgets/custom-header';
import { Grid, Layout } from 'antd';
import clsx from 'clsx';

const { Header, Footer, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

function App() {
  const { md } = useBreakpoint();
  return (
    <Layout className="layout">
      <Header className="header">
        <CustomHeader />
      </Header>
      <Layout className={clsx('layout', { 'layout--mobile': !md }, { 'layout--desktop': md })}>
        <Sider className="aside">
          <CustomMenu />
        </Sider>
        <Content>
          <AppRoutes />
        </Content>
      </Layout>
      <Footer className="footer">
        <CustomFooter />
      </Footer>
    </Layout>
  );
}

export default App;

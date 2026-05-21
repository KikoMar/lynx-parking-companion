import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './AppLayout.module.scss';
import { AppRoute } from '../../constants';

const { Header, Content } = Layout;

const AppLayout: React.FC = () => {
  const location = useLocation();
  const selectedKey = location.pathname.startsWith(AppRoute.profile)
    ? AppRoute.profile
    : AppRoute.parkings;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: '#001529',
        }}
      >
        <Typography.Title
          level={4}
          style={{ color: '#fff', margin: 0, marginRight: 32 }}
        >
          LYNX Parking
        </Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          style={{ flex: 1, background: 'transparent' }}
          items={[
            {
              key: AppRoute.parkings,
              label: <Link to={AppRoute.parkings}>Parkings</Link>,
            },
            {
              key: AppRoute.profile,
              label: <Link to={AppRoute.profile}>Profile</Link>,
            },
          ]}
        />
      </Header>
      <Content>
        <div className={styles.pageContainer}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default AppLayout;

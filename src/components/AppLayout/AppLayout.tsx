import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content } = Layout;

const AppLayout: React.FC = () => {
  const location = useLocation();
  const selectedKey = location.pathname.startsWith('/profile')
    ? '/profile'
    : '/parkings';

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
              key: '/parkings',
              label: <Link to="/parkings">Parkings</Link>,
            },
            {
              key: '/profile',
              label: <Link to="/profile">Profile</Link>,
            },
          ]}
        />
      </Header>
      <Content>
        <div className="page-container">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default AppLayout;

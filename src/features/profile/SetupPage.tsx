import React from 'react';
import { Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ProfileForm from './ProfileForm';
import { useProfileStore } from './profileStore';
import { UserProfile } from './profileTypes';

const SetupPage: React.FC = () => {
  const setProfile = useProfileStore((s) => s.setProfile);
  const navigate = useNavigate();

  const handleSubmit = (values: UserProfile) => {
    setProfile(values);
    message.success('Profile saved');
    navigate('/parkings', { replace: true });
  };

  return (
    <div style={{ maxWidth: 520, margin: '48px auto' }}>
      <Card>
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          Welcome to LYNX Parking
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Tell us about you and your car. Your details stay on this device.
        </Typography.Paragraph>
        <ProfileForm onSubmit={handleSubmit} submitLabel="Save and continue" />
      </Card>
    </div>
  );
};

export default SetupPage;

import React from 'react';
import { Button, Card, Popconfirm, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ProfileForm from './ProfileForm';
import { useProfileStore } from './profileStore';
import { useParkingStore } from '../parkings/parkingStore';
import { UserProfile } from './profileTypes';
import { AppRoute } from '../../constants';

const ProfilePage: React.FC = () => {
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const clearProfile = useProfileStore((s) => s.clearProfile);
  const clearFavorite = useParkingStore((s) => s.clearFavorite);
  const navigate = useNavigate();

  const handleSubmit = (values: UserProfile) => {
    setProfile(values);
    message.success('Profile updated');
  };

  const handleDelete = () => {
    clearProfile();
    clearFavorite();
    message.success('Profile deleted');
    navigate(AppRoute.setup, { replace: true });
  };

  return (
    <Card>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Your profile
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Edit your details or remove all data from this device.
      </Typography.Paragraph>
      <ProfileForm
        initialValues={profile}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        extraActions={
          <Popconfirm
            title="Delete all profile data?"
            description="This will also remove your favorite parking."
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
            onConfirm={handleDelete}
          >
            <Button danger>Delete profile</Button>
          </Popconfirm>
        }
      />
    </Card>
  );
};

export default ProfilePage;

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout/AppLayout';
import SetupPage from '../features/profile/SetupPage';
import ProfilePage from '../features/profile/ProfilePage';
import ParkingOverviewPage from '../features/parkings/ParkingOverviewPage';
import ParkingDetailPage from '../features/parkings/ParkingDetailPage';
import { useProfileStore } from '../features/profile/profileStore';

const ProtectedArea: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return <Navigate to="/setup" replace />;
  return <>{children}</>;
};

const SetupGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profile = useProfileStore((s) => s.profile);
  if (profile) return <Navigate to="/parkings" replace />;
  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const profile = useProfileStore((s) => s.profile);
  return <Navigate to={profile ? '/parkings' : '/setup'} replace />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<RootRedirect />} />
    <Route
      path="/setup"
      element={
        <SetupGuard>
          <SetupPage />
        </SetupGuard>
      }
    />
    <Route
      element={
        <ProtectedArea>
          <AppLayout />
        </ProtectedArea>
      }
    >
      <Route path="/parkings" element={<ParkingOverviewPage />} />
      <Route path="/parkings/:parkingId" element={<ParkingDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout/AppLayout';
import SetupPage from '../features/profile/SetupPage';
import ProfilePage from '../features/profile/ProfilePage';
import ParkingOverviewPage from '../features/parkings/ParkingOverviewPage';
import ParkingDetailPage from '../features/parkings/ParkingDetailPage';
import { useProfileStore } from '../features/profile/profileStore';
import { AppRoute } from '../constants';

const ProtectedArea: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return <Navigate to={AppRoute.setup} replace />;
  return <>{children}</>;
};

const SetupGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profile = useProfileStore((s) => s.profile);
  if (profile) return <Navigate to={AppRoute.parkings} replace />;
  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const profile = useProfileStore((s) => s.profile);
  return <Navigate to={profile ? AppRoute.parkings : AppRoute.setup} replace />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path={AppRoute.root} element={<RootRedirect />} />
    <Route
      path={AppRoute.setup}
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
      <Route path={AppRoute.parkings} element={<ParkingOverviewPage />} />
      <Route path={AppRoute.parkingDetail} element={<ParkingDetailPage />} />
      <Route path={AppRoute.profile} element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to={AppRoute.root} replace />} />
  </Routes>
);

export default AppRoutes;

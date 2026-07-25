import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Loader } from '../components/ui/Loader';
import { AppShell } from '../components/layout/AppShell';

const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(module => ({ default: module.LoginPage || module.default })));
const SignupPage = lazy(() => import('../pages/auth/SignupPage').then(module => ({ default: module.SignupPage || module.default })));
const DashboardPage = lazy(() => import('../pages/DashboardPage').then(module => ({ default: module.DashboardPage || module.default })));
const WithdrawPage = lazy(() => import('../pages/WithdrawPage').then(module => ({ default: module.WithdrawPage || module.default })));
const PixPage = lazy(() => import('../pages/PixPage').then(module => ({ default: module.PixPage || module.default })));
const BtcPage = lazy(() => import('../pages/BtcPage').then(module => ({ default: module.BtcPage || module.default })));
const PinPage = lazy(() => import('../pages/PinPage').then(module => ({ default: module.PinPage || module.default })));
const HistoryPage = lazy(() => import('../pages/HistoryPage').then(module => ({ default: module.HistoryPage || module.default })));
const InvestmentPlanPage = lazy(() => import('../pages/InvestmentPlanPage').then(module => ({ default: module.InvestmentPlanPage || module.default })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(module => ({ default: module.ProfilePage || module.default })));
const SupportPage = lazy(() => import('../pages/SupportPage').then(module => ({ default: module.SupportPage || module.default })));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="withdraw/pix" element={<PixPage />} />
          <Route path="withdraw/btc" element={<BtcPage />} />
          <Route path="withdraw/pin" element={<PinPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="invest" element={<InvestmentPlanPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
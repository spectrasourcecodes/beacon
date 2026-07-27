// client/src/routes/AppRoutes.jsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminRoute } from '../components/AdminRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Loader } from '../components/ui/Loader';
import { AppShell } from '../components/layout/AppShell';
import { lazyImport } from '../utils/lazyImport';
import { KycRoute } from '../components/KycRoute';

const LoginPage = lazyImport(() => import('../pages/auth/LoginPage'));
const SignupPage = lazyImport(() => import('../pages/auth/SignupPage'));
const DashboardPage = lazyImport(() => import('../pages/DashboardPage'));
const WithdrawPage = lazyImport(() => import('../pages/WithdrawPage'));
const PixPage = lazyImport(() => import('../pages/PixPage'));
const BtcPage = lazyImport(() => import('../pages/BtcPage'));
const PinPage = lazyImport(() => import('../pages/PinPage'));
const HistoryPage = lazyImport(() => import('../pages/HistoryPage'));
const InvestmentPlanPage = lazyImport(() => import('../pages/InvestmentPlanPage'));
const ProfilePage = lazyImport(() => import('../pages/ProfilePage'));
const SettingsPage = lazyImport(() => import('../pages/SettingsPage'));

const AdminDashboard = lazyImport(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazyImport(() => import('../pages/admin/AdminUsers'));
const AdminWallets = lazyImport(() => import('../pages/admin/AdminWallets'));
const AdminPlans = lazyImport(() => import('../pages/admin/AdminPlans'));
const AdminProfile = lazyImport(() => import('../pages/admin/AdminProfile'));
const AdminTransactions = lazyImport(() => import('../pages/admin/AdminTransactions'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Public routes with AppShell */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="withdraw/pix" element={<KycRoute><PixPage /></KycRoute>} />
          <Route path="withdraw/btc" element={<KycRoute><BtcPage /></KycRoute>} />
          <Route path="withdraw/pin" element={<PinPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="invest" element={<InvestmentPlanPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin routes with AdminLayout */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="wallets" element={<AdminWallets />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
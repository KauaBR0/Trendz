/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RouteLoader } from './components/RouteLoader';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home';
import { MarketDetail } from './pages/MarketDetail';

const UserDashboard = lazy(() => import('./pages/UserDashboard').then(module => ({ default: module.UserDashboard })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.AdminDashboard })));
const AdminEvents = lazy(() => import('./pages/admin/Events').then(module => ({ default: module.AdminEvents })));
const AdminMarketWizard = lazy(() => import('./pages/admin/MarketWizard').then(module => ({ default: module.AdminMarketWizard })));
const AdminReviewQueue = lazy(() => import('./pages/admin/ReviewQueue').then(module => ({ default: module.AdminReviewQueue })));
const AdminResolution = lazy(() => import('./pages/admin/Resolution').then(module => ({ default: module.AdminResolution })));
const AdminUsers = lazy(() => import('./pages/admin/Users').then(module => ({ default: module.AdminUsers })));

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="market/:id" element={<MarketDetail />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <LazyPage>
                      <UserDashboard />
                    </LazyPage>
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <LazyPage>
                    <AdminLayout />
                  </LazyPage>
                </ProtectedRoute>
              }
            >
              <Route index element={<LazyPage><AdminDashboard /></LazyPage>} />
              <Route path="events" element={<LazyPage><AdminEvents /></LazyPage>} />
              <Route path="markets" element={<Navigate to="/admin/events" replace />} />
              <Route path="markets/new" element={<LazyPage><AdminMarketWizard /></LazyPage>} />
              <Route path="review" element={<LazyPage><AdminReviewQueue /></LazyPage>} />
              <Route path="resolution" element={<LazyPage><AdminResolution /></LazyPage>} />
              <Route path="users" element={<LazyPage><AdminUsers /></LazyPage>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteLoader />}>{children}</Suspense>;
}

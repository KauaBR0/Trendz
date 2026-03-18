/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home';
import { MarketDetail } from './pages/MarketDetail';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminMarkets } from './pages/admin/Markets';
import { AdminUsers } from './pages/admin/Users';

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
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="markets" element={<AdminMarkets />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

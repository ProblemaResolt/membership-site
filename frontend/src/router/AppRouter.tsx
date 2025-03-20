import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../components/auth/Login';
import { RegisterForm } from '../components/auth/RegisterForm';
import { PasswordReset } from '../components/auth/PasswordReset';
import { EmailVerification } from '../components/auth/EmailVerification';
import { Dashboard } from '../components/profile/Dashboard';
import { Layout } from '../components/layout/Layout';
import { Home } from '../pages/Home';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="reset-password" element={<PasswordReset />} />
          <Route path="verify-email" element={<EmailVerification />} />
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

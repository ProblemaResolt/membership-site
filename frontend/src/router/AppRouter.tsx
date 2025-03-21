import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../components/auth/Login';
import { RegisterForm } from '../components/auth/RegisterForm';
import { PasswordReset } from '../components/auth/PasswordReset';
import { EmailVerification } from '../components/auth/EmailVerification';
import { Dashboard } from '../components/profile/Dashboard';
import { Layout } from '../components/layout/Layout';
import { Home } from '../pages/Home';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PrivateRoute element={<Home />} />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="reset-password" element={<PasswordReset />} />
        <Route path="verify-email" element={<EmailVerification />} />
        <Route path="dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      </Route>
    </Routes>
  );
};

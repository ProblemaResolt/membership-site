import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './router/AppRouter';
import './styles/main.scss';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './router/AppRouter';

function App() {
  const isDev = import.meta.env.DEV && location.hostname === 'localhost';

  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          {isDev && (
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              right: 0, 
              background: '#646cff',
              color: 'white', 
              padding: '8px 12px', 
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              fontSize: '14px',
              borderRadius: '0 0 0 8px'
            }}>
              <div>LOCAL DEV</div>
              <div>Vite {import.meta.env.VITE_VERSION}</div>
              <div>Port: {location.port}</div>
            </div>
          )}
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
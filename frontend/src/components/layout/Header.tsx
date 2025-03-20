import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Membership Site
        </Link>
        
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-indigo-600"
              >
                ダッシュボード
              </Link>
              <Link 
                to="/profile" 
                className="text-gray-600 hover:text-indigo-600"
              >
                {user?.firstName} {user?.lastName}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link 
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                ログイン
              </Link>
              <Link 
                to="/register"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                新規登録
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Membership Site
        </h1>
        
        {!isAuthenticated && (
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-600"
            >
              新規登録
            </Link>
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700"
            >
              ログイン
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

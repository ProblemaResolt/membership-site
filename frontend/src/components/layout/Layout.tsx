import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Layout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="app-layout">
      <header>
        <nav>
          {isAuthenticated ? (
            <>
              <Link to="/profile">プロフィール</Link>
              <Link to="/teams">チーム</Link>
              <Link to="/posts">投稿</Link>
              <button onClick={logout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link to="/login">ログイン</Link>
              <Link to="/register">新規登録</Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TeamManagement } from '../team/TeamManagement';
import { PostList } from '../post/PostList';
import { CreatePost } from '../post/CreatePost';
import { NotificationList } from '../notification/NotificationList';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* プロフィール情報 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">プロフィール</h2>
          <div className="space-y-3">
            <p><span className="font-semibold">ユーザーID:</span> {user?.userId}</p>
            <p><span className="font-semibold">名前:</span> {user?.firstName} {user?.lastName}</p>
            <p><span className="font-semibold">メール:</span> {user?.email}</p>
          </div>
        </div>

        {/* 最近の通知 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">通知</h2>
          <NotificationList />
        </div>

        {/* アクティビティフィード */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">最近の投稿</h2>
          <CreatePost />
          <div className="mt-4">
            <PostList />
          </div>
        </div>
      </div>

      {/* チーム管理セクション */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">チーム管理</h2>
        <TeamManagement />
      </div>
    </div>
  );
};

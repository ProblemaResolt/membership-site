import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';

interface ProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  prefecture: string;
  city: string;
  address: string;
}

export const Profile = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm<ProfileData>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileData) => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setIsEditing(false);
        // プロフィール更新成功のメッセージ
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div className="profile-container">
      <h2>プロフィール</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* フォームフィールド */}
        <div>
          <label>ユーザーID</label>
          <input {...register('userId')} disabled />
        </div>
        {/* その他のフィールド */}
        {isEditing ? (
          <button type="submit">保存</button>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)}>
            編集
          </button>
        )}
      </form>
    </div>
  );
};

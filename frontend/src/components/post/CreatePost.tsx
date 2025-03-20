import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PostFormData {
  content: string;
  teamId?: number;
  visibility: 'public' | 'private' | 'team';
}

export const CreatePost = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PostFormData>({
    content: '',
    visibility: 'public'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証が必要です');
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)  // credentialsを削除
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Post creation failed');
      }

      // 投稿成功時の処理
      setFormData({ content: '', visibility: 'public' });
    } catch (error: any) {
      console.error('Post creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={formData.content}
        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
        placeholder="投稿内容を入力..."
        required
      />
      <select
        value={formData.visibility}
        onChange={(e) => setFormData(prev => ({ 
          ...prev, 
          visibility: e.target.value as PostFormData['visibility']
        }))}
      >
        <option value="public">公開</option>
        <option value="private">非公開</option>
        <option value="team">チームのみ</option>
      </select>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '投稿中...' : '投稿する'}
      </button>
    </form>
  );
};

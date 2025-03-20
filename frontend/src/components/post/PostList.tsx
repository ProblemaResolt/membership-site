import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Post {
  id: number;
  content: string;
  visibility: 'public' | 'private' | 'team';
  createdAt: string;
  user: {
    userId: string;
    firstName: string;
    lastName: string;
  };
}

export const PostList = ({ teamId }: { teamId?: number }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [teamId]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = teamId 
        ? `/api/posts/team/${teamId}`
        : '/api/posts';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="posts-list">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <span>{post.user.firstName} {post.user.lastName}</span>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="post-content">{post.content}</div>
          <div className="post-footer">
            <span className="visibility-badge">{post.visibility}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

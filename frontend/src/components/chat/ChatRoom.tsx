import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
  replies?: Message[];
}

export const ChatRoom = ({ teamId }: { teamId?: number }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [teamId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/team/${teamId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: newMessage,
          teamId
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className="message">
            <p>{message.content}</p>
            {message.replies && message.replies.length > 0 && (
              <div className="replies">
                {message.replies.map(reply => (
                  <p key={reply.id}>{reply.content}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="メッセージを入力..."
        />
        <button type="submit">送信</button>
      </form>
    </div>
  );
};

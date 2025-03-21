import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  content: string;
  userId: number;  // stringからnumberに変更
  userName: string;
  timestamp: number;
}

export const WebSocketChat = ({ teamId }: { teamId?: number }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`ws://localhost:3001?token=${token}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    return () => {
      ws.close();
    };
  }, [teamId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !wsRef.current || !teamId) return;

    wsRef.current.send(JSON.stringify({
      type: 'chat',
      content: message,
      teamId: teamId.toString() // 数値を文字列に変換
    }));
    setMessage('');
  };

  return (
    <div className="websocket-chat">
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.userId === Number(user?.id) ? 'own' : ''}`}>
            <div className="message-header">
              <span className="user-name">{msg.userName}</span>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力..."
        />
        <button type="submit">送信</button>
      </form>
    </div>
  );
};

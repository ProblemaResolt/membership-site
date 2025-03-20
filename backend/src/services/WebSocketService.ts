import { WebSocketServer, WebSocket } from 'ws';
import { Server, IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';

interface WebSocketMessage {
  type: string;
  content: any;
}

class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.init();
  }

  private init() {
    this.wss.on('connection', async (ws, req) => {
      const token = req.url?.split('=')[1];
      if (!token) {
        ws.close();
        return;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        this.clients.set(decoded.userId, ws);

        ws.on('close', () => {
          this.clients.delete(decoded.userId);
        });
      } catch (error) {
        ws.close();
      }
    });
  }

  public sendToUser(userId: string, data: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.send(JSON.stringify(data));
    }
  }

  public broadcast(data: WebSocketMessage): void {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

export default WebSocketService;

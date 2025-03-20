import express, { Request, Response } from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/team.js';
import chatRoutes from './routes/chat.js';
import postRoutes from './routes/post.js';
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import passport from 'passport';
import { createServer } from 'http';
import WebSocketService from './services/WebSocketService.js';
import { getFileUrl, upload } from './services/FileUploadService.js';
import './config/passport.js';
import notificationRouter from './routes/notification';

const app = express();
const port = process.env.PORT || 3001;

const start = async () => {
  try {
    const redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST || 'redis'}:6379`,
      legacyMode: false
    });

    await redisClient.connect();
    console.log('Redis connected');

    // RedisStoreの初期化を修正
    const redisStore = new RedisStore({
      client: redisClient,
      prefix: 'session:'
    });

    app.use(cors());
    app.use(express.json());
    app.use(session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/health', (_req: Request, res: Response) => {
      res.send('healthy');
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/teams', teamRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/notifications', notificationRouter);

    // ファイルアップロード用のルート
    app.post('/api/upload', upload.single('file'), (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      res.json({ url: getFileUrl(req.file.filename) });
    });

    await sequelize.authenticate();
    console.log('Database connected.');
    
    await sequelize.sync();
    console.log('Models synchronized.');

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // WebSocket setup
    const wsService = new WebSocketService(server);
    console.log('WebSocket server initialized');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start().catch(console.error);

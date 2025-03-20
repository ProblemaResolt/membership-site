import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:6379`,
  legacyMode: false
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

await redisClient.connect().catch(console.error);

export default redisClient;

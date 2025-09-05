import Redis from "ioredis";

const reddisClient = new Redis(process.env.UPSTASH_REDIS_REST_URL!, {
  password: process.env.UPSTASH_REDIS_REST_TOKEN,
});
export default reddisClient;

// lib/cache.ts
import NodeCache from "node-cache";
export const cache = new NodeCache({ stdTTL: 300 }); // 30 seconds TTL

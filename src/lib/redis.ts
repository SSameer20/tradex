// lib/cache.ts
import NodeCache from "node-cache";
export const cache = new NodeCache({ stdTTL: 30 }); // 30 seconds TTL

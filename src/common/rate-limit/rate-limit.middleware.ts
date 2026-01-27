import { Injectable, NestMiddleware } from '@nestjs/common';

const rateMap = new Map();

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        const ip = req.ip;
        const now = Date.now();
        const windowMs = 60000;

        if (!rateMap.has(ip)) rateMap.set(ip, []);
        const timestamps = rateMap.get(ip).filter((t: number) => now - t < windowMs);
        timestamps.push(now);
        rateMap.set(ip, timestamps);

        if (timestamps.length > 100) {
            return res.status(429).json({ message: 'Too many requests' });
        }

        next();
    }
}
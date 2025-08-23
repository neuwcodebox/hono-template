import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from '@/env';
import { logger } from '@/logger';

logger.info(`Starting up in ${env.NODE_ENV} mode`);

const app = new Hono();
app.get('/', (c) => c.text('Hi'));

const server = serve(
  {
    fetch: app.fetch,
    hostname: env.HOST,
    port: env.PORT,
  },
  (info) => {
    logger.info(`Server is running at http://${env.HOST}:${info.port}`);
  },
);

const onCloseSignal = () => {
  logger.info('sigint received, shutting down');

  // Force shutdown after timeout
  setTimeout(() => process.exit(1), 10000).unref();

  // Graceful shutdown
  server.close(() => process.exit(0));
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);

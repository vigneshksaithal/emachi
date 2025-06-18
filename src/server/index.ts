import express from 'express';
import { createServer, getServerPort } from '@devvit/server';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

const router = express.Router();

// Simple health check endpoint
router.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', game: 'memory-match' });
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port, () => console.log(`http://localhost:${port}`));
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

// Initialize game endpoint
router.post('/api/init', (req, res) => {
  const { postId } = req.body;
  console.log(`Initializing game for post: ${postId}`);
  res.json({ success: true, message: 'Game initialized' });
});

// Submit game score as a comment
router.post('/api/submit-game-score', async (req, res) => {
  try {
    const { commentText } = req.body;
    
    if (!commentText) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const { reddit, postId } = req;
    
    if (!postId) {
      return res.status(400).json({ success: false, message: 'Post ID not available' });
    }

    // Submit the comment on behalf of the user
    await reddit.submitComment({
      id: postId,
      text: commentText,
      runAs: 'USER',
      userGeneratedContent: { text: commentText }
    });

    res.json({ success: true, message: 'Comment posted successfully' });
  } catch (error) {
    console.error('Error submitting comment:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port, () => console.log(`http://localhost:${port}`));
import { Devvit, Post } from '@devvit/public-api';

// Side effect import to bundle the server. The /index is required for server splitting.
import '../server/index';
import { defineConfig } from '@devvit/server';

defineConfig({
  name: 'Ematchi',
  entry: 'index.html',
  height: 'tall',
  menu: { enable: false },
  http: {
    domains: ['storage.bolt.army'],
  },
  redditAPI: true,
  onMessage: async (event, context) => {
    console.log('Received message:', event);
    
    if (event.type === 'SUBMIT_COMMENT') {
      try {
        const { commentText } = event.data.payload;
        
        console.log('Attempting to submit comment:', commentText);
        console.log('Post ID:', context.postId);
        
        if (!commentText) {
          console.error('No comment text provided');
          return;
        }

        if (!context.postId) {
          console.error('No post ID available in context');
          return;
        }

        // Submit the comment using the current post context
        const comment = await context.reddit.submitComment({
          id: context.postId,
          text: commentText,
        });

        console.log('Comment submitted successfully:', comment.id);
        
        // Send confirmation back to the webview
        context.ui.webView.postMessage('devvit-message', {
          type: 'COMMENT_SUBMITTED',
          success: true,
          commentId: comment.id
        });
        
      } catch (error) {
        console.error('Error submitting comment:', error);
        
        // Send error back to the webview
        context.ui.webView.postMessage('devvit-message', {
          type: 'COMMENT_SUBMITTED',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  },
});

export const Preview: Devvit.BlockComponent<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <zstack width={'100%'} height={'100%'} alignment="center middle">
      <vstack width={'100%'} height={'100%'} alignment="center middle">
        <image
          url="loading.gif"
          description="Loading..."
          height={'140px'}
          width={'140px'}
          imageHeight={'240px'}
          imageWidth={'240px'}
        />
        <spacer size="small" />
        <text maxWidth={`80%`} size="large" weight="bold" alignment="center middle" wrap>
          {text}
        </text>
      </vstack>
    </zstack>
  );
};

// TODO: Remove this when defineConfig allows webhooks before post creation
Devvit.addMenuItem({
  label: 'Ematchi',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;

    let post: Post | undefined;
    try {
      const subreddit = await reddit.getCurrentSubreddit();
      post = await reddit.submitPost({
        title: 'Ematchi',
        subredditName: subreddit.name,
        preview: <Preview />,
      });

      // Initialize the game configuration via API call instead of direct import
      try {
        const response = await fetch('/api/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId: post.id }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to initialize game');
        }
      } catch (initError) {
        console.error('Failed to initialize game:', initError);
        // Continue anyway - the game will initialize on first play
      }

      ui.showToast({ text: 'Created post!' });
      ui.navigateTo(post.url);
    } catch (error) {
      if (post) {
        await post.remove(false);
      }
      if (error instanceof Error) {
        ui.showToast({ text: `Error creating post: ${error.message}` });
      } else {
        ui.showToast({ text: 'Error creating post!' });
      }
    }
  },
});

export default Devvit;
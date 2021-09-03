import { useCallback, useState } from 'react';
import { Post, PostService } from 'rodolfohiok-sdk';

export default function usePosts() {
  const [posts, setPosts] = useState<Post.Paginated>();
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);

  const fetchPosts = useCallback(async (editorId: number) => {
    setLoadingPosts(true);
    try {
      const paginatedPosts = await PostService.getAllPosts({
        editorId,
        showAll: true,
      });
      setPosts(paginatedPosts);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const togglePostStatus = useCallback(async (post: Post.Summary) => {
    setLoadingPublish(true);
    try {
      post.published
        ? await PostService.deactivateExistingPost(post.id)
        : await PostService.publishExistingPost(post.id);
    } finally {
      setLoadingPublish(false);
    }
  }, []);

  return {
    posts,
    loadingPosts,
    loadingPublish,
    fetchPosts,
    togglePostStatus,
  };
}

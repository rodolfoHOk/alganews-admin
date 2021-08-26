import { useCallback, useState } from 'react';
import { Post, PostService } from 'rodolfohiok-sdk';

export default function useLastestPosts() {
  const [posts, setPosts] = useState<Post.Paginated>();

  const fetchPosts = useCallback(() => {
    PostService.getAllPosts({
      sort: ['createdAt', 'desc'],
      page: 0,
      size: 3,
    }).then(setPosts);
  }, []);

  return {
    posts: posts?.content,
    fetchPosts,
  };
}

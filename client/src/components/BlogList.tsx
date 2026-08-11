import { useEffect, useState } from "react";
import * as PostsApi from "../api/posts-api";

type Post = {
  id: number,
  user_id: number,
  title: string,
  content: string,
  is_public: boolean,
  published_date: string | null,
  last_updated_date: string | null,
  post_user: {
    username: string
  }
}

function formatDate(dateString: string | null) {
  if(dateString === null) return dateString;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    PostsApi.getAllPostsApi().then(body => {
      setPosts(body.posts)
    }).catch(error => {
      setError(error);
    })
  }, []);

  if(error) return <div>
    <h1>Error: error.message</h1>
  </div>

  return <div>
    {posts.map(post => { 
      return <ul key={`blog-post-${post.id}`}>
        <li>Title: {post.title}</li>
        <li>From: {post.post_user.username}</li>
        <li>Date: {formatDate(post.published_date)}</li>
      </ul>
    })}
  </div>
}

export default BlogList;
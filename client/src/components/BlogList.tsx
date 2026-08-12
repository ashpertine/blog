import { useEffect, useState } from "react";
import * as PostsApi from "../api/posts-api";
import ErrorBox from "./ErrorBox";

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
  if (dateString === null) return dateString;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });
}

function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    PostsApi.getAllPostsApi().then(body => {
      setPosts(body.posts)
    }).catch(error => {
      setError(error);
    }).finally(() => {
      setLoading(false);
    })
  }, []);

  if (isLoading) return <div>
    <h1>Loading</h1>
  </div>

  if (error) return <ErrorBox message={(error as Error).message}/>

  return <div className="flex flex-wrap gap-4 p-4">
    {posts.map(post => {
      return <div key={`blog-post-${post.id}`} className="bg-gray-600 min-w-xs sm:min-w-lg flex-1 shadow-md p-4 text-gray-200 rounded-sm">
        <h1>{post.title}</h1>
        <p>by: {post.post_user.username}</p>
        <p>Published on: {formatDate(post.published_date)}</p>
        <p>Last updated: {formatDate(post.last_updated_date)}</p>
        <a href="#" className="text-sky-200 underline">Read more</a>
      </div> 
    })}
  </div>
}

export default BlogList;
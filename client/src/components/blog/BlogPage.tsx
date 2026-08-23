import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { getPostByIdApi } from "../../api/posts-api";
import { useParams } from "react-router";
import ErrorBox from "../ErrorBox";
import type { Post } from "../../types/post.ts";

function BlogPage() {
  const { authUser } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(true);
  const { postId } = useParams();

  if (!postId) setError(new Error("Post ID is not defined!"));

  useEffect(() => {
    getPostByIdApi(Number(postId), authUser && authUser.jwt).then(body => {
      const post = body.post as Post;
      setPost(post);
    }).catch(e => {
      setError(e as Error);
    }).finally(() => setLoading(false))
  }, [])

  if (isLoading) return <div>
    <h1 className="text-gray-100">Loading</h1>
  </div>

  if (error) {
    return <ErrorBox message={(error as Error).message} details={null} />
  }

  return post ? <div className="text-slate-100 m-4 flex flex-col items-center">
    <div className="prose lg:prose-xl md:prose-base prose-slate prose-invert">
      <h1 className="text-5xl">{post.title}</h1>
      <p>By: {post.post_user.username}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </div>
  </div> : null;
}

export default BlogPage;

import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { getPostByIdApi } from "../../api/posts-api";
import { useParams } from "react-router";
import ErrorBox from "../ErrorBox";
import CommentList from "../comments/CommentList.tsx";
import type { Post } from "../../types/post.ts";

function BlogPage() {
  const { authUser, loading: authLoading } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(true);
  const { postId } = useParams();

  if (!postId) setError(new Error("Post ID is not defined!"));

  useEffect(() => {
    if(authLoading) return; 
    getPostByIdApi(Number(postId), authUser && authUser.jwt).then(body => {
      const post = body.post as Post;
      setPost(post);
    }).catch(e => {
      setError(e as Error);
    }).finally(() => setLoading(false))
  }, [authLoading])

  if (isLoading) return <div>
    <h1 className="text-gray-100">Loading</h1>
  </div>

  if (error) {
    return <ErrorBox message={(error as Error).message} details={null} />
  }

  return post ? <div className="text-slate-100 flex flex-col gap-2 items-center mx-2 sm:mx-5 md:mx-20 lg:mx-40 xl:mx-72">
    <div className="mt-6 w-full">
      <div className="prose mt-8 lg:prose-xl md:prose-base prose-slate prose-invert max-w-none w-full">
        <h1 className="text-5xl">{post.title}</h1>
        <p>By: {post.post_user.username}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
      <div className="max-w-none w-full mb-6 bg-slate-900 p-4 rounded-lg">
        <CommentList />
      </div>
    </div>
  </div> : null;
}

export default BlogPage;

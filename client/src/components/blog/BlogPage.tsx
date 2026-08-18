import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { getPostByIdApi } from "../../api/posts-api";
import { useParams } from "react-router";
import ErrorBox from "../ErrorBox";

type Post = {
  id: number,
  user_id: number | null,
  title: string,
  content: string,
  is_public: boolean,
  published_date: string,
  last_updated_date: string
}

function BlogPage() {
  const { authUser } = useAuth();
  const [ title, setTitle ] = useState("");
  const [ content, setContent] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(true);
  const { postId } = useParams();

  if(!postId) setError(new Error("Post ID is not defined!"));
  
  useEffect(() => {
    getPostByIdApi(Number(postId), authUser && authUser.jwt ).then(body => {
      const post = body.post as Post;
      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    })
  })
  
  if (isLoading) return <div>
    <h1 className="text-gray-100">Loading</h1>
  </div>

  if (error) {
    return <ErrorBox message={(error as Error).message} details={null} />
  }
  
  return <div className="text-slate-100 m-4">
    <h1 className="text-5xl">{title}</h1>
    <p className="text-lg">{content}</p>
  </div>
}

export default BlogPage;
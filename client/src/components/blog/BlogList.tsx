import { useEffect, useState } from "react";
import * as PostsApi from "../../api/posts-api";
import ErrorBox from "../ErrorBox";
import { useAuth } from "../../contexts/AuthContext";
import BlogListItem from "./BlogListItem";
import { updatePostStatusApi } from "../../api/posts-api";

export type Post = {
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

type BlogListProps = {
  fromUser?: number
  showPublicStatus?: boolean
  showListButtons?: boolean
}

function BlogList({ fromUser, showPublicStatus = false, showListButtons = false }: BlogListProps) {
  const { authUser, hasPermission } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(true);

  function getPosts() {
    if(!fromUser) {
      PostsApi.getAllPostsApi().then(body => {
        setPosts(body.posts)
      }).catch(error => {
        setError(error as Error);
      }).finally(() => {
        setLoading(false);
      })
      return;
    }
    
    PostsApi.getPostsByUserApi(fromUser, authUser && authUser.jwt).then(body => {
      setPosts(body.posts)
    }).catch(error => {
      setError(error as Error);
    }).finally(() => {
      setLoading(false);
    })
    return;
  }

  useEffect(() => {
    getPosts();
  }, [fromUser, authUser]);

  function togglePublicStatus(post: Post) {
    if(!hasPermission("modifyOwnPost")) return;
    
    setLoading(true);
    updatePostStatusApi(post.id, !post.is_public, authUser!.jwt).then(() => getPosts()).catch(error => {
      setError(error as Error);
    }).finally(() => {
      setLoading(false);
    })
  }

  if (isLoading) return <div>
    <h1 className="text-gray-100">Loading</h1>
  </div>

  if (error) {
    return <ErrorBox message={(error as Error).message} details={null} />
  }

  return <div className="flex flex-wrap gap-4">
    {posts.map(post => {
      return <BlogListItem key={`blog-post-${post.id}`} post={post} showPublicStatus={showPublicStatus} showButtons={showListButtons} togglePublicStatus={togglePublicStatus}/>
    })}
  </div>
}

export default BlogList;

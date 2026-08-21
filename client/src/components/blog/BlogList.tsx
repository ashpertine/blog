import { useEffect, useState } from "react";
import * as PostsApi from "../../api/posts-api";
import ErrorBox from "../ErrorBox";
import { useAuth } from "../../contexts/AuthContext";
import BlogListItem from "./BlogListItem";
import { updatePostStatusApi, deletePostApi } from "../../api/posts-api";
import { useNavigate } from "react-router";

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
  showListButtons?: boolean
}

function BlogList({ fromUser, showListButtons = false }: BlogListProps) {
  const { authUser, hasPermission } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const canUpdate = hasPermission("modifyOwnPost");

  function getPosts() {
    if (!fromUser) {
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
    if (!canUpdate) return;

    setLoading(true);
    updatePostStatusApi(post.id, !post.is_public, authUser!.jwt).then(() => getPosts()).catch(error => {
      setError(error as Error);
    }).finally(() => {
      setLoading(false);
    })
  }

  function deletePost(postId: number) {
    if (!canUpdate) return;

    setLoading(true);
    deletePostApi(postId, authUser!.jwt).then(() => getPosts()).catch(error => {
      setError(error as Error);
    }).finally(() => {
      setLoading(false);
    })
  }

  function goToEditPage(postId: number) {
    if (!canUpdate) return;

    return navigate(`/edit/${postId}`);
  }

  if (isLoading) return <div>
    <h1 className="text-gray-100">Loading</h1>
  </div>

  if (error) {
    return <ErrorBox message={(error as Error).message} details={null} />
  }

  return <div className="flex flex-wrap gap-4">
    {posts.map(post => {
      return <BlogListItem key={`blog-post-${post.id}`}
        post={post}
        showButtons={showListButtons}
        canUpdate={canUpdate}
        showPublicStatus={canUpdate}
        togglePublicStatus={togglePublicStatus}
        goToEditPage={goToEditPage}
        deletePost={deletePost}
      />
    })}
  </div>
}

export default BlogList;

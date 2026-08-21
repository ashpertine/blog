import type { Post } from "./BlogList";
import { NavLink } from "react-router";
type BlogListItemProps = {
  post: Post,
  showPublicStatus?: boolean,
  canUpdate?: boolean,
  showButtons?: boolean,
  togglePublicStatus: (post: Post) => void,
  goToEditPage: (postId: number) => void,
  deletePost: (postId: number) => void
}

function BlogListItem({ post, showPublicStatus = false, canUpdate = false, showButtons = false, togglePublicStatus, goToEditPage, deletePost }: BlogListItemProps) {
  function formatDate(dateString: string | null) {
    if (dateString === null) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
  }

  const publicStatus = (isPublic: boolean) => {
    if (showPublicStatus) {
      return isPublic ? <p>Public</p> : <p>Private</p>
    }

    return null;
  }

  const publicButton = (() => {
    if (!canUpdate) return null;
    if (post.is_public) return <button className="bg-red-700 rounded-sm p-2 cursor-pointer hover:bg-red-800" onClick={() => togglePublicStatus(post)}>Make Private</button>;
    return <button className="bg-green-700 rounded-sm p-2 cursor-pointer hover:bg-green-800" onClick={() => togglePublicStatus(post)}>Make Public</button>
  })();

  const editButton = (() => {
    if (!canUpdate) return null;
    return <button className="bg-blue-700 rounded-sm p-2 cursor-pointer hover:bg-blue-800" onClick={() => goToEditPage(post.id)}>Edit</button>
  })();

  const deleteButton = (() => {
    if (!canUpdate) return null;
    return <button className="bg-orange-700 rounded-sm p-2 cursor-pointer hover:bg-orange-800" onClick={() => deletePost(post.id)}>Delete</button>
  })();


  const buttonsPresent = Boolean(publicButton) && Boolean(deleteButton) && Boolean(editButton) && showButtons;
  const buttonsSection = <>
    <hr className="my-2 border-slate-500" />
    <div className="flex flex-wrap gap-2">
      {publicButton}
      {editButton}
      {deleteButton}
    </div>
  </>

  return <div key={`blog-post-${post.id}`} className="bg-slate-600 min-w-xs sm:min-w-lg flex-1 shadow-md p-4 text-gray-200 rounded-sm">
    <h1 className="text-xl">{post.title}</h1>
    <p>by: {post.post_user.username}</p>
    <p>Published on: {formatDate(post.published_date)}</p>
    <p>Last updated: {formatDate(post.last_updated_date)}</p>
    {publicStatus(post.is_public)}
    <NavLink to={`/posts/${post.id}`} className="text-sky-200 underline">Read more</NavLink>
    {buttonsPresent ? buttonsSection : null}
  </div>
}

export default BlogListItem;

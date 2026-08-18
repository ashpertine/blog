import type { Post } from "./BlogList";
import { NavLink } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
type BlogListItemProps = {
  post: Post,
  showPublicStatus?: boolean
  showButtons?: boolean
  togglePublicStatus: (post: Post) => void
}

function BlogListItem({ post, showPublicStatus = false, showButtons = false, togglePublicStatus }: BlogListItemProps) {
  const { hasPermission } = useAuth();
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
    if(showPublicStatus) {
      return isPublic ? <p>Public</p> : <p>Private</p> 
    }
    
    return null;
  }

  const publicButton = (() => {
    if(!hasPermission("modifyOwnPost")) return null;
    if(post.is_public) return <button className="bg-red-700 rounded-sm p-2 cursor-pointer hover:bg-red-800" onClick={() => togglePublicStatus(post)}>Make Private</button>;
    return <button className="bg-green-700 rounded-sm p-2 cursor-pointer hover:bg-green-800" onClick={() => togglePublicStatus(post)}>Make Public</button>
  })();
  

  const buttonsPresent = Boolean(publicButton) && showButtons;
  const buttonsSection = <>
  <hr className="my-2 border-slate-500"/>
  <div className="flex flex-wrap gap-2">
    {publicButton}
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
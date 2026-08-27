import type { Comment } from "./CommentList";
import { parseDate } from "../profile/ProfilePage";
import { useAuth } from "../../contexts/AuthContext";
import { likeCommentApi } from "../../api/posts-api";
import { useState } from "react";
import ErrorBox from "../ErrorBox";

function CommentItem({ comment, userId, showCommentPopup }: { comment: Comment, userId: number | null, showCommentPopup: (replyCommentId: number | null) => unknown }) {
  const { authUser, hasPermission } = useAuth();
  const [likes, setLikes] = useState<number>(comment.likes);
  const [error, setError] = useState<null | Error>(null);

  function likeComment() {
    if (!authUser) return;
    likeCommentApi(comment.id, authUser.jwt).then(() => setLikes(likes + 1)).catch(error => setError(error as Error));
  }

  const showReply = hasPermission("createComment");

  if (error) {
    return <ErrorBox message={error.message} details={null}></ErrorBox>
  }

  return (
    <div className="flex gap-3 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-end gap-2">
          <span className={`text-md font-semibold ${userId === comment.user_id ? 'text-blue-200' : 'text-slate-300'}`}>
            {comment.comment_user.username}
          </span>

          <span className="text-sm text-slate-400">
            {parseDate(comment.created_date)}
          </span>
        </div>

        <p className="mt-1 text-md leading-6 text-slate-100">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-4">
          <button className="text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer" onClick={() => likeComment()}>
            Like
          </button>

          <span className="text-sm text-slate-400">
            {likes} {likes === 1 ? "like" : "likes"}
          </span>

          {showReply ? <button className="text-sm font-medium text-slate-400 hover:text-slate-200 cursor-pointer" onClick={() => showCommentPopup(comment.id)}>
            Reply
          </button> : null}
        </div>
      </div>
    </div>
  );
}
export default CommentItem;

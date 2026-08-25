import type { Comment } from "./CommentList";
import { parseDate } from "../profile/ProfilePage";
function CommentItem({ comment, userId }: { comment: Comment, userId: number | null }) {
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
                    <button className="text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer">
                        Like
                    </button>

                    <span className="text-sm text-slate-400">
                        {comment.likes} {comment.likes === 1 ? "like" : "likes"}
                    </span>

                    <button className="text-sm font-medium text-slate-400 hover:text-slate-200 cursor-pointer">
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
}
export default CommentItem;
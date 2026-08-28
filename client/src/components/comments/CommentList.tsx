import { useState, useEffect, Fragment } from "react";
import { getPostCommentsApi } from "../../api/posts-api";
import { useParams } from "react-router";
import ErrorBox from "../ErrorBox";
import { useAuth } from "../../contexts/AuthContext";
import CommentItem from "./CommentItem";
import CommentPopup from "./CommentPopup.tsx";

export type Comment = {
  id: number,
  user_id: number | null,
  post_id: number,
  content: string,
  likes: number,
  parent_comment_id: number | null,
  created_date: string,
  comment_user: {
    username: string
  },
  liked_by_me: boolean
}

class CommentThread {
  comment: Comment | null
  children: CommentThread[];
  constructor(comment: Comment | null) {
    this.comment = comment;
    this.children = [];
  }

  get isEmpty() {
    return this.children.length === 0;
  }

  initialize(comments: Comment[]) {
    const commentsMap = new Map<number, CommentThread>();
    comments.forEach(comment => {
      commentsMap.set(comment.id, new CommentThread(comment));
    });


    comments.forEach(comment => {
      const thread = commentsMap.get(comment.id);
      if (!thread) throw new Error("error while constructing comment thread");
      const parent = comment.parent_comment_id === null ? this : commentsMap.get(comment.parent_comment_id);
      parent ? parent.children.push(thread) : this.children.push(thread);
    })
  }

  toHTML(userId: number | null = null, showCommentPopup: (replyCommentId: number | null) => unknown, level: number = 0,) {
    if (this.comment) {
      if (this.children.length === 0) {
        return <CommentItem key={`comment-${this.comment.id}`} comment={this.comment} userId={userId} showCommentPopup={showCommentPopup} />
      }

      return (
        <Fragment key={`comment-${this.comment.id}`}>
          <CommentItem comment={this.comment} userId={userId} showCommentPopup={showCommentPopup} />
          <div className="pl-4 border-l-2 border-slate-700 mt-2">
            {this.children.map(thread => thread.toHTML(userId, showCommentPopup, level + 1))}
          </div>
        </Fragment>
      );
    }
    return <div>
      {this.children.map(thread => thread.toHTML(userId, showCommentPopup, level + 1))}
    </div>
  }

  getLength() {
    let count = this.children.length;
    for (const thread of this.children) {
      count += thread.getLength();
    }
    return count;
  }
}


function CommentList() {
  const { authUser, loading: authLoading, hasPermission } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  const [comments, setComments] = useState<CommentThread>(new CommentThread(null));
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null);
  const [commentPopup, setCommentPopup] = useState(false);
  const [isNewComment, setIsNewComment] = useState(false);

  function showCommentPopup(replyCommentId: number | null) {
    setReplyCommentId(replyCommentId);
    setCommentPopup(true);
  }

  function createCommentThread(comments: Comment[]) {
    const root = new CommentThread(null);
    root.initialize(comments);
    return root;
  }

  function getComments() {
    getPostCommentsApi(Number(postId), authUser && authUser.jwt).then(body => {
      const bodyComments: Comment[] = body.comments;
      try {
        const root = createCommentThread(bodyComments);
        setComments(root);
        if (commentPopup) setCommentPopup(false);
      } catch (error) { setError(error as Error) };
    }).catch(e => setError(e as Error)).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!postId) setError(new Error("Post ID is not defined!"));
  }, []);

  useEffect(() => {
    if (authLoading) return;
    getComments();
  }, [authLoading]);

  useEffect(() => {
    if (isNewComment) return;
    setLoading(true);
    getComments();
    return () => setIsNewComment(false);
  }, [isNewComment]);

  if (error) {
    return <ErrorBox message={(error as Error).message} details={null} />
  }

  if (loading) {
    return <div>
      <h1 className="text-gray-100">Loading</h1>
    </div>
  }


  return !comments.isEmpty ? <div>
    <div className="flex justify-between">
      <CommentPopup enabled={commentPopup} setIsNewComment={setIsNewComment} commentId={replyCommentId} postId={Number(postId)} setPopup={setCommentPopup} />
      <h1 className="font-bold text-xl">Comments <span className="text-slate-400">({comments.getLength()})</span></h1>
      {hasPermission("createComment") ? <button className="cursor-pointer rounded-sm text-sm bg-blue-500 p-2 hover:bg-blue-600" onClick={() => showCommentPopup(null)}>New Comment</button> : null}
    </div>
    {comments.toHTML(authUser && authUser.id, showCommentPopup)}
  </div> : <div>
    <h1 className="text-slate-400 font-bold text-2xl">No comments</h1>
  </div>
}

export default CommentList;

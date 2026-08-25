import { useState, useEffect, Fragment } from "react";
import { getPostCommentsApi } from "../../api/posts-api";
import { useParams } from "react-router";
import ErrorBox from "../ErrorBox";
import { useAuth } from "../../contexts/AuthContext";
import CommentItem from "./CommentItem";

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
  }
}

class CommentThread {
  comment: Comment | null
  children: CommentThread[];
  isEmpty: boolean;
  constructor(comment: Comment | null) {
    this.comment = comment;
    this.children = [];
    this.isEmpty = this.children.length === 0;
  }

  setChild(commentThread: CommentThread): void {
    if(!commentThread.comment) return;
    
    if(this.comment === null && commentThread.comment.parent_comment_id === null) {
      this.children.push(commentThread);
    }

    if(this.comment && this.comment.id === commentThread.comment.parent_comment_id){
      this.children.push(commentThread);
    }

    for(const thread of this.children) {
      thread.setChild(commentThread);
    }
  }

  toHTML(userId: number | null = null, level: number = 0) {

    if(this.comment) {
      if(this.children.length === 0 ) {
        return <CommentItem key={`comment-${this.comment.id}`} comment={this.comment} userId={userId} />
      }

    return (
      <Fragment key={`comment-${this.comment.id}`}>
        <CommentItem comment={this.comment} userId={userId} />
        <div className="pl-4 border-l-2 border-slate-700 mt-2">
          {this.children.map(thread => thread.toHTML(userId, level + 1))}
        </div>
      </Fragment>
    );
    } 
    return <div>
      {this.children.map(thread => thread.toHTML(userId, level +1))}
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
  const { authUser, loading: authLoading } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  const [comments, setComments] = useState<CommentThread>(new CommentThread(null));

  if (!postId) setError(new Error("Post ID is not defined!"));

  function createCommentThread(comments: Comment[]) {
    const root = new CommentThread(null);
    for(const comment of comments) {
      const commentThread = new CommentThread(comment);
      root.setChild(commentThread);
    }
    return root;
  }

  useEffect(() => {
    if(authLoading) return;
    getPostCommentsApi(Number(postId), authUser && authUser.jwt).then(body => {
      const bodyComments: Comment[] = body.comments;
      const root = createCommentThread(bodyComments);
      setComments(root);
      createCommentThread(bodyComments);
      setLoading(false);
    }).catch(e => setError(e as Error));
  }, [authLoading]);

  if (error) {
    return <ErrorBox message={(error as Error).message} details={null} />
  }

  if(loading) {
    return <div>
      <h1 className="text-gray-100">Loading</h1>
    </div> 
  }


  return comments.isEmpty ? <div>
    <h1 className="font-bold text-xl">Comments <span className="text-slate-400">({comments.getLength()})</span></h1>
    {comments.toHTML(authUser!.id)}
  </div> : <div>
    <h1 className="text-slate-400 font-bold text-2xl">No comments</h1>
  </div> 
}

export default CommentList;

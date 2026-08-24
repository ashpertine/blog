import { useState, useEffect } from "react";
import { getPostCommentsApi } from "../../api/posts-api";
import { useParams } from "react-router";
import ErrorBox from "../ErrorBox";

type Comment = {
  id: number,
  user_id: number | null,
  post_id: number,
  content: string,
  likes: number,
  parent_comment_id: number | null,
  created_date: string
}

function CommentList() {
  const [error, setError] = useState<Error | null>(null);
  const { postId } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);

  if (!postId) setError(new Error("Post ID is not defined!"));

  useEffect(() => {
    getPostCommentsApi(Number(postId)).then(body => {
      const bodyComments: Comment[] = body.comments;
      setComments(bodyComments);
    }).catch(e => setError(e as Error));
  }, [comments]);

  if (error) {
    return <ErrorBox message={(error as Error).message} details={null} />
  }

  return <div>
    {comments.map(comment =>
      <div key={`comment-${comment.id}`}>
        <p>{comment.content}</p>
        <p>{comment.created_date}</p>
      </div>
    )}
  </div>
}

export default CommentList;

import { useEffect, useState } from "react";
import { createCommentApi } from "../../api/posts-api";
import { useAuth } from "../../contexts/AuthContext";
import ErrorBox from "../ErrorBox";

type CommentPopupProps = {
  enabled: boolean,
  setPopup: React.Dispatch<React.SetStateAction<boolean>>,
  setIsNewComment: React.Dispatch<React.SetStateAction<boolean>>,
  postId: number,
  commentId: number | null,
}

function CommentPopup({ enabled, setPopup, setIsNewComment, postId, commentId } : CommentPopupProps) {
  const { authUser } = useAuth();
  const [error, setError] = useState<null | Error>(null);
  const [content, setContent] = useState("");
  if(enabled) {
    document.body.style.overflow = 'hidden';
  }else {
    document.body.style.overflow = 'auto';
  }

  function handleCommentSend(event: React.SubmitEvent) {
    event.preventDefault();
    if(!authUser) return;

    createCommentApi(postId, commentId, content, authUser.jwt).then(() => setIsNewComment(true)).catch(error => setError(error as Error))
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if(event.key === "Escape") {
        setPopup(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [])

  return enabled ? <div className="flex justify-center items-center fixed inset-0 w-screen h-screen bg-black/60 animate-slide-from-top">
    <div className="flex flex-col w-[40vw] min-w-[300px] h-80 bg-slate-600 p-2 rounded-sm">
      
      <h2 className="flex justify-between items-center text-xl text-slate-100 font-bold">{commentId === null ? "Comment" : "Reply"}
        <button className="cursor-pointer rounded-sm text-sm bg-red-700 p-2" onClick={() => setPopup(false)}>Close</button>
      </h2>

      { error ? <ErrorBox message={error.message} details={null} /> : null}

      <form className="flex-1 mt-2 flex flex-col gap-2 items-end" onSubmit={(event) => handleCommentSend(event)}>
        <textarea className="flex-1 w-full outline-none bg-slate-700 rounded-sm resize-none" name="content" id="comment-content" onChange={(event) => setContent(event.target.value)}></textarea>
        <button type="submit" className="cursor-pointer rounded-sm text-sm bg-blue-500 p-2 hover:bg-blue-600">Send</button>
      </form>
    </div>
  </div> : null;
}

export default CommentPopup;
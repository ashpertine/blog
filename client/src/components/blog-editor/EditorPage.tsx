import Editor from "./Editor.tsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getPostByIdApi } from "../../api/posts-api.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import ErrorBox from "../ErrorBox.tsx";
import type { Post } from "../../types/post.ts";
import { updatePostApi } from "../../api/posts-api.ts";
import NavigationGuard from "../auth/NavigationGuard.tsx";

class Debounce {
  #timeoutId: number | null;
  #delay: number;
  constructor(delay: number) {
    this.#timeoutId = null;
    this.#delay = delay;
  }

  set(func: () => unknown) {
    this.#timeoutId = setTimeout(func, this.#delay);
  }

  cancel() {
    if (this.#timeoutId === null) return;
    clearTimeout(this.#timeoutId);
  }
}


function EditorPage() {
  const { postId } = useParams();
  const { authUser, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!loading) {
      getPostByIdApi(Number(postId), authUser && authUser.jwt).then(body => {
        const post = body.post as Post;
        if (!authUser || authUser.id !== post.user_id) {
          setError(new Error("You do not have permissions to modify this post"));
        }
        setTitle(post.title);
        setContent(post.content);
      }).catch(e => {
        setError(e as Error);
      })
    }
  }, [loading])

  useEffect(() => {
    const delay = new Debounce(500);
    delay.set(updatePost);

    return () => delay.cancel();
  }, [title, content]);


  if (loading) return <div>
    <h1 className="text-gray-100">Loading</h1>
  </div>

  if (error) {
    return <ErrorBox message={(error as Error).message} details={null} />
  }

  function updatePost() {
    if (!authUser) return;
    updatePostApi(Number(postId), title, content, authUser.jwt).catch(e => {
      setError(e as Error);
    });
  }

  return <NavigationGuard toUrl="/">
    <div className="py-4 mx-2 sm:mx-5 md:mx-10 lg:mx-20">
      <div className="flex flex-col gap-2 ">
        <div className="editor-title-container flex flex-col bg-slate-700 rounded-sm p-2">
          <label htmlFor="editor-title" className="text-slate-300 text-bold text-3xl">Title</label>
          <input type="text" id="editor-title" className="text-slate-100 text-lg focus:outline-none" value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <Editor content={content} setContent={setContent} />
      </div>
    </div>
  </NavigationGuard>
}

export default EditorPage;

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'
import EditorMenuBar from "./EditorMenuBar";

function Editor() {
  const editor = useEditor({
    extensions: [StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4]
      }
    })],
    content: "<p>Hello World</p>",
  });

  return (
    <>
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}

export default Editor;

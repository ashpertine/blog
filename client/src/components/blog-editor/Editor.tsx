import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'
import EditorMenuBar from "./EditorMenuBar";
import { Placeholder } from "@tiptap/extensions";

function Editor() {
  const editor = useEditor({
    extensions: [StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4]
      },
      undoRedo: false
    }),
    Placeholder.configure({
      placeholder: "Write something..."
    })
  ],
  });

  return (
    <div className="editor-group bg-slate-700 p-2 w-100 max-w-[800px] rounded-sm">
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor;

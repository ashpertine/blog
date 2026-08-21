import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import type { EditorStateSnapshot } from '@tiptap/react'

/**
 * State selector for the MenuBar component.
 * Extracts the relevant editor state for rendering menu buttons.
 */
export function menuBarStateSelector(ctx: EditorStateSnapshot<Editor>) {
  return {
    // Text formatting
    isBold: ctx.editor.isActive('bold') ?? false,
    canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
    isItalic: ctx.editor.isActive('italic') ?? false,
    canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
    isStrike: ctx.editor.isActive('strike') ?? false,
    canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
    isCode: ctx.editor.isActive('code') ?? false,
    canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
    canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,

    // Block types
    isParagraph: ctx.editor.isActive('paragraph') ?? false,
    isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
    isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
    isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
    isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,

    // Lists and blocks
    isBulletList: ctx.editor.isActive('bulletList') ?? false,
    isOrderedList: ctx.editor.isActive('orderedList') ?? false,
    isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
    isBlockquote: ctx.editor.isActive('blockquote') ?? false,
  }
}

function EditorMenuBar({ editor }: { editor: Editor | null }) {
  const buttonStyle = 'min-w-fit p-[4px] flex-1 bg-blue-500 rounded-sm text-slate-100 hover:bg-blue-600 cursor-pointer disabled:bg-blue-400 border-1 border-blue-600';
  const editorState = useEditorState({
    editor: editor as Editor,
    selector: menuBarStateSelector,
  })

  if (!editor) return null

  return <div className="control-group">
    <div className="button-group flex flex-column gap-1 p-2 overflow-scroll">
            <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${editorState.isHeading1 ? 'is-active' : ''} ${buttonStyle}`}
      >H1</button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${editorState.isHeading2 ? 'is-active' : ''} ${buttonStyle}`}
      >H2</button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${editorState.isHeading2 ? 'is-active' : ''} ${buttonStyle}`}
      >H3</button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${editorState.isHeading4 ? 'is-active' : ''} ${buttonStyle}`}
      >H4</button>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editorState.canBold}
        className={`${editorState.isBold ? 'is-active' : ''} ${buttonStyle}`}
      >Bold</button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editorState.canItalic}
        className={`${editorState.isItalic ? 'is-active' : ''} ${buttonStyle}`}
      >Italic</button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editorState.canStrike}
        className={`${editorState.isStrike ? 'is-active' : ''} ${buttonStyle}`}
      >Strikethrough</button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editorState.canCode}
        className={`${editorState.isCode ? 'is-active' : ''} ${buttonStyle}`}
      >Code</button>

      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className={buttonStyle}
      >Clear Formatting</button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${editorState.isBulletList ? 'is-active' : ''} ${buttonStyle}`}
      >List</button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${editorState.isOrderedList ? 'is-active' : ''} ${buttonStyle}`}
      >Number List</button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${editorState.isCodeBlock ? 'is-active' : ''} ${buttonStyle}`}
      >Code Block</button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${editorState.isBlockquote ? 'is-active' : ''} ${buttonStyle}`}
      >Blockquote</button>

    </div>
  </div>
}

export default EditorMenuBar;




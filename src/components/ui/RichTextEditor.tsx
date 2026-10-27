"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Link as LinkIcon,
  Link2Off,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
        active
          ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="w-px h-5 bg-slate-200 mx-1 shrink-0" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = 200,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { HTMLAttributes: { class: "rte-ul" } },
        orderedList: { HTMLAttributes: { class: "rte-ol" } },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,       // don't navigate on click in editor
        autolink: true,           // auto-detect URLs as you type
        HTMLAttributes: {
          class: "rte-link",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "rte-body focus:outline-none",
        style: `min-height: ${minHeight}px`,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // ── Sync external value changes into the editor ──────────────────────────
  // Tiptap only reads `content` on mount. When initialData changes (e.g. admin
  // opens Edit modal for a different hackathon), we must call setContent().
  // We compare against the current HTML to avoid resetting mid-typing.
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    // "<p></p>" is Tiptap's empty state — treat it as empty string
    const isEmpty = current === "<p></p>" || current === "";
    if (value !== current && !(isEmpty && !value)) {
      editor.commands.setContent(value || "", false); // false = don't trigger onUpdate
    }
  }, [value, editor]);

  const setLink = () => {
    const url = window.prompt("Enter URL:", editor?.getAttributes("link").href || "https://");
    if (url === null) return; // cancelled
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    editor?.chain().focus().setLink({ href: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-slate-100 bg-slate-50/80">
        <ToolbarButton title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Underline (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Align right" onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>
          <AlignRight className="w-3.5 h-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Insert / edit link" onClick={setLink} active={editor.isActive("link")}>
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>
            <Link2Off className="w-3.5 h-3.5" />
          </ToolbarButton>
        )}

        <ToolbarDivider />

        <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-3.5 h-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div className="px-4 py-3 bg-white">
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .rte-body p { margin-bottom: 0.5rem; font-size: 0.875rem; color: #1e293b; line-height: 1.6; }
        .rte-body p:last-child { margin-bottom: 0; }
        .rte-body h1 { font-size: 1.2rem; font-weight: 800; color: #0f172a; margin: 1rem 0 0.4rem; }
        .rte-body h2 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 1rem 0 0.4rem; }
        .rte-body h3 { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0.75rem 0 0.35rem; }
        .rte-body ul, .rte-body ol { padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .rte-body ul { list-style-type: disc; }
        .rte-body ol { list-style-type: decimal; }
        .rte-body li { font-size: 0.875rem; color: #1e293b; line-height: 1.6; margin-bottom: 0.2rem; }
        .rte-body strong { font-weight: 700; }
        .rte-body em { font-style: italic; }
        .rte-body u { text-decoration: underline; }
        .rte-body hr { border: none; border-top: 1px solid #e2e8f0; margin: 0.75rem 0; }
        .rte-body a.rte-link { color: #2563eb; text-decoration: underline; cursor: pointer; }
        .rte-body a.rte-link:hover { color: #1d4ed8; }
        .rte-body .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}

/**
 * Read-only renderer for rich text HTML stored in MongoDB.
 * Links are rendered as real clickable anchors.
 */
export function RichTextDisplay({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  if (!html) return null;
  return (
    <>
      <div
        className={`rte-display ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style>{`
        .rte-display p { margin-bottom: 0.65rem; font-size: 0.9375rem; color: #334155; line-height: 1.75; }
        .rte-display p:last-child { margin-bottom: 0; }
        .rte-display h1 { font-size: 1.35rem; font-weight: 800; color: #0f172a; margin: 1.25rem 0 0.5rem; }
        .rte-display h2 { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 1.25rem 0 0.5rem; }
        .rte-display h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 1rem 0 0.4rem; }
        .rte-display ul, .rte-display ol { padding-left: 1.4rem; margin-bottom: 0.65rem; }
        .rte-display ul { list-style-type: disc; }
        .rte-display ol { list-style-type: decimal; }
        .rte-display li { font-size: 0.9375rem; color: #334155; line-height: 1.75; margin-bottom: 0.25rem; }
        .rte-display strong { font-weight: 700; color: #0f172a; }
        .rte-display em { font-style: italic; }
        .rte-display u { text-decoration: underline; }
        .rte-display hr { border: none; border-top: 1px solid #e2e8f0; margin: 1rem 0; }
        .rte-display a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
          word-break: break-word;
        }
        .rte-display a:hover { color: #1d4ed8; }
      `}</style>
    </>
  );
}

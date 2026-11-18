"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { Extension } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { Plugin } from "@tiptap/pm/state";
import { useFormContext, useWatch } from "react-hook-form";

import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Columns3,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Redo2,
  RemoveFormatting,
  Rows3,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
  X,
  Trash2,
} from "lucide-react";

type TEditorProps = {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  minHeight?: number;
  maxWords?: number;
};

type TFormValues = Record<string, unknown>;

type TToolbarButtonProps = {
  children: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
};

type TTableActionProps = {
  children: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
};

/* =========================================
   Word Counter
========================================= */

const countWords = (text: string): number => {
  const trimmed = text.trim();

  return trimmed ? trimmed.split(/\s+/u).length : 0;
};

/* =========================================
   Word Limit Extension
========================================= */

const WordLimit = Extension.create<{
  getMaxWords: () => number | undefined;
}>({
  name: "wordLimit",

  addOptions() {
    return {
      getMaxWords: () => undefined,
    };
  },

  addProseMirrorPlugins() {
    const { getMaxWords } = this.options;

    return [
      new Plugin({
        filterTransaction(transaction, state) {
          if (!transaction.docChanged) return true;

          const maxWords = getMaxWords();

          if (maxWords === undefined || !Number.isFinite(maxWords)) {
            return true;
          }

          const previousCount = countWords(state.doc.textContent);
          const nextCount = countWords(transaction.doc.textContent);

          // Allow deletion and formatting even if existing content
          // is already above the configured limit.
          if (nextCount <= previousCount) return true;

          return nextCount <= maxWords;
        },
      }),
    ];
  },
});

/* =========================================
   URL Helpers
========================================= */

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeUrl = (value: string): string => {
  const trimmed = value.trim();

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

/* =========================================
   Rich Text Editor
========================================= */

const RichTextEditor = ({
  name,
  label = "Content",
  required = false,
  placeholder = "Start writing your content...",
  minHeight = 450,
  maxWords,
}: TEditorProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const value = useWatch({
    control,
    name,
  });

  const maxWordsRef = useRef(maxWords);

  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [imagePanelOpen, setImagePanelOpen] = useState(false);

  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const [panelError, setPanelError] = useState("");

  // Keep the current limit available to the ProseMirror plugin
  // without recreating the editor whenever maxWords changes.
  useEffect(() => {
    maxWordsRef.current = maxWords;
  }, [maxWords]);

  const wordLimitExtension = useMemo(
    () =>
      WordLimit.configure({
        getMaxWords: () => maxWordsRef.current,
      }),
    [],
  );

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
      }),

      Underline,

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),

      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          loading: "lazy",
          class: "rich-text-image",
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),

      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),

      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "rich-text-table",
        },
      }),

      TableRow,
      TableHeader,
      TableCell,

      Highlight.configure({
        multicolor: false,
      }),

      Subscript,
      Superscript,

      wordLimitExtension,
    ],

    content: typeof value === "string" ? value : "",

    editorProps: {
      attributes: {
        class: "tiptap rich-text-content outline-none",
        spellcheck: "true",
        "aria-label": label,
      },
    },

    onCreate: ({ editor: currentEditor }) => {
      const text = currentEditor.getText();

      setCharacterCount(text.length);
      setWordCount(countWords(text));
    },

    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      const text = currentEditor.getText();

      setValue(name, html, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      setCharacterCount(text.length);
      setWordCount(countWords(text));
    },
  });

  /* =========================================
     Form Value Synchronization
  ========================================= */

  useEffect(() => {
    if (!editor) return;

    const currentValue = typeof value === "string" ? value : "";

    if (currentValue !== editor.getHTML()) {
      editor.commands.setContent(currentValue, {
        emitUpdate: false,
      });
    }

    const text = editor.getText();

    setCharacterCount(text.length);
    setWordCount(countWords(text));
  }, [editor, value]);

  /* =========================================
     Error Handling
  ========================================= */

  const errorValue = errors[name]?.message;

  const errorMessage = typeof errorValue === "string" ? errorValue : undefined;

  /* =========================================
     Panel Helpers
  ========================================= */

  const closePanels = () => {
    setLinkPanelOpen(false);
    setImagePanelOpen(false);
    setPanelError("");
  };

  /* =========================================
     Link Actions
  ========================================= */

  const openLinkPanel = () => {
    if (!editor) return;

    setLinkUrl(editor.getAttributes("link").href ?? "");
    setPanelError("");

    setImagePanelOpen(false);
    setLinkPanelOpen((previous) => !previous);
  };

  const applyLink = () => {
    if (!editor) return;

    const trimmedUrl = linkUrl.trim();

    if (!trimmedUrl) {
      editor.chain().focus().unsetLink().run();
      closePanels();
      return;
    }

    const normalizedUrl = normalizeUrl(trimmedUrl);

    if (!isValidUrl(normalizedUrl)) {
      setPanelError("Enter a valid HTTP or HTTPS URL.");
      return;
    }

    if (editor.state.selection.empty && !editor.isActive("link")) {
      setPanelError("Select some text before adding a link.");
      return;
    }

    editor.chain().focus().setLink({ href: normalizedUrl }).run();

    closePanels();
  };

  const removeLink = () => {
    if (!editor) return;

    editor.chain().focus().unsetLink().run();
    closePanels();
  };

  /* =========================================
     Image Actions
  ========================================= */

  const openImagePanel = () => {
    setPanelError("");

    setLinkPanelOpen(false);
    setImagePanelOpen((previous) => !previous);
  };

  const insertImage = () => {
    if (!editor) return;

    const trimmedUrl = imageUrl.trim();

    if (!trimmedUrl) {
      setPanelError("Enter an image URL.");
      return;
    }

    const normalizedUrl = normalizeUrl(trimmedUrl);

    if (!isValidUrl(normalizedUrl)) {
      setPanelError("Enter a valid HTTP or HTTPS image URL.");
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: normalizedUrl,
        alt: imageAlt.trim() || "Article image",
        title: imageAlt.trim() || undefined,
      })
      .run();

    setImageUrl("");
    setImageAlt("");

    closePanels();
  };

  /* =========================================
     Table Actions
  ========================================= */

  const insertTable = () => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertTable({
        rows: 3,
        cols: 3,
        withHeaderRow: true,
      })
      .run();
  };

  /* =========================================
     Formatting Actions
  ========================================= */

  const clearFormatting = () => {
    if (!editor) return;

    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  /* =========================================
     Loading State
  ========================================= */

  if (!editor) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>

        <div
          style={{ minHeight }}
          className="animate-pulse rounded-xl border border-gray-200 bg-gray-50"
        />
      </div>
    );
  }

  /* =========================================
     Main UI
  ========================================= */

  return (
    <div className="rich-text-editor-wrapper space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between gap-2">
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>

        <span className="text-xs text-gray-400">Rich text editor</span>
      </div>

      <div
        className={`rich-text-editor-frame rounded-xl border bg-white shadow-sm transition-all ${
          errorMessage
            ? "border-red-300 ring-2 ring-red-50"
            : "border-gray-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-50"
        }`}
      >
        {/* =================================
            Main Toolbar
        ================================= */}

        <div className="rich-text-toolbar sticky top-0 z-10 rounded-t-xl border-b border-gray-200 bg-gray-50 p-2">
          <div className="flex flex-wrap items-center gap-1">
            {/* History */}
            <ToolbarButton
              label="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo2 />
            </ToolbarButton>

            <ToolbarButton
              label="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo2 />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Headings */}
            <ToolbarButton
              label="Heading 1"
              active={editor.isActive("heading", { level: 1 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 />
            </ToolbarButton>

            <ToolbarButton
              label="Heading 2"
              active={editor.isActive("heading", { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 />
            </ToolbarButton>

            <ToolbarButton
              label="Heading 3"
              active={editor.isActive("heading", { level: 3 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <Heading3 />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Text Formatting */}
            <ToolbarButton
              label="Bold"
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold />
            </ToolbarButton>

            <ToolbarButton
              label="Italic"
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic />
            </ToolbarButton>

            <ToolbarButton
              label="Underline"
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon />
            </ToolbarButton>

            <ToolbarButton
              label="Strikethrough"
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough />
            </ToolbarButton>

            <ToolbarButton
              label="Highlight"
              active={editor.isActive("highlight")}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              <Highlighter />
            </ToolbarButton>

            <ToolbarButton
              label="Subscript"
              active={editor.isActive("subscript")}
              onClick={() => editor.chain().focus().toggleSubscript().run()}
            >
              <SubscriptIcon />
            </ToolbarButton>

            <ToolbarButton
              label="Superscript"
              active={editor.isActive("superscript")}
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
            >
              <SuperscriptIcon />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists and Quotes */}
            <ToolbarButton
              label="Bullet list"
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List />
            </ToolbarButton>

            <ToolbarButton
              label="Numbered list"
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered />
            </ToolbarButton>

            <ToolbarButton
              label="Blockquote"
              active={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote />
            </ToolbarButton>

            <ToolbarButton
              label="Horizontal divider"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <Minus />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Text Alignment */}
            <ToolbarButton
              label="Align left"
              active={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft />
            </ToolbarButton>

            <ToolbarButton
              label="Align center"
              active={editor.isActive({ textAlign: "center" })}
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenter />
            </ToolbarButton>

            <ToolbarButton
              label="Align right"
              active={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight />
            </ToolbarButton>

            <ToolbarButton
              label="Justify"
              active={editor.isActive({ textAlign: "justify" })}
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
            >
              <AlignJustify />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Insert Content */}
            <ToolbarButton
              label="Insert link"
              active={editor.isActive("link") || linkPanelOpen}
              onClick={openLinkPanel}
            >
              <LinkIcon />
            </ToolbarButton>

            <ToolbarButton
              label="Insert image"
              active={imagePanelOpen}
              onClick={openImagePanel}
            >
              <ImagePlus />
            </ToolbarButton>

            <ToolbarButton
              label="Insert table"
              active={editor.isActive("table")}
              onClick={insertTable}
            >
              <TableIcon />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Clear Formatting */}
            <ToolbarButton label="Clear formatting" onClick={clearFormatting}>
              <RemoveFormatting />
            </ToolbarButton>
          </div>
        </div>

        {/* =================================
            Link Panel
        ================================= */}

        {linkPanelOpen && (
          <div className="border-b border-gray-200 bg-teal-50/60 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Link URL
                </label>

                <input
                  type="url"
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      applyLink();
                    }
                  }}
                  placeholder="https://example.com"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={applyLink}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <Check className="h-4 w-4" />
                  Apply
                </button>

                {editor.isActive("link") && (
                  <button
                    type="button"
                    onClick={removeLink}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 hover:text-red-600"
                  >
                    <Unlink className="h-4 w-4" />
                    Remove
                  </button>
                )}

                <button
                  type="button"
                  onClick={closePanels}
                  aria-label="Close link panel"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {panelError && linkPanelOpen && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {panelError}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Select text in the editor before applying a link.
            </p>
          </div>
        )}

        {/* =================================
            Image Panel
        ================================= */}

        {imagePanelOpen && (
          <div className="border-b border-gray-200 bg-blue-50/50 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Image URL
                </label>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      insertImage();
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Image description (alt text)
                </label>

                <input
                  type="text"
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                  placeholder="Describe the image"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={insertImage}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <ImagePlus className="h-4 w-4" />
                  Insert image
                </button>

                <button
                  type="button"
                  onClick={closePanels}
                  aria-label="Close image panel"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {panelError && imagePanelOpen && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {panelError}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Use a publicly accessible HTTPS image URL.
            </p>
          </div>
        )}

        {/* =================================
            Table Controls
        ================================= */}

        {editor.isActive("table") && (
          <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-2">
            <span className="mr-2 text-xs font-semibold text-gray-500">
              Table
            </span>

            <TableAction
              label="Add column before"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              <Columns3 />
              <Plus />
            </TableAction>

            <TableAction
              label="Add column after"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <Columns3 />
              <Plus />
            </TableAction>

            <TableAction
              label="Delete column"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <Columns3 />
              <Trash2 />
            </TableAction>

            <ToolbarDivider />

            <TableAction
              label="Add row before"
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              <Rows3 />
              <Plus />
            </TableAction>

            <TableAction
              label="Add row after"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              <Rows3 />
              <Plus />
            </TableAction>

            <TableAction
              label="Delete row"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <Rows3 />
              <Trash2 />
            </TableAction>

            <ToolbarDivider />

            <TableAction
              label="Toggle header row"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            >
              Header
            </TableAction>

            <TableAction
              label="Merge cells"
              onClick={() => editor.chain().focus().mergeCells().run()}
            >
              Merge
            </TableAction>

            <TableAction
              label="Split cell"
              onClick={() => editor.chain().focus().splitCell().run()}
            >
              Split
            </TableAction>

            <ToolbarDivider />

            <TableAction
              label="Delete table"
              danger
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              <Trash2 />
              Delete table
            </TableAction>
          </div>
        )}

        {/* =================================
            Editable Content
        ================================= */}

        <div className="rich-text-editor-body" style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>

        {/* =================================
            Footer / Word Count
        ================================= */}

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-xl border-t border-gray-100 bg-gray-50/70 px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>{characterCount.toLocaleString()} characters</span>

            <span
              className={
                maxWords !== undefined && wordCount > maxWords
                  ? "font-semibold text-red-600"
                  : ""
              }
            >
              {wordCount.toLocaleString()}
              {maxWords !== undefined
                ? ` / ${maxWords.toLocaleString()} words`
                : " words"}
            </span>
          </div>

          {maxWords !== undefined && (
            <span
              className={`text-xs ${
                wordCount >= maxWords
                  ? "font-medium text-amber-600"
                  : "text-gray-400"
              }`}
            >
              {wordCount >= maxWords
                ? "Word limit reached"
                : `${(maxWords - wordCount).toLocaleString()} words remaining`}
            </span>
          )}
        </div>
      </div>

      {/* Validation Error */}
      {errorMessage && (
        <p className="text-sm font-medium text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

/* =========================================
   Toolbar Components
========================================= */

const ToolbarButton = ({
  children,
  label,
  onClick,
  active = false,
  disabled = false,
}: TToolbarButtonProps) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={`flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg px-2 transition ${
      active
        ? "bg-teal-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-white hover:text-teal-700 hover:shadow-sm"
    } disabled:cursor-not-allowed disabled:opacity-40`}
  >
    <span className="flex items-center gap-1 [&_svg]:h-4 [&_svg]:w-4">
      {children}
    </span>
  </button>
);

const TableAction = ({
  children,
  label,
  onClick,
  danger = false,
  disabled = false,
}: TTableActionProps) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    disabled={disabled}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium transition [&_svg]:h-3.5 [&_svg]:w-3.5 ${
      danger
        ? "text-red-600 hover:bg-red-50"
        : "text-gray-600 hover:bg-white hover:text-teal-700"
    } disabled:cursor-not-allowed disabled:opacity-40`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => (
  <div className="mx-1 h-6 w-px shrink-0 bg-gray-200" />
);

export default RichTextEditor;

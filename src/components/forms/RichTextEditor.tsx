"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
  X,
} from "lucide-react";

type TEditorProps = {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
};

type TFormValues = Record<string, unknown>;

type TToolbarButtonProps = {
  children: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
};

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const RichTextEditor = ({
  name,
  label = "Content",
  required = false,
  placeholder = "Start writing your article...",
}: TEditorProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const value = watch(name);

  const [characterCount, setCharacterCount] = useState(0);
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [imagePanelOpen, setImagePanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [panelError, setPanelError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
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
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],

    content: typeof value === "string" ? value : "",
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: "tiptap blog-content min-h-[450px] px-5 py-6 sm:px-8",
      },
    },

    onUpdate: ({ editor: currentEditor }) => {
      setValue(name, currentEditor.getHTML(), {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      setCharacterCount(currentEditor.getText().length);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentValue = typeof value === "string" ? value : "";

    if (currentValue !== editor.getHTML()) {
      editor.commands.setContent(currentValue, {
        emitUpdate: false,
      });
    }

    setCharacterCount(editor.getText().length);
  }, [editor, value]);

  const errorMessage =
    typeof errors[name]?.message === "string"
      ? errors[name].message
      : undefined;

  const closePanels = () => {
    setLinkPanelOpen(false);
    setImagePanelOpen(false);
    setPanelError("");
  };

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

    const normalizedUrl = /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;

    if (!isValidUrl(normalizedUrl)) {
      setPanelError("Please enter a valid HTTP or HTTPS URL.");
      return;
    }

    if (editor.state.selection.empty && !editor.isActive("link")) {
      setPanelError("Select some text in the editor before adding a link.");
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

  const openImagePanel = () => {
    setPanelError("");
    setLinkPanelOpen(false);
    setImagePanelOpen((previous) => !previous);
  };

  const insertImage = () => {
    if (!editor) return;

    const trimmedUrl = imageUrl.trim();

    if (!trimmedUrl) {
      setPanelError("Please enter an image URL.");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setPanelError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: trimmedUrl,
        alt: imageAlt.trim() || "Blog image",
        title: imageAlt.trim() || undefined,
      })
      .run();

    setImageUrl("");
    setImageAlt("");
    closePanels();
  };

  if (!editor) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>

        <div className="min-h-[520px] animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div
        className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
          errorMessage
            ? "border-red-300 ring-2 ring-red-50"
            : "border-gray-200 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-50"
        }`}
      >
        {/* Toolbar */}
        <div className="border-b border-gray-200 bg-gray-50/90 p-2.5">
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

            {/* Text formatting */}
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

            <ToolbarDivider />

            {/* Lists and quotes */}
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

            <ToolbarDivider />

            {/* Code */}
            <ToolbarButton
              label="Inline code"
              active={editor.isActive("code")}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code />
            </ToolbarButton>

            <ToolbarButton
              label="Code block"
              active={editor.isActive("codeBlock")}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Code2 />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Alignment */}
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

            <ToolbarDivider />

            {/* Link */}
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

            <ToolbarDivider />

            {/* Clear formatting */}
            <ToolbarButton
              label="Clear formatting"
              onClick={() =>
                editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
            >
              <RemoveFormatting />
            </ToolbarButton>
          </div>
        </div>

        {/* Link panel */}
        {linkPanelOpen && (
          <div className="border-b border-gray-200 bg-teal-50/50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
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
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={applyLink}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <Check className="h-4 w-4" />
                  Apply link
                </button>

                {editor.isActive("link") && (
                  <button
                    type="button"
                    onClick={removeLink}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:text-red-600"
                  >
                    <Unlink className="h-4 w-4" />
                    Remove
                  </button>
                )}

                <button
                  type="button"
                  onClick={closePanels}
                  aria-label="Close link panel"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white hover:text-gray-800"
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
              Select text in your article, enter its destination URL, and apply
              the link.
            </p>
          </div>
        )}

        {/* Image panel */}
        {imagePanelOpen && (
          <div className="border-b border-gray-200 bg-blue-50/40 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
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
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  Image description (alt text)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                  placeholder="Describe the image"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
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
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white hover:text-gray-800"
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
              Paste a publicly accessible image URL. The image will be inserted
              directly into your article.
            </p>
          </div>
        )}

        {/* Editor */}
        <EditorContent editor={editor} />

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-3">
          <p className="text-xs font-medium text-gray-500">
            {characterCount.toLocaleString()} characters
          </p>

          <p className="text-xs text-gray-400">
            Select text to format it · Changes are saved with the form
          </p>
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm font-medium text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

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
    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ${
      active
        ? "bg-teal-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-white hover:text-teal-700 hover:shadow-sm"
    } disabled:cursor-not-allowed disabled:opacity-40`}
  >
    <span className="[&_svg]:h-4 [&_svg]:w-4">{children}</span>
  </button>
);

const ToolbarDivider = () => (
  <div className="mx-1 h-6 w-px shrink-0 bg-gray-200" />
);

export default RichTextEditor;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { PREBUILT_HTML_TEMPLATES, PrebuiltTemplate } from "@/lib/html-templates";
import { HelpTooltip } from "./HelpTooltip";

interface RichHtmlEditorProps {
  initialHtml: string;
  title?: string;
  subtitle?: string;
  onSave: (html: string) => void;
  canEdit?: boolean;
}

export function RichHtmlEditor({
  initialHtml,
  title = "Rich HTML & CKEditor Studio",
  subtitle = "Edit with visual formatting tools or paste custom pre-built HTML templates",
  onSave,
  canEdit = true,
}: RichHtmlEditorProps) {
  const [htmlContent, setHtmlContent] = useState(initialHtml || "");
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [previewTemplate, setPreviewTemplate] = useState<PrebuiltTemplate | null>(null);

  const visualEditorRef = useRef<HTMLDivElement>(null);

  // Synchronize initial content
  useEffect(() => {
    setHtmlContent(initialHtml || "");
    if (visualEditorRef.current && editorMode === "visual") {
      visualEditorRef.current.innerHTML = initialHtml || "";
    }
  }, [initialHtml, editorMode]);

  // Execute formatting command on contentEditable
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!canEdit || editorMode !== "visual") return;
    document.execCommand(command, false, value);
    if (visualEditorRef.current) {
      const updated = visualEditorRef.current.innerHTML;
      setHtmlContent(updated);
      onSave(updated);
    }
  };

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const updated = visualEditorRef.current.innerHTML;
      setHtmlContent(updated);
      onSave(updated);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlContent(val);
    onSave(val);
  };

  const handleSwitchMode = (mode: "visual" | "code") => {
    if (mode === "visual" && visualEditorRef.current) {
      visualEditorRef.current.innerHTML = htmlContent;
    }
    setEditorMode(mode);
  };

  const handleInsertTemplate = (template: PrebuiltTemplate) => {
    setHtmlContent(template.html);
    if (visualEditorRef.current && editorMode === "visual") {
      visualEditorRef.current.innerHTML = template.html;
    }
    onSave(template.html);
    setShowTemplateModal(false);
    setPreviewTemplate(null);
  };

  const categories = ["All", ...new Set(PREBUILT_HTML_TEMPLATES.map((t) => t.category))];

  const filteredTemplates =
    selectedCategory === "All"
      ? PREBUILT_HTML_TEMPLATES
      : PREBUILT_HTML_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
          <HelpTooltip tooltip="Use the toolbar to format visual text, switch to Raw HTML code view to paste custom layouts, or insert 1-click pre-built templates." />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:opacity-95 transition"
            >
              <span>✨ Insert Pre-built Template</span>
            </button>
          </div>
        </div>

        {/* Toolbar & Mode Toggle */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-2.5">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => handleSwitchMode("visual")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                editorMode === "visual" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              👁️ Visual (WYSIWYG)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode("code")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                editorMode === "code" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              &lt;/&gt; Raw HTML Code
            </button>
          </div>

          {/* Visual Formatting Toolbar Buttons (active in Visual mode) */}
          {editorMode === "visual" && (
            <div className="flex flex-wrap items-center gap-1">
              <select
                onChange={(e) => executeCommand("formatBlock", e.target.value)}
                defaultValue="p"
                aria-label="Text format"
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="blockquote">Blockquote</option>
              </select>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              <button
                type="button"
                onClick={() => executeCommand("bold")}
                className="rounded-lg p-1.5 text-xs font-bold hover:bg-slate-200 text-slate-700"
                title="Bold"
              >
                <b>B</b>
              </button>
              <button
                type="button"
                onClick={() => executeCommand("italic")}
                className="rounded-lg p-1.5 text-xs font-serif italic hover:bg-slate-200 text-slate-700"
                title="Italic"
              >
                <i>I</i>
              </button>
              <button
                type="button"
                onClick={() => executeCommand("underline")}
                className="rounded-lg p-1.5 text-xs underline hover:bg-slate-200 text-slate-700"
                title="Underline"
              >
                <u>U</u>
              </button>
              <button
                type="button"
                onClick={() => executeCommand("strikeThrough")}
                className="rounded-lg p-1.5 text-xs line-through hover:bg-slate-200 text-slate-700"
                title="Strikethrough"
              >
                <s>S</s>
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              <button
                type="button"
                onClick={() => executeCommand("justifyLeft")}
                className="rounded-lg p-1.5 text-xs hover:bg-slate-200 text-slate-700"
                title="Align Left"
              >
                ⇤
              </button>
              <button
                type="button"
                onClick={() => executeCommand("justifyCenter")}
                className="rounded-lg p-1.5 text-xs hover:bg-slate-200 text-slate-700"
                title="Align Center"
              >
                ≡
              </button>
              <button
                type="button"
                onClick={() => executeCommand("justifyRight")}
                className="rounded-lg p-1.5 text-xs hover:bg-slate-200 text-slate-700"
                title="Align Right"
              >
                ⇥
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              <button
                type="button"
                onClick={() => executeCommand("insertUnorderedList")}
                className="rounded-lg p-1.5 text-xs hover:bg-slate-200 text-slate-700"
                title="Bullet List"
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => executeCommand("insertOrderedList")}
                className="rounded-lg p-1.5 text-xs hover:bg-slate-200 text-slate-700"
                title="Numbered List"
              >
                1. List
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1" />

              <button
                type="button"
                onClick={() => {
                  const url = prompt("Enter hyperlink destination URL:", "https://");
                  if (url) executeCommand("createLink", url);
                }}
                className="rounded-lg p-1.5 text-xs hover:bg-slate-200 text-slate-700 font-semibold"
                title="Insert Link"
              >
                🔗 Link
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt("Enter image source URL:", "https://");
                  if (url) executeCommand("insertImage", url);
                }}
                className="rounded-lg p-1.5 text-xs hover:bg-slate-200 text-slate-700 font-semibold"
                title="Insert Image"
              >
                🖼️ Image
              </button>
              <button
                type="button"
                onClick={() => executeCommand("insertHorizontalRule")}
                className="rounded-lg p-1.5 text-xs hover:bg-slate-200 text-slate-700"
                title="Horizontal Divider Line"
              >
                ― Line
              </button>
              <button
                type="button"
                onClick={() => executeCommand("removeFormat")}
                className="rounded-lg p-1.5 text-xs hover:bg-slate-200 text-slate-700 text-rose-600 font-semibold"
                title="Clear Formatting"
              >
                Clear 🧹
              </button>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="mt-4">
          {editorMode === "visual" ? (
            <div
              ref={visualEditorRef}
              contentEditable={canEdit}
              onInput={handleVisualInput}
              className="min-h-[400px] max-h-[700px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-sans leading-relaxed"
              style={{ minHeight: "420px" }}
            />
          ) : (
            <textarea
              rows={18}
              disabled={!canEdit}
              value={htmlContent}
              onChange={handleCodeChange}
              placeholder="Paste or write HTML markup here with Tailwind or inline CSS..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-950 p-6 font-mono text-xs text-emerald-400 focus:border-indigo-500 focus:outline-none leading-relaxed"
              style={{ minHeight: "420px" }}
            />
          )}
        </div>
      </div>

      {/* Pre-built Templates Inserter Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">Pre-built HTML Layout Templates</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Insert professionally designed landing pages, pricing cards, FAQs, and syllabi in 1 click
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTemplateModal(false);
                  setPreviewTemplate(null);
                }}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Category Filter */}
            <div className="mt-4 flex flex-wrap gap-2 pb-3 border-b border-slate-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Templates Grid & Preview */}
            <div className="mt-6 grid gap-6 md:grid-cols-12 items-start">
              {/* Template Cards List */}
              <div className="md:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredTemplates.map((template) => {
                  const isSelected = previewTemplate?.id === template.id;
                  return (
                    <div
                      key={template.id}
                      onClick={() => setPreviewTemplate(template)}
                      className={`cursor-pointer rounded-2xl border p-4 transition ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
                          : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{template.name}</h4>
                          <span className="rounded-md bg-slate-200 px-1.5 py-0.2 text-[9px] font-bold text-slate-600 uppercase">
                            {template.category}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">{template.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Template Live Preview & Insert Button */}
              <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-slate-50 p-4 min-h-[400px] flex flex-col justify-between">
                {previewTemplate ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <span className="text-xs font-bold text-slate-700">
                          Template Preview: {previewTemplate.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleInsertTemplate(previewTemplate)}
                          className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-indigo-700"
                        >
                          ✓ Insert This Template
                        </button>
                      </div>

                      {/* Rendered Snippet Preview */}
                      <div className="max-h-[380px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-inner">
                        <div dangerouslySetInnerHTML={{ __html: previewTemplate.html }} />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleInsertTemplate(previewTemplate)}
                        className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-700"
                      >
                        🚀 Apply Template to Page
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center text-slate-400">
                    <span className="text-4xl">👈</span>
                    <p className="text-xs font-semibold mt-2">Select a template on the left to preview it</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

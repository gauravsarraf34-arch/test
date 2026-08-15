"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { Tenant, MediaItem } from "@/types/cms";

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  tenant?: Tenant;
  canEdit?: boolean;
  helpText?: string;
  onChange: (url: string) => void;
  onAddMedia?: (media: MediaItem) => void;
}

export function ImageUploadField({
  label,
  value = "",
  placeholder = "https://... or /uploads/...",
  tenant,
  canEdit = true,
  helpText,
  onChange,
  onAddMedia,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mediaList: MediaItem[] = tenant?.media || [];

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canEdit) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { ok?: boolean; media?: MediaItem; error?: string };

      if (!response.ok || !data.media) {
        throw new Error(data.error || "Upload failed");
      }

      // Update current field value
      onChange(data.media.url);

      // Add to tenant media library if handler provided
      if (onAddMedia && data.media) {
        onAddMedia(data.media);
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700">{label}</label>

        <div className="flex items-center gap-2">
          {/* Direct File Upload Trigger */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={!canEdit || isUploading}
          />
          <button
            type="button"
            disabled={!canEdit || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-2.5 py-1 text-[11px] font-bold text-indigo-700 shadow-2xs transition hover:bg-indigo-100 hover:text-indigo-900 disabled:opacity-50 cursor-pointer"
          >
            <span>{isUploading ? "⏳ Uploading..." : "📁 Upload Image"}</span>
          </button>

          {/* Browse Media Assets Button */}
          {mediaList.length > 0 && (
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => setShowMediaModal(true)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <span>🖼️ Media Gallery ({mediaList.length})</span>
            </button>
          )}

          {/* Clear Button if value exists */}
          {value && canEdit && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
            >
              Clear ✕
            </button>
          )}
        </div>
      </div>

      {/* URL Text Input */}
      <div className="relative">
        <input
          type="text"
          disabled={!canEdit || isUploading}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
        />
      </div>

      {helpText && <p className="text-[10px] text-slate-500">{helpText}</p>}

      {uploadError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-xs font-medium text-rose-700">
          ⚠️ {uploadError}
        </div>
      )}

      {/* Visual Thumbnail Preview */}
      {value && (
        <div className="relative mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-2">
          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
            <img
              src={value}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.opacity = "0.3";
              }}
            />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-xs font-bold text-slate-800 truncate">{value.split("/").pop() || "Image Asset"}</p>
            <p className="text-[10px] font-mono text-slate-500 truncate">{value}</p>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-[11px] font-semibold text-indigo-600 hover:underline"
            >
              Open Full Image ↗
            </a>
          </div>
        </div>
      )}

      {/* Media Gallery Selection Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">🖼️ Select Image from Media Gallery</h3>
                <p className="text-xs text-slate-500">Click any uploaded asset to insert it directly</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="rounded-xl p-1.5 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
              {mediaList.map((media) => (
                <div
                  key={media.id}
                  onClick={() => {
                    onChange(media.url);
                    setShowMediaModal(false);
                  }}
                  className={`group relative cursor-pointer rounded-2xl border p-2 transition hover:scale-102 hover:shadow-md ${
                    value === media.url
                      ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/50"
                      : "border-slate-200 bg-slate-50/50 hover:bg-white"
                  }`}
                >
                  <div className="h-28 w-full overflow-hidden rounded-xl bg-slate-100">
                    <img src={media.url} alt={media.name} className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-1.5 text-[11px] font-bold text-slate-800 truncate">{media.name}</p>
                  <p className="text-[9px] font-mono text-slate-400 truncate">{media.url}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

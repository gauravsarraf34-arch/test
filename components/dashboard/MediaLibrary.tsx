"use client";

import React, { useState, ChangeEvent } from "react";
import { Tenant, MediaItem, Page } from "@/types/cms";
import { HelpTooltip } from "./HelpTooltip";

interface MediaLibraryProps {
  tenant: Tenant;
  activePage: Page;
  canEdit: boolean;
  onUpdateTenant: (updater: (tenant: Tenant) => Tenant) => void;
  onUpdatePage: (updater: (page: Page) => Page) => void;
}

export function MediaLibrary({
  tenant,
  activePage,
  canEdit,
  onUpdateTenant,
  onUpdatePage,
}: MediaLibraryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

      // Add to tenant media
      onUpdateTenant((t) => ({
        ...t,
        media: [data.media!, ...(t.media || [])],
      }));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleUseAsHero = (url: string) => {
    if (!canEdit) return;
    onUpdatePage((p) => ({ ...p, heroImage: url }));
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteMedia = (id: string) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      media: (t.media || []).filter((m) => m.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Media Asset Library ({(tenant.media || []).length})
            </h3>
            <p className="text-xs text-slate-500">
              Upload photos, banners, and logos. Uploaded files are optimized and stored securely.
            </p>
          </div>
          <HelpTooltip tooltip="Upload images to use anywhere across your website pages, hero banners, and cards." />

          {canEdit && (
            <label className="cursor-pointer flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700">
              <span>{isUploading ? "Uploading..." : "📁 Upload New Image"}</span>
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {uploadError && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
            {uploadError}
          </div>
        )}

        {/* Media Grid */}
        <div className="mt-6">
          {(tenant.media || []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
              <span className="text-4xl">🖼️</span>
              <h4 className="mt-2 text-sm font-bold text-slate-800">No Media Uploaded Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Upload your brand logos, office photos, or banners to easily use them in your page builder.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {(tenant.media || []).map((asset) => {
                const isHero = activePage.heroImage === asset.url;
                return (
                  <div
                    key={asset.id}
                    className={`group relative overflow-hidden rounded-2xl border bg-slate-50 transition hover:shadow-md ${
                      isHero ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-200"
                    }`}
                  >
                    <div className="h-36 w-full bg-slate-200 overflow-hidden relative">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      {isHero && (
                        <div className="absolute top-2 left-2 rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                          Current Hero Banner
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="truncate text-xs font-semibold text-slate-800" title={asset.name}>
                        {asset.name}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleUseAsHero(asset.url)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                            isHero
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                        >
                          {isHero ? "✓ Active Hero" : "Set as Hero"}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(asset.url, asset.id)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-100"
                            title="Copy image link"
                          >
                            {copiedId === asset.id ? "Copied!" : "Copy Link"}
                          </button>

                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(asset.id)}
                              className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              title="Delete image"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

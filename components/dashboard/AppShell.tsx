"use client";

import React from "react";
import { UserRole } from "@/types/cms";

interface AppShellProps {
  children: React.ReactNode;
  userName: string;
  userRole: UserRole;
  activeTenantId?: string;
  isSaving: boolean;
  lastSavedTime: Date | null;
  saveError: string | null;
  onSaveNow?: () => void;
  onStartOnboarding: () => void;
  onLogout: () => void;
}

export function AppShell({
  children,
  userName,
  userRole,
  activeTenantId,
  isSaving,
  lastSavedTime,
  saveError,
  onSaveNow,
  onStartOnboarding,
  onLogout,
}: AppShellProps) {
  const roleColors: Record<UserRole, string> = {
    admin: "bg-purple-100 text-purple-800 border-purple-200",
    editor: "bg-blue-100 text-blue-800 border-blue-200",
    designer: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  return (
    <div className="min-h-screen bg-pink-50/20 text-slate-900 antialiased selection:bg-pink-400 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-pink-100/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 via-rose-400 to-pink-400 text-white shadow-md shadow-pink-500/25 font-black text-lg">
              TF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-900">
                  TenantFlow CMS
                </span>
                <span className="rounded-md bg-pink-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-600 border border-pink-200/80">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Multi-tenant Visual Content Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto Save Status Indicator */}
            <div className="hidden sm:flex items-center gap-2">
              {isSaving ? (
                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200">
                  <span className="h-2 w-2 animate-ping rounded-full bg-amber-500" />
                  <span>Saving...</span>
                </div>
              ) : saveError ? (
                <button
                  type="button"
                  onClick={onSaveNow}
                  className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 border border-rose-200 hover:bg-rose-100"
                >
                  <span>⚠️ Retry Save</span>
                </button>
              ) : lastSavedTime ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>
                    Saved {lastSavedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ) : null}
            </div>

            {activeTenantId && (
              <a
                href={`/tenant/${activeTenantId}`}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span>Live Site</span>
                <span className="text-slate-400">↗</span>
              </a>
            )}

            <button
              type="button"
              onClick={onStartOnboarding}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              title="View Guide"
            >
              📖 Guide
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-1 pl-2.5">
              <span className="text-xs font-semibold text-slate-800">{userName}</span>
              <span
                className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${roleColors[userRole]}`}
              >
                {userRole}
              </span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full">{children}</div>
    </div>
  );
}

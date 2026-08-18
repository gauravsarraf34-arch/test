"use client";

import React, { useState } from "react";
import { Tenant, Notice, Program, Service, Statistic } from "@/types/cms";
import { HelpTooltip } from "./HelpTooltip";
import { SectionThemeControl } from "./SectionThemeControl";

interface SpecialBlocksEditorProps {
  tenant: Tenant;
  canEdit: boolean;
  onUpdateTenant: (updater: (tenant: Tenant) => Tenant) => void;
}

type ModuleTab = "notices" | "programs" | "services" | "statistics";

export function SpecialBlocksEditor({ tenant, canEdit, onUpdateTenant }: SpecialBlocksEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<ModuleTab>("notices");

  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // Notice Handlers
  const handleAddNotice = () => {
    if (!canEdit) return;
    const newNotice: Notice = {
      id: generateId("notice"),
      title: "New Official Announcement",
      date: new Date().toISOString().split("T")[0],
      status: "New",
      link: "#",
      isPinned: true,
    };
    onUpdateTenant((t) => ({ ...t, notices: [newNotice, ...(t.notices || [])] }));
  };

  const handleUpdateNotice = (id: string, key: keyof Notice, value: unknown) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      notices: (t.notices || []).map((n) => (n.id === id ? { ...n, [key]: value } : n)),
    }));
  };

  const handleDeleteNotice = (id: string) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      notices: (t.notices || []).filter((n) => n.id !== id),
    }));
  };

  // Program Handlers
  const handleAddProgram = () => {
    if (!canEdit) return;
    const newProg: Program = {
      id: generateId("prog"),
      name: "New Degree or Course",
      description: "Comprehensive program covering foundational to advanced skills.",
      duration: "3 Years",
      eligibility: "High school graduate or equivalent",
      icon: "🎓",
    };
    onUpdateTenant((t) => ({ ...t, programs: [...(t.programs || []), newProg] }));
  };

  const handleUpdateProgram = (id: string, key: keyof Program, value: unknown) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      programs: (t.programs || []).map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    }));
  };

  const handleDeleteProgram = (id: string) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      programs: (t.programs || []).filter((p) => p.id !== id),
    }));
  };

  // Service Handlers
  const handleAddService = () => {
    if (!canEdit) return;
    const newSvc: Service = {
      id: generateId("srv"),
      name: "Campus Facility or Service",
      description: "State of the art support available to all members.",
      icon: "✨",
    };
    onUpdateTenant((t) => ({ ...t, services: [...(t.services || []), newSvc] }));
  };

  const handleUpdateService = (id: string, key: keyof Service, value: unknown) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      services: (t.services || []).map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    }));
  };

  const handleDeleteService = (id: string) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      services: (t.services || []).filter((s) => s.id !== id),
    }));
  };

  // Stat Handlers
  const handleAddStat = () => {
    if (!canEdit) return;
    const newStat: Statistic = {
      id: generateId("stat"),
      label: "Active Members",
      value: "500+",
      icon: "👥",
    };
    onUpdateTenant((t) => ({ ...t, statistics: [...(t.statistics || []), newStat] }));
  };

  const handleUpdateStat = (id: string, key: keyof Statistic, value: unknown) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      statistics: (t.statistics || []).map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    }));
  };

  const handleDeleteStat = (id: string) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      statistics: (t.statistics || []).filter((s) => s.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Module Selector Bar */}
      <div className="rounded-3xl border border-pink-100/80 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Domain Modules & News</h3>
            <p className="text-xs text-slate-500">Manage notices, course catalogs, service offerings, and stats</p>
          </div>
          <HelpTooltip tooltip="These rich modules render directly on your tenant landing page below the hero content." />
        </div>

        {/* Tabs */}
        <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          {[
            { id: "notices", label: "📢 Notices & News", count: tenant.notices?.length || 0 },
            { id: "programs", label: "🎓 Programs & Courses", count: tenant.programs?.length || 0 },
            { id: "services", label: "⚡ Services & Amenities", count: tenant.services?.length || 0 },
            { id: "statistics", label: "📊 Key Metrics", count: tenant.statistics?.length || 0 },
          ].map((tab) => {
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as ModuleTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm shadow-pink-500/25"
                    : "bg-slate-50 text-slate-600 hover:bg-pink-50/40 hover:text-pink-700"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? "bg-white/20 text-white font-bold" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* NOTICES TAB */}
        {activeSubTab === "notices" && (
          <div className="mt-5 space-y-4">
            {/* Notices Module Color Theme */}
            <SectionThemeControl
              title="Notices & News Module"
              theme={tenant.modulesTheme?.notices}
              tenant={tenant}
              canEdit={canEdit}
              onChange={(theme) =>
                onUpdateTenant((t) => ({
                  ...t,
                  modulesTheme: { ...(t.modulesTheme || {}), notices: theme },
                }))
              }
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Announcement Feed</span>
              {canEdit && (
                <button
                  type="button"
                  onClick={handleAddNotice}
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 px-3 py-1.5 text-xs font-bold text-white shadow-pink-500/25 hover:from-pink-600 hover:to-rose-500"
                >
                  + Add Notice
                </button>
              )}
            </div>

            {(tenant.notices || []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-pink-200 p-6 text-center text-xs text-slate-500">
                No notices published yet.
              </div>
            ) : (
              (tenant.notices || []).map((notice) => (
                <div key={notice.id} className="rounded-2xl border border-pink-100 bg-pink-50/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={notice.title}
                        onChange={(e) => handleUpdateNotice(notice.id, "title", e.target.value)}
                        placeholder="Notice headline..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold focus:border-pink-500 focus:outline-none"
                      />
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <input
                          type="date"
                          disabled={!canEdit}
                          value={notice.date}
                          onChange={(e) => handleUpdateNotice(notice.id, "date", e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs"
                        />
                        <select
                          disabled={!canEdit}
                          value={notice.status}
                          onChange={(e) => handleUpdateNotice(notice.id, "status", e.target.value)}
                          className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold"
                        >
                          <option value="New">New</option>
                          <option value="Updated">Updated</option>
                          <option value="Regular">Regular</option>
                        </select>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={!canEdit}
                            checked={notice.isPinned}
                            onChange={(e) => handleUpdateNotice(notice.id, "isPinned", e.target.checked)}
                            className="rounded text-pink-600 focus:ring-pink-500"
                          />
                          <span>Pin to Top 📌</span>
                        </label>
                      </div>
                    </div>

                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PROGRAMS TAB */}
        {activeSubTab === "programs" && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Course & Degree Offerings</span>
              {canEdit && (
                <button
                  type="button"
                  onClick={handleAddProgram}
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 px-3 py-1.5 text-xs font-bold text-white shadow-pink-500/25 hover:from-pink-600 hover:to-rose-500"
                >
                  + Add Program
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(tenant.programs || []).map((prog) => (
                <div key={prog.id} className="rounded-2xl border border-pink-100 bg-pink-50/20 p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <input
                      type="text"
                      maxLength={2}
                      disabled={!canEdit}
                      value={prog.icon || "🎓"}
                      onChange={(e) => handleUpdateProgram(prog.id, "icon", e.target.value)}
                      className="w-10 rounded-lg border border-slate-200 bg-white py-0.5 text-center text-base"
                    />
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleDeleteProgram(prog.id)}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      disabled={!canEdit}
                      value={prog.name}
                      onChange={(e) => handleUpdateProgram(prog.id, "name", e.target.value)}
                      placeholder="Program name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold focus:border-pink-500 focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      disabled={!canEdit}
                      value={prog.description}
                      onChange={(e) => handleUpdateProgram(prog.id, "description", e.target.value)}
                      placeholder="Course description"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-pink-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={prog.duration}
                        onChange={(e) => handleUpdateProgram(prog.id, "duration", e.target.value)}
                        placeholder="Duration (e.g. 4 Years)"
                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs focus:border-pink-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={prog.eligibility}
                        onChange={(e) => handleUpdateProgram(prog.id, "eligibility", e.target.value)}
                        placeholder="Eligibility"
                        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeSubTab === "services" && (
          <div className="mt-5 space-y-4">
            {/* Services Module Color Theme */}
            <SectionThemeControl
              title="Services & Amenities Module"
              theme={tenant.modulesTheme?.services}
              tenant={tenant}
              canEdit={canEdit}
              onChange={(theme) =>
                onUpdateTenant((t) => ({
                  ...t,
                  modulesTheme: { ...(t.modulesTheme || {}), services: theme },
                }))
              }
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Services & Amenities</span>
              {canEdit && (
                <button
                  type="button"
                  onClick={handleAddService}
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 px-3 py-1.5 text-xs font-bold text-white shadow-pink-500/25 hover:from-pink-600 hover:to-rose-500"
                >
                  + Add Service
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(tenant.services || []).map((svc) => (
                <div key={svc.id} className="rounded-2xl border border-pink-100 bg-pink-50/20 p-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <input
                      type="text"
                      maxLength={2}
                      disabled={!canEdit}
                      value={svc.icon}
                      onChange={(e) => handleUpdateService(svc.id, "icon", e.target.value)}
                      className="w-10 rounded-lg border border-slate-200 bg-white py-0.5 text-center text-base"
                    />
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleDeleteService(svc.id)}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    <input
                      type="text"
                      disabled={!canEdit}
                      value={svc.name}
                      onChange={(e) => handleUpdateService(svc.id, "name", e.target.value)}
                      placeholder="Service name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold focus:border-pink-500 focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      disabled={!canEdit}
                      value={svc.description}
                      onChange={(e) => handleUpdateService(svc.id, "description", e.target.value)}
                      placeholder="Description"
                      className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATISTICS TAB */}
        {activeSubTab === "statistics" && (
          <div className="mt-5 space-y-4">
            {/* Statistics Module Color Theme */}
            <SectionThemeControl
              title="Key Metrics & Statistics Module"
              theme={tenant.modulesTheme?.statistics}
              tenant={tenant}
              canEdit={canEdit}
              onChange={(theme) =>
                onUpdateTenant((t) => ({
                  ...t,
                  modulesTheme: { ...(t.modulesTheme || {}), statistics: theme },
                }))
              }
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Key Statistics & Impact Numbers</span>
              {canEdit && (
                <button
                  type="button"
                  onClick={handleAddStat}
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 px-3 py-1.5 text-xs font-bold text-white shadow-pink-500/25 hover:from-pink-600 hover:to-rose-500"
                >
                  + Add Metric
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {(tenant.statistics || []).map((stat) => (
                <div key={stat.id} className="rounded-2xl border border-pink-100 bg-pink-50/20 p-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <input
                      type="text"
                      maxLength={2}
                      disabled={!canEdit}
                      value={stat.icon || "📊"}
                      onChange={(e) => handleUpdateStat(stat.id, "icon", e.target.value)}
                      className="w-9 rounded-lg border border-slate-200 bg-white py-0.5 text-center text-sm"
                    />
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleDeleteStat(stat.id)}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    <input
                      type="text"
                      disabled={!canEdit}
                      value={stat.value}
                      onChange={(e) => handleUpdateStat(stat.id, "value", e.target.value)}
                      placeholder="500+"
                      className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-sm font-black text-pink-600 focus:border-pink-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      disabled={!canEdit}
                      value={stat.label}
                      onChange={(e) => handleUpdateStat(stat.id, "label", e.target.value)}
                      placeholder="Metric label"
                      className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Tenant, Page, User, UserRole, MenuItem } from "@/types/cms";
import { AppShell } from "@/components/dashboard/AppShell";
import { TenantSidebar, DashboardTab } from "@/components/dashboard/TenantSidebar";
import { PageEditor } from "@/components/dashboard/PageEditor";
import { ThemeEditor } from "@/components/dashboard/ThemeEditor";
import { SectionEditorList } from "@/components/dashboard/SectionEditorList";
import { SpecialBlocksEditor } from "@/components/dashboard/SpecialBlocksEditor";
import { MediaLibrary } from "@/components/dashboard/MediaLibrary";
import { LivePreviewPane } from "@/components/dashboard/LivePreviewPane";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";
import { CreateTenantModal } from "@/components/dashboard/CreateTenantModal";
import { NavigationMenuEditor } from "@/components/dashboard/NavigationMenuEditor";
import { HeaderFooterEditor } from "@/components/dashboard/HeaderFooterEditor";

const generateId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const emptyPage = (): Page => ({
  id: generateId("page"),
  slug: "new-page",
  title: "New Landing Page",
  description: "Custom landing page description",
  heroTitle: "Build Experiences That People Remember",
  heroSubtitle: "Describe your core value proposition clearly and compellingly.",
  buttonText: "Get Started Now",
  heroImage:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  published: false,
  sections: [
    {
      id: generateId("sec"),
      type: "features",
      title: "Key Advantages",
      description: "Everything you need to deliver world-class digital results.",
      content: "",
      items: ["Rapid deployment", "Cloud-native performance", "Brand customizability"],
    },
  ],
});

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<DashboardTab>("editor");

  const [auth, setAuth] = useState<{ userId: string | null; isAuthenticated: boolean }>({
    userId: null,
    isAuthenticated: false,
  });

  const [loginForm, setLoginForm] = useState({ email: "admin@tenantflow.io", password: "admin123" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCreateTenantModal, setShowCreateTenantModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isInitialMount = useRef(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Bootstrap session and data
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const sessionRes = await fetch("/api/session");
        const sessionData = (await sessionRes.json()) as { user?: { id: string } | null };

        if (sessionData.user) {
          setAuth({ userId: sessionData.user.id, isAuthenticated: true });

          const tenantRes = await fetch("/api/tenants");
          if (tenantRes.ok) {
            const tenantData = (await tenantRes.json()) as { tenants: Tenant[]; users: User[] };
            if (tenantData.tenants && tenantData.tenants.length > 0) {
              setTenants(tenantData.tenants);
              setUsers(tenantData.users);
              setSelectedTenantId(tenantData.tenants[0].id);
              setSelectedPageId(tenantData.tenants[0].pages[0]?.id || "");
            }
          }
        }
      } catch (err) {
        console.error("Bootstrap error:", err);
      } finally {
        setHasLoaded(true);
      }
    };

    bootstrap();
  }, []);

  const currentUser = useMemo(
    () => users.find((user) => user.id === auth.userId) || null,
    [auth.userId, users]
  );

  const accessibleTenants = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "admin") return tenants;
    return tenants.filter((tenant) => currentUser.tenantIds?.includes(tenant.id));
  }, [currentUser, tenants]);

  // Keep selection aligned
  useEffect(() => {
    if (!accessibleTenants.length) {
      setSelectedTenantId("");
      setSelectedPageId("");
      return;
    }

    const tenantExists = accessibleTenants.some((t) => t.id === selectedTenantId);
    if (!tenantExists) {
      setSelectedTenantId(accessibleTenants[0].id);
      setSelectedPageId(accessibleTenants[0].pages[0]?.id || "");
    }
  }, [accessibleTenants, selectedTenantId]);

  const activeTenant = useMemo(
    () =>
      tenants.find((t) => t.id === selectedTenantId) ||
      accessibleTenants[0] ||
      null,
    [accessibleTenants, selectedTenantId, tenants]
  );

  const activePage = useMemo(
    () =>
      activeTenant?.pages.find((p) => p.id === selectedPageId) ||
      activeTenant?.pages[0] ||
      null,
    [activeTenant, selectedPageId]
  );

  const canEditTenant = useCallback(
    (tenantId: string) => {
      if (!currentUser) return false;
      return currentUser.role === "admin" || (currentUser.tenantIds && currentUser.tenantIds.includes(tenantId));
    },
    [currentUser]
  );

  // Sync to server with 600ms debounce
  const syncToServer = useCallback(
    async (tenantsToSync: Tenant[], usersToSync: User[]) => {
      setIsSaving(true);
      setSaveError(null);
      try {
        const res = await fetch("/api/tenants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenants: tenantsToSync, users: usersToSync }),
        });
        if (!res.ok) throw new Error("Sync failed");
        setLastSavedTime(new Date());
      } catch (err: unknown) {
        setSaveError(err instanceof Error ? err.message : "Failed to save changes");
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!hasLoaded || !auth.isAuthenticated) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    setIsSaving(true);
    syncTimeoutRef.current = setTimeout(() => {
      syncToServer(tenants, users);
    }, 600);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [tenants, users, auth.isAuthenticated, hasLoaded, syncToServer]);

  // Tenant & Page Updaters
  const updateTenant = useCallback(
    (updater: (tenant: Tenant) => Tenant) => {
      if (!activeTenant || !canEditTenant(activeTenant.id)) return;
      setTenants((current) =>
        current.map((t) => (t.id === activeTenant.id ? updater(t) : t))
      );
    },
    [activeTenant, canEditTenant]
  );

  const updatePage = useCallback(
    (updater: (page: Page) => Page) => {
      if (!activeTenant || !activePage || !canEditTenant(activeTenant.id)) return;
      setTenants((current) =>
        current.map((t) => {
          if (t.id !== activeTenant.id) return t;
          return {
            ...t,
            pages: t.pages.map((p) => (p.id === activePage.id ? updater(p) : p)),
          };
        })
      );
    },
    [activeTenant, activePage, canEditTenant]
  );

  // Authentication Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      let data: { error?: string; user?: User } = {};
      try {
        data = (await response.json()) as { error?: string; user?: User };
      } catch {
        // If response is not valid JSON
        setLoginError(`Server returned status ${response.status}. Please check deployment.`);
        setIsLoggingIn(false);
        return;
      }

      if (!response.ok || !data.user) {
        setLoginError(data.error || "Invalid login credentials.");
        setIsLoggingIn(false);
        return;
      }

      setAuth({ userId: data.user.id, isAuthenticated: true });

      const tenantResponse = await fetch("/api/tenants");
      if (tenantResponse.ok) {
        const tenantData = (await tenantResponse.json()) as { tenants: Tenant[]; users: User[] };
        if (tenantData.tenants?.length) {
          setTenants(tenantData.tenants);
          setUsers(tenantData.users);
          setSelectedTenantId(tenantData.tenants[0].id);
          setSelectedPageId(tenantData.tenants[0].pages[0]?.id || "");
        }
      }
    } catch (err: unknown) {
      console.error("Login request failed:", err);
      setLoginError("Failed to communicate with CMS server.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      // Ignore
    }
    setAuth({ userId: null, isAuthenticated: false });
    setLoginError("");
  };

  // Add new tenant modal trigger
  const handleAddTenant = () => {
    if (!currentUser || currentUser.role !== "admin") return;
    setShowCreateTenantModal(true);
  };

  const handleCreateTenant = (newTenant: Tenant) => {
    setTenants((cur) => [newTenant, ...cur]);
    if (currentUser) {
      setUsers((cur) =>
        cur.map((u) =>
          u.id === currentUser.id
            ? { ...u, tenantIds: [...new Set([...(u.tenantIds || []), newTenant.id])] }
            : u
        )
      );
    }
    setSelectedTenantId(newTenant.id);
    setSelectedPageId(newTenant.pages[0]?.id || "");
    setActiveTab("editor");
  };

  // Add new page
  const handleAddPage = () => {
    if (!activeTenant || !canEditTenant(activeTenant.id)) return;
    const newPg = emptyPage();
    setTenants((cur) =>
      cur.map((t) => (t.id === activeTenant.id ? { ...t, pages: [...t.pages, newPg] } : t))
    );
    setSelectedPageId(newPg.id);
    setActiveTab("editor");
  };

  // Delete page
  const handleDeletePage = (pageId: string) => {
    if (!activeTenant || !canEditTenant(activeTenant.id) || activeTenant.pages.length <= 1) return;

    const cleanNavigation = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item) => item.pageId !== pageId)
        .map((item) => ({
          ...item,
          children: item.children ? cleanNavigation(item.children) : [],
        }));
    };

    const updatedTenants = tenants.map((t) => {
      if (t.id !== activeTenant.id) return t;
      return {
        ...t,
        pages: t.pages.filter((p) => p.id !== pageId),
        navigation: t.navigation ? cleanNavigation(t.navigation) : [],
      };
    });

    setTenants(updatedTenants);

    const remaining = activeTenant.pages.filter((p) => p.id !== pageId);
    if (remaining.length > 0) {
      setSelectedPageId(remaining[0].id);
    }

    // Immediately persist deletion
    syncToServer(updatedTenants, users);
  };

  // Delete Tenant
  const handleDeleteTenant = (tenantIdToDelete: string) => {
    if (!currentUser || currentUser.role !== "admin") return;
    if (tenants.length <= 1) {
      alert("Cannot remove the only remaining brand. At least one brand is required.");
      return;
    }

    const targetTenant = tenants.find((t) => t.id === tenantIdToDelete);
    if (!targetTenant) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${targetTenant.name}" (${targetTenant.domain}) and all its pages? This action cannot be undone.`
    );
    if (!confirmed) return;

    const updatedTenants = tenants.filter((t) => t.id !== tenantIdToDelete);
    const updatedUsers = users.map((u) => ({
      ...u,
      tenantIds: (u.tenantIds || []).filter((id) => id !== tenantIdToDelete),
    }));

    setTenants(updatedTenants);
    setUsers(updatedUsers);

    // Switch active selection if the deleted tenant was currently selected
    if (selectedTenantId === tenantIdToDelete) {
      const nextTenant = updatedTenants[0];
      setSelectedTenantId(nextTenant.id);
      setSelectedPageId(nextTenant.pages[0]?.id || "");
    }

    // Immediately persist deletion
    syncToServer(updatedTenants, updatedUsers);
  };

  // Toggle tenant live status
  const handleToggleTenantStatus = () => {
    if (!activeTenant || !canEditTenant(activeTenant.id)) return;
    updateTenant((t) => ({
      ...t,
      status: t.status === "Active" ? "Draft" : "Active",
    }));
  };

  // Loading Screen
  if (!hasLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900 text-white font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-400 border-t-transparent" />
          <p className="text-sm font-semibold tracking-wide text-pink-100">Loading Control Center...</p>
        </div>
      </main>
    );
  }

  // Login Screen
  if (!auth.isAuthenticated || !currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-[#230f1c] to-[#1c0b16] px-4 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-pink-950/60 bg-slate-900/90 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
          {/* Left Hero */}
          <div className="relative flex flex-col justify-between p-8 sm:p-12 text-white bg-gradient-to-tr from-[#2d1222] via-[#200a18] to-[#150510] border-b border-pink-900/30 lg:border-b-0 lg:border-r">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-pink-300">
                <span>TenantFlow CMS 2.0</span>
              </div>
              <h2 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Empower your teams to build, edit, and publish in real time.
              </h2>
              <p className="mt-4 text-sm text-pink-200/70 leading-relaxed">
                A multi-tenant visual studio with live device preview, instant theme customization, and zero-code page building.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="text-2xl">🏢</span>
                <div>
                  <p className="text-xs font-bold text-white">Multi-Brand Isolation</p>
                  <p className="text-[11px] text-pink-200/60">Manage multiple domains & themes from one panel</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-xs font-bold text-white">Instant Viewport Simulation</p>
                  <p className="text-[11px] text-pink-200/60">Desktop, Tablet, and Mobile simulators</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="flex flex-col justify-center p-8 sm:p-12 bg-white text-slate-900">
            <div className="mb-6">
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Sign in to Studio</h3>
              <p className="mt-1 text-xs text-slate-500">Access your organization's CMS workspace</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((cur) => ({ ...cur, email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((cur) => ({ ...cur, password: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              {loginError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/25 transition hover:from-pink-600 hover:to-rose-500 disabled:opacity-50"
              >
                {isLoggingIn ? "Signing in..." : "Enter Workspace →"}
              </button>
            </form>

            {/* Demo Accounts List */}
            <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50/40 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-pink-600 font-semibold">
                Quick Demo Credentials
              </p>
              <div className="mt-2 space-y-1 text-xs text-slate-700">
                <div
                  className="cursor-pointer p-1.5 rounded-lg hover:bg-white transition flex justify-between"
                  onClick={() => setLoginForm({ email: "admin@tenantflow.io", password: "admin123" })}
                >
                  <span className="font-semibold">👑 Admin:</span>
                  <span className="font-mono text-[11px] text-pink-700">admin@tenantflow.io / admin123</span>
                </div>
                <div
                  className="cursor-pointer p-1.5 rounded-lg hover:bg-white transition flex justify-between"
                  onClick={() => setLoginForm({ email: "editor@tenantflow.io", password: "editor123" })}
                >
                  <span className="font-semibold">✍️ Editor:</span>
                  <span className="font-mono text-[11px] text-pink-700">editor@tenantflow.io / editor123</span>
                </div>
                <div
                  className="cursor-pointer p-1.5 rounded-lg hover:bg-white transition flex justify-between"
                  onClick={() => setLoginForm({ email: "designer@tenantflow.io", password: "designer123" })}
                >
                  <span className="font-semibold">🎨 Designer:</span>
                  <span className="font-mono text-[11px] text-pink-700">designer@tenantflow.io / designer123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // When no tenant is available
  if (!activeTenant || !activePage) {
    return (
      <AppShell
        userName={currentUser.name}
        userRole={currentUser.role as UserRole}
        activeTenantId={undefined}
        isSaving={isSaving}
        lastSavedTime={lastSavedTime}
        saveError={saveError}
        onSaveNow={() => syncToServer(tenants, users)}
        onStartOnboarding={() => setShowOnboarding(true)}
        onLogout={handleLogout}
      >
        <main className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-500">
          <p className="text-lg font-bold text-slate-800">No Brands Available</p>
          <p className="text-sm mt-1">Please ask your system administrator to assign tenant permissions.</p>
        </main>
      </AppShell>
    );
  }

  const canEdit = canEditTenant(activeTenant.id);

  return (
    <AppShell
      userName={currentUser.name}
      userRole={currentUser.role as UserRole}
      activeTenantId={activeTenant.id}
      isSaving={isSaving}
      lastSavedTime={lastSavedTime}
      saveError={saveError}
      onSaveNow={() => syncToServer(tenants, users)}
      onStartOnboarding={() => setShowOnboarding(true)}
      onLogout={handleLogout}
    >
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] items-start">
          {/* Left Sidebar */}
          <TenantSidebar
            tenants={accessibleTenants}
            activeTenant={activeTenant}
            selectedPageId={activePage.id}
            activeTab={activeTab}
            userRole={currentUser.role as UserRole}
            canEdit={canEdit}
            onSelectTenant={(id) => {
              setSelectedTenantId(id);
              const t = tenants.find((item) => item.id === id);
              if (t && t.pages.length > 0) {
                setSelectedPageId(t.pages[0].id);
              }
            }}
            onSelectPage={(id) => setSelectedPageId(id)}
            onSelectTab={(tab) => setActiveTab(tab)}
            onAddTenant={handleAddTenant}
            onDeleteTenant={handleDeleteTenant}
            onAddPage={handleAddPage}
            onDeletePage={handleDeletePage}
            onToggleTenantStatus={handleToggleTenantStatus}
          />

          {/* Main Studio Area */}
          <div className="min-w-0 space-y-6">
            {activeTab === "editor" && (
              <>
                <PageEditor
                  page={activePage}
                  tenant={activeTenant}
                  canEdit={canEdit}
                  onUpdatePage={updatePage}
                  onUpdateTenant={updateTenant}
                  onOpenMediaLibrary={() => setActiveTab("media")}
                />
                <SectionEditorList
                  page={activePage}
                  tenant={activeTenant}
                  canEdit={canEdit}
                  onUpdatePage={updatePage}
                />
              </>
            )}

            {activeTab === "menu" && (
              <NavigationMenuEditor
                tenant={activeTenant}
                canEdit={canEdit}
                onUpdateTenant={updateTenant}
                onSelectPage={(pageId) => {
                  setSelectedPageId(pageId);
                  setActiveTab("editor");
                }}
                onAddPage={handleAddPage}
                onDeletePage={handleDeletePage}
              />
            )}

            {activeTab === "headerfooter" && (
              <HeaderFooterEditor
                tenant={activeTenant}
                canEdit={canEdit}
                onUpdateTenant={updateTenant}
              />
            )}

            {activeTab === "theme" && (
              <ThemeEditor
                tenant={activeTenant}
                canEdit={canEdit}
                canDelete={currentUser.role === "admin" && accessibleTenants.length > 1}
                onUpdateTenant={updateTenant}
                onDeleteTenant={handleDeleteTenant}
              />
            )}

            {activeTab === "blocks" && (
              <SpecialBlocksEditor
                tenant={activeTenant}
                canEdit={canEdit}
                onUpdateTenant={updateTenant}
              />
            )}

            {activeTab === "media" && (
              <MediaLibrary
                tenant={activeTenant}
                activePage={activePage}
                canEdit={canEdit}
                onUpdateTenant={updateTenant}
                onUpdatePage={updatePage}
              />
            )}

            {activeTab === "preview" && (
              <LivePreviewPane tenant={activeTenant} page={activePage} />
            )}
          </div>
        </div>
      </main>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <CreateTenantModal
        isOpen={showCreateTenantModal}
        onClose={() => setShowCreateTenantModal(false)}
        onCreateTenant={handleCreateTenant}
      />
    </AppShell>
  );
}

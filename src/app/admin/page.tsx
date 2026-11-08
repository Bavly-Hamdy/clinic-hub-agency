"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import WorksManager from "@/components/admin/WorksManager";
import ServicesManager from "@/components/admin/ServicesManager";
import SettingsManager from "@/components/admin/SettingsManager";
import { Button } from "@/components/admin/ui";
import { ArrowUpLeft, LogOut, Loader2 } from "lucide-react";

type Tab = "works" | "services" | "settings";

const tabs: { id: Tab; label: string; index: string }[] = [
  { id: "works", label: "معرض الأعمال", index: "01" },
  { id: "services", label: "الخدمات والمطبوعات", index: "02" },
  { id: "settings", label: "بيانات التواصل والربط", index: "03" },
];

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [tab, setTab] = useState<Tab>("works");

  useEffect(() => {
    let active = true;

    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.replace("/admin/login");

      setAdminEmail(data.session.user?.email || "");

      const { data: isAdmin, error: adminErr } = await supabase.rpc("is_admin");
      if (active) {
        if (adminErr) {
          console.error("Admin verification error:", adminErr);
        }
        setState(isAdmin ? "ok" : "denied");
      }
    }
    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/admin/login");
      else setAdminEmail(session.user?.email || "");
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (state === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink text-stone-500 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-brass" />
          <span>AUTHENTICATING SESSION…</span>
        </div>
      </main>
    );
  }

  if (state === "denied") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-stone-200">
        <div className="max-w-md w-full border border-red-900/60 bg-[#141214] p-8 space-y-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-red-400 block mb-1">
              ACCESS RESTRICTED
            </span>
            <h2 className="text-xl font-bold text-paper">الحساب غير مصرح له بالإدارة</h2>
            <p className="text-xs text-stone-400 mt-2 font-mono leading-relaxed">
              الحساب الحالي ({adminEmail || "غير محدد"}) ليس مسجلاً في جدول admins بقاعدة البيانات.
            </p>
          </div>
          <Button variant="danger" onClick={logout} className="w-full">
            تسجيل الخروج
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink text-stone-200 pb-24">
      {/* Studio Administrative Masthead */}
      <header className="border-b border-white/10 bg-[#0e0e11]">
        <div className="mx-auto flex max-w-page items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-baseline gap-4">
            <span className="font-display font-bold text-lg text-paper tracking-wider" dir="ltr">
              CLINIC HUB
            </span>
            <span className="font-mono text-xs text-brass uppercase">/ STUDIO MANAGER</span>
            {adminEmail && (
              <span className="hidden sm:inline font-mono text-[11px] text-stone-500" dir="ltr">
                ({adminEmail})
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-stone-400 hover:text-white transition-colors"
            >
              <span>معاينة الموقع</span>
              <ArrowUpLeft className="h-3 w-3" />
            </a>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-stone-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-3 w-3" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="mx-auto flex max-w-page gap-8 px-6 md:px-10" role="tablist">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`flex items-baseline gap-2 border-b-2 py-3 text-xs font-mono transition-colors ${
                  active
                    ? "border-brass text-brass font-bold"
                    : "border-transparent text-stone-500 hover:text-stone-300"
                }`}
              >
                <span className="text-[10px] opacity-60">[{t.index}]</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Admin Content Area */}
      <div className="mx-auto max-w-page px-6 pt-10 md:px-10">
        {tab === "works" && <WorksManager />}
        {tab === "services" && <ServicesManager />}
        {tab === "settings" && <SettingsManager />}
      </div>
    </main>
  );
}

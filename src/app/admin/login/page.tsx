"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Field, Input, Notice } from "@/components/admin/ui";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [failCount, setFailCount] = useState(0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (failCount >= 5) {
      setError("تم تجاوز عدد المحاولات المسموح بها مؤقتاً. يرجى الانتظار دقيقة.");
      return;
    }

    setBusy(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setFailCount((prev) => prev + 1);
        setError("بيانات الدخول غير صحيحة. تحقق من الإيميل وكلمة المرور.");
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال. تحقق من اتصال الإنترنت.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-ink px-6 text-stone-200">
      <div className="w-full max-w-sm">
        {/* Back Link */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-stone-500 hover:text-stone-300 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>العودة للموقع الرئيسي</span>
          </a>
        </div>

        {/* Studio Box */}
        <div className="border border-stone-800 bg-[#121215] p-8 shadow-2xl">
          <div className="border-b border-stone-800 pb-5 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-brass block mb-1">
              PORTAL ACCESS
            </span>
            <h1 className="font-display text-xl font-bold text-paper tracking-wider" dir="ltr">
              CLINIC HUB
            </h1>
            <p className="text-xs text-stone-400 font-light mt-0.5">
              لوحة إدارة محتوى وأعمال العيادات
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <Notice kind="error" onClose={() => setError("")}>
                {error}
              </Notice>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <Field label="البريد الإلكتروني للأدمن">
              <Input
                dir="ltr"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@clinichub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-mono text-xs"
              />
            </Field>

            <Field label="كلمة المرور">
              <div className="relative">
                <Input
                  dir="ltr"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-mono text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-3 text-stone-500 hover:text-white transition-colors"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </Field>

            <Button
              type="submit"
              variant="gold"
              loading={busy}
              className="w-full py-3 mt-3"
            >
              دخول لوحة التحكم
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-800/80 text-center">
            <span className="font-mono text-[10px] text-stone-400">
              SUPABASE ROW LEVEL SECURITY PROTECTED
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

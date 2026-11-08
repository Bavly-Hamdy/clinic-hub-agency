"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SettingsInputSchema } from "@/lib/validation";
import { Button, Field, Input, Notice } from "./ui";

export default function SettingsManager() {
  const [form, setForm] = useState<{ whatsapp: string; instagram: string; email: string }>({
    whatsapp: "",
    instagram: "",
    email: "",
  });
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase
      .from("settings")
      .select("whatsapp,instagram,email")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (data) {
          setForm({
            whatsapp: data.whatsapp || "",
            instagram: data.instagram || "",
            email: data.email || "",
          });
        }
        if (error) setMsg({ kind: "error", text: error.message });
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const parsed = SettingsInputSchema.safeParse(form);
    if (!parsed.success) {
      return setMsg({ kind: "error", text: parsed.error.issues[0]?.message || "بيانات غير صالحة" });
    }

    setBusy(true);
    try {
      const payload = parsed.data;
      const cleanEmail = payload.email || "";
      const { error } = await supabase.from("settings").upsert({
        id: 1,
        whatsapp: payload.whatsapp,
        instagram: payload.instagram,
        email: cleanEmail,
      });

      if (error) throw error;
      setForm({
        whatsapp: payload.whatsapp,
        instagram: payload.instagram,
        email: cleanEmail,
      });
      setMsg({
        kind: "ok",
        text: "تم حفظ وتحديث بيانات التواصل بنجاح. تظهر التغييرات في الموقع خلال دقيقة واحدة.",
      });
    } catch (err) {
      setMsg({
        kind: "error",
        text: err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الإعدادات.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="border border-stone-800 bg-[#121215] p-6 sm:p-8">
        <div className="pb-4 border-b border-stone-800 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-brass block">
            CHANNELS CONFIGURATION
          </span>
          <h2 className="text-lg font-bold text-paper">بيانات التواصل والربط العام</h2>
          <p className="text-xs text-stone-400 font-light mt-0.5">
            هذه البيانات تُستخدم لربط أزرار الواتساب وانستجرام والبريد عبر كامل الموقع.
          </p>
        </div>

        {msg && (
          <div className="mb-6">
            <Notice kind={msg.kind} onClose={() => setMsg(null)}>
              {msg.text}
            </Notice>
          </div>
        )}

        <form onSubmit={save} className="space-y-6">
          <Field
            label="رقم واتساب المعتمد"
            hint="الصيغة الدولية للأرقام بدون +"
          >
            <Input
              dir="ltr"
              inputMode="numeric"
              placeholder="201012345678"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="font-mono"
            />
            <p className="font-mono text-[11px] text-stone-500 mt-1">
              مصر: 201000000000 — السعودية: 966500000000
            </p>
          </Field>

          <Field
            label="حساب انستجرام"
            hint="اسم المستخدم فقط"
          >
            <Input
              dir="ltr"
              placeholder="clinichub.agency"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              className="font-mono"
            />
          </Field>

          <Field label="البريد الإلكتروني للوكالة">
            <Input
              dir="ltr"
              type="email"
              placeholder="contact@clinichub.agency"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="font-mono"
            />
          </Field>

          <Button type="submit" variant="gold" loading={busy} className="w-full py-3 mt-2">
            حفظ إعدادات القنوات
          </Button>
        </form>
      </div>
    </div>
  );
}

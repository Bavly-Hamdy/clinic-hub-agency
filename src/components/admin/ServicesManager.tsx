"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Service } from "@/lib/types";
import { ServiceInputSchema } from "@/lib/validation";
import { Button, Field, Input, Notice, Textarea, ConfirmModal } from "./ui";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

const empty = { title: "", description: "", sort_order: 0, is_active: true };

export default function ServicesManager() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) setMsg({ kind: "error", text: error.message });
    else setItems((data as Service[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reset = () => {
    setForm(empty);
    setEditId(null);
  };

  const handleEditClick = (s: Service) => {
    setEditId(s.id);
    setForm({
      title: s.title,
      description: s.description || "",
      sort_order: s.sort_order,
      is_active: s.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const parsed = ServiceInputSchema.safeParse(form);
    if (!parsed.success) {
      return setMsg({ kind: "error", text: parsed.error.issues[0]?.message || "بيانات غير صالحة" });
    }

    setBusy(true);
    try {
      const payload = parsed.data;
      const { error } = editId
        ? await supabase.from("services").update(payload).eq("id", editId)
        : await supabase.from("services").insert(payload);

      if (error) throw error;
      setMsg({ kind: "ok", text: editId ? "تم حفظ التعديل." : "تمت إضافة الخدمة بنجاح." });
      reset();
      load();
    } catch (err) {
      setMsg({
        kind: "error",
        text: err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الخدمة.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function confirmRemove() {
    if (!deleteTarget) return;
    const s = deleteTarget;
    setDeleteTarget(null);
    setBusy(true);
    try {
      const { error } = await supabase.from("services").delete().eq("id", s.id);
      if (error) throw error;
      setMsg({ kind: "ok", text: `تم حذف خدمة "${s.title}" بنجاح.` });
      load();
    } catch (err) {
      setMsg({
        kind: "error",
        text: err instanceof Error ? err.message : "فشل حذف الخدمة من قاعدة البيانات.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function toggle(s: Service) {
    const { error } = await supabase.from("services").update({ is_active: !s.is_active }).eq("id", s.id);
    if (error) return setMsg({ kind: "error", text: error.message });
    load();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 items-start">
      {/* Service Form */}
      <div className="lg:col-span-5 border border-stone-800 bg-[#121215] p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-brass block">
              {editId ? "MODIFY SERVICE" : "NEW PRACTICE SCOPE"}
            </span>
            <h2 className="text-lg font-bold text-paper">
              {editId ? "تعديل الخدمة الطبية" : "إضافة خدمة طبية جديدة"}
            </h2>
          </div>
          {editId && (
            <button onClick={reset} className="font-mono text-xs text-stone-400 hover:text-white">
              [إلغاء]
            </button>
          )}
        </div>

        {msg && (
          <div className="mb-6">
            <Notice kind={msg.kind} onClose={() => setMsg(null)}>
              {msg.text}
            </Notice>
          </div>
        )}

        <form onSubmit={save} className="space-y-5">
          <Field label="اسم الخدمة">
            <Input
              placeholder="مثال: تصميم روشتات طبية مخصصة"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <Field label="وصف موجز للخدمة">
            <Textarea
              placeholder="وصف مختصر لمزايا الخدمة وتفاصيلها للأطباء والمراكز..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="الترتيب (الأصغر يظهر أولاً)">
              <Input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </Field>

            <Field label="حالة التفعيل">
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-stone-300">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="accent-brass"
                  />
                  <span>تفعيل في الموقع</span>
                </label>
              </div>
            </Field>
          </div>

          <Button type="submit" variant="gold" loading={busy} className="w-full py-3 mt-2">
            {editId ? "حفظ التعديلات" : "إضافة الخدمة"}
          </Button>
        </form>
      </div>

      {/* Services List */}
      <div className="lg:col-span-7 space-y-4">
        <div className="border-b border-stone-800 pb-4">
          <span className="font-mono text-[10px] text-brass uppercase">DISCIPLINES REGISTER</span>
          <h3 className="text-lg font-bold text-paper">الخدمات المتاحة ({items.length})</h3>
        </div>

        {items.length === 0 ? (
          <div className="border border-stone-800 p-12 text-center bg-stone-900/20">
            <p className="font-mono text-xs text-stone-500">لم يتم تسجيل خدمات حتى الآن.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-800 border border-stone-800 bg-[#121215]">
            {items.map((s) => (
              <div
                key={s.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  s.is_active ? "hover:bg-white/[0.015]" : "opacity-40 bg-black/40"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-brass">
                      [#{s.sort_order}]
                    </span>
                    <h4 className="text-base font-bold text-paper">{s.title}</h4>
                    <span className="font-mono text-[10px] text-stone-500">
                      {s.is_active ? "(نشط)" : "(معطل)"}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 font-light max-w-xl leading-relaxed">
                    {s.description || "بدون وصف إضافي."}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => toggle(s)}
                    className="text-stone-400 hover:text-white"
                  >
                    {s.is_active ? "[تعطيل]" : "[تفعيل]"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEditClick(s)}
                    className="text-stone-400 hover:text-brass"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(s)}
                    className="text-stone-400 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="تأكيد حذف الخدمة"
        message={`هل أنت متأكد من حذف خدمة "${deleteTarget?.title}"؟ ستبقى الأعمال المرتبطة بها مسجلة بدون تصنيف.`}
        confirmLabel="حذف الخدمة"
        onConfirm={confirmRemove}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

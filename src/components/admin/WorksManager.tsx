"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { Service, Work } from "@/lib/types";
import {
  WorkInputSchema,
  validateImageFile,
  generateSafeStoragePath,
} from "@/lib/validation";
import { Button, Field, Input, Notice, Select, ConfirmModal } from "./ui";
import { UploadCloud, Trash2, Edit, Eye, EyeOff, Search, RefreshCw } from "lucide-react";

const BUCKET = "works";

const empty = {
  title: "",
  clinic_name: "",
  service_id: "",
  sort_order: 0,
  is_published: true,
};

export default function WorksManager() {
  const [works, setWorks] = useState<Work[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState<Work | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const [w, s] = await Promise.all([
      supabase.from("works").select("*").order("sort_order").order("created_at", { ascending: false }),
      supabase.from("services").select("*").order("sort_order"),
    ]);
    if (w.error) setMsg({ kind: "error", text: w.error.message });
    else setWorks((w.data as Work[]) ?? []);
    if (s.data) setServices(s.data as Service[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const reset = () => {
    setForm(empty);
    setFile(null);
    setEditing(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEditClick = (w: Work) => {
    setEditing(w);
    setForm({
      title: w.title,
      clinic_name: w.clinic_name || "",
      service_id: w.service_id || "",
      sort_order: w.sort_order,
      is_published: w.is_published,
    });
    setFile(null);
    setPreview(w.image_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const check = validateImageFile(selected);
    if (!check.ok) {
      setMsg({ kind: "error", text: check.error || "الملف غير صالح" });
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setMsg(null);
    setFile(selected);
  };

  async function upload(f: File) {
    const path = generateSafeStoragePath(f);
    const { error } = await supabase.storage.from(BUCKET).upload(path, f, {
      cacheControl: "31536000",
      contentType: f.type,
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { path, url: data.publicUrl };
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const parsed = WorkInputSchema.safeParse(form);
    if (!parsed.success) {
      return setMsg({ kind: "error", text: parsed.error.issues[0]?.message || "بيانات غير صالحة" });
    }

    if (!editing && !file) {
      return setMsg({ kind: "error", text: "يجب اختيار صورة للعمل الجديد." });
    }

    if (file) {
      const check = validateImageFile(file);
      if (!check.ok) return setMsg({ kind: "error", text: check.error || "الملف غير صالح" });
    }

    setBusy(true);
    try {
      const base = parsed.data;

      if (editing) {
        let extra = {};
        if (file) {
          const up = await upload(file);
          extra = { image_url: up.url, image_path: up.path };
        }
        const { error } = await supabase.from("works").update({ ...base, ...extra }).eq("id", editing.id);
        if (error) throw error;
        if (file && editing.image_path) {
          await supabase.storage.from(BUCKET).remove([editing.image_path]);
        }
        setMsg({ kind: "ok", text: "تم تحديث بيانات العمل بنجاح." });
      } else {
        const up = await upload(file as File);
        const { error } = await supabase.from("works").insert({
          ...base,
          image_url: up.url,
          image_path: up.path,
        });
        if (error) {
          await supabase.storage.from(BUCKET).remove([up.path]);
          throw error;
        }
        setMsg({ kind: "ok", text: "تم نشر العمل في المعرض بنجاح." });
      }

      reset();
      load();
    } catch (err) {
      setMsg({
        kind: "error",
        text: err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء الحفظ.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function confirmRemove() {
    if (!deleteTarget) return;
    const w = deleteTarget;
    setDeleteTarget(null);
    setBusy(true);
    try {
      const { error } = await supabase.from("works").delete().eq("id", w.id);
      if (error) throw error;
      if (w.image_path) {
        await supabase.storage.from(BUCKET).remove([w.image_path]);
      }
      setMsg({ kind: "ok", text: `تم حذف العمل "${w.title}" نهائياً.` });
      load();
    } catch (err) {
      setMsg({
        kind: "error",
        text: err instanceof Error ? err.message : "فشل حذف العمل من قاعدة البيانات.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function toggle(w: Work) {
    const { error } = await supabase.from("works").update({ is_published: !w.is_published }).eq("id", w.id);
    if (error) return setMsg({ kind: "error", text: error.message });
    load();
  }

  const filteredWorks = useMemo(() => {
    if (!search.trim()) return works;
    const q = search.toLowerCase();
    return works.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        (w.clinic_name && w.clinic_name.toLowerCase().includes(q))
    );
  }, [search, works]);

  const serviceName = (id: string | null) =>
    services.find((s) => s.id === id)?.title ?? "بدون خدمة محددة";

  return (
    <div className="grid gap-10 lg:grid-cols-12 items-start">
      {/* Work Form */}
      <div className="lg:col-span-5 border border-stone-800 bg-[#121215] p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-brass block">
              {editing ? "MODIFY ENTRY" : "NEW WORK SPECIMEN"}
            </span>
            <h2 className="text-lg font-bold text-paper">
              {editing ? "تعديل العمل الحالي" : "إضافة عمل طبي جديد"}
            </h2>
          </div>
          {editing && (
            <button
              onClick={reset}
              className="font-mono text-xs text-stone-400 hover:text-white"
            >
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
          <Field label="صورة العمل (PNG, JPG, WebP - أقصى حد 8MB)">
            <div
              onClick={() => fileRef.current?.click()}
              className="border border-dashed border-stone-700 bg-stone-900/50 p-6 text-center cursor-pointer transition-colors hover:border-brass"
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={handleFileChange}
                className="hidden"
              />

              {preview ? (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="معاينة"
                    className="mx-auto max-h-48 object-contain"
                  />
                  <p className="mt-3 font-mono text-[11px] text-brass">
                    [اضغط لتغيير الصورة المحددة]
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <UploadCloud className="h-6 w-6 text-stone-500 mx-auto mb-2" />
                  <p className="text-xs font-mono text-stone-300">
                    اضغط لاختيار صورة العمل أو اسحبها هنا
                  </p>
                  <p className="font-mono text-[10px] text-stone-500">
                    JPG, PNG, WebP (MAX 8MB)
                  </p>
                </div>
              )}
            </div>
          </Field>

          <Field label="عنوان العمل">
            <Input
              placeholder="مثال: روشتة دكتور أحمد — جلدية وتجميل"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <Field label="اسم العيادة / المركز">
            <Input
              placeholder="مثال: عيادات النخبة التخصصية"
              value={form.clinic_name}
              onChange={(e) => setForm({ ...form, clinic_name: e.target.value })}
            />
          </Field>

          <Field label="الخدمة المرتبطة">
            <Select
              value={form.service_id}
              onChange={(e) => setForm({ ...form, service_id: e.target.value })}
            >
              <option value="">(بدون تصنيف محدد)</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="الترتيب في العرض">
              <Input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </Field>

            <Field label="حالة النشر">
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-stone-300">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="accent-brass"
                  />
                  <span>نشر فوري في المعرض</span>
                </label>
              </div>
            </Field>
          </div>

          <Button
            type="submit"
            variant="gold"
            loading={busy}
            className="w-full py-3 mt-2"
          >
            {editing ? "حفظ التعديلات" : "نشر العمل في المعرض"}
          </Button>
        </form>
      </div>

      {/* Works Listing */}
      <div className="lg:col-span-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <span className="font-mono text-[10px] text-brass uppercase">ARCHIVE LEDGER</span>
            <h3 className="text-lg font-bold text-paper">الأعمال المسجلة ({works.length})</h3>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="h-3.5 w-3.5 text-stone-500 absolute top-3 right-3" />
            <input
              type="text"
              placeholder="بحث بالاسم أو العيادة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-stone-800 bg-[#121215] pr-9 pl-4 py-2 font-mono text-xs text-stone-200 placeholder-stone-600 outline-none focus:border-brass"
            />
          </div>
        </div>

        {filteredWorks.length === 0 ? (
          <div className="border border-stone-800 p-12 text-center bg-stone-900/20">
            <p className="font-mono text-xs text-stone-500">
              {search ? "لا توجد نتائج مطابقة لكلمة البحث." : "لم يتم تسجيل أعمال حتى الآن."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredWorks.map((w) => (
              <div
                key={w.id}
                className={`border bg-[#121215] p-4 transition-colors ${
                  w.is_published
                    ? "border-stone-800 hover:border-stone-600"
                    : "border-dashed border-stone-800/80 opacity-50"
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-black/60 mb-3 border border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.image_url}
                    alt={w.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-paper truncate">{w.title}</h4>
                  <p className="font-mono text-xs text-stone-400 truncate">
                    {w.clinic_name || "بدون اسم عيادة"} • {serviceName(w.service_id)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => toggle(w)}
                    className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white"
                  >
                    {w.is_published ? (
                      <>
                        <EyeOff className="h-3 w-3 text-stone-500" />
                        <span>[إخفاء]</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 text-brass" />
                        <span>[إظهار]</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditClick(w)}
                      className="text-stone-400 hover:text-brass"
                      title="تعديل"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(w)}
                      className="text-stone-400 hover:text-red-400"
                      title="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="تأكيد حذف العمل الطبي"
        message={`هل أنت متأكد من حذف "${deleteTarget?.title}" نهائياً؟ سيتم حذف الصورة من السيرفر.`}
        confirmLabel="حذف نهائي"
        onConfirm={confirmRemove}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

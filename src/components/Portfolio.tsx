"use client";

import { useEffect, useMemo, useState } from "react";
import type { Service, Work } from "@/lib/types";
import { waLink } from "@/lib/wa";
import { X, ArrowUpLeft } from "lucide-react";

export default function Portfolio({
  works,
  services,
  whatsapp,
}: {
  works: Work[];
  services: Service[];
  whatsapp: string;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [activeModal, setActiveModal] = useState<Work | null>(null);

  const serviceName = useMemo(() => {
    const m = new Map<string, string>();
    services.forEach((s) => m.set(s.id, s.title));
    return m;
  }, [services]);

  const usedServices = useMemo(
    () => services.filter((s) => works.some((w) => w.service_id === s.id)),
    [services, works]
  );

  const visible = useMemo(
    () => (filter === "all" ? works : works.filter((w) => w.service_id === filter)),
    [filter, works]
  );

  // Close modal with Escape key
  useEffect(() => {
    if (!activeModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [activeModal]);

  return (
    <section id="work" className="relative border-b border-white/10 py-24 md:py-36 bg-ink">
      <div className="mx-auto max-w-page px-6 md:px-10">
        {/* Section Header & Architectural Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-brass block mb-2">
              SELECTED WORKS / 03
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-paper">
              أرشيف الأعمال السابقة
            </h2>
          </div>

          {/* Minimalist Tab Filter */}
          {usedServices.length > 0 && (
            <div
              role="tablist"
              aria-label="تصفية أرشيف الأعمال"
              className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-mono"
            >
              {[{ id: "all", title: "جميع الأعمال" }, ...usedServices].map((t) => {
                const active = filter === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(t.id)}
                    className={`transition-colors pb-1 border-b ${
                      active
                        ? "border-brass text-brass font-bold"
                        : "border-transparent text-stone-400 hover:text-white"
                    }`}
                  >
                    {t.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {visible.length === 0 ? (
          <div className="py-24 text-center border-b border-white/5">
            <p className="font-mono text-sm text-stone-500">
              لا توجد أعمال منشورة في هذا القسم حالياً. يمكنك رفع وإدارة الأعمال من لوحة التحكم.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
            {visible.map((w, idx) => (
              <figure
                key={w.id}
                className="group relative cursor-pointer border border-white/10 bg-[#121215] transition-all duration-200 hover:border-white/30"
                onClick={() => setActiveModal(w)}
              >
                {/* Image Container with high contrast frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.image_url}
                    alt={w.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                  
                  {/* Discreet Index Marker */}
                  <div className="absolute top-3 right-3 font-mono text-[10px] text-stone-400 bg-black/80 px-2 py-0.5 border border-white/10">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Caption / Editorial Details */}
                <figcaption className="p-5 border-t border-white/10 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-paper group-hover:text-brass transition-colors">
                      {w.title}
                    </h4>
                    {w.clinic_name && (
                      <p className="text-xs text-stone-400 font-light mt-0.5">
                        {w.clinic_name}
                      </p>
                    )}
                  </div>

                  <span className="font-mono text-[11px] text-brass uppercase whitespace-nowrap">
                    {(w.service_id && serviceName.get(w.service_id)) || "تصميم طبي"}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* Lightbox Modal (Quiet, High-End Gallery Inspection) */}
        {activeModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-md"
            onClick={() => setActiveModal(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeModal.title}
          >
            <div
              className="relative max-h-[92vh] w-full max-w-5xl border border-white/15 bg-ink p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div>
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-1">
                    {(activeModal.service_id && serviceName.get(activeModal.service_id)) || "تصميم طبي"}
                  </span>
                  <h3 className="text-xl font-bold text-paper">
                    {activeModal.title}
                  </h3>
                  {activeModal.clinic_name && (
                    <p className="text-xs text-stone-400 font-light mt-0.5">
                      {activeModal.clinic_name}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex h-9 w-9 items-center justify-center border border-white/20 text-stone-300 hover:text-white transition-colors"
                  aria-label="إغلاق المعاينة"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* High-Res View Area */}
              <div className="max-h-[60vh] overflow-auto flex items-center justify-center bg-[#070708] p-4 border border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeModal.image_url}
                  alt={activeModal.title}
                  className="max-h-[56vh] w-auto max-w-full object-contain"
                />
              </div>

              {/* Bottom Inquire Action */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-mono text-stone-400">
                  يمكن تخصيص تصميم مماثل بهوية عيادتك وبيانات الطبيب والتخصص.
                </p>

                <a
                  href={waLink(
                    whatsapp,
                    `أهلاً، أود الاستفسار وطلب تصميم مماثل لعمل: "${activeModal.title}" (${activeModal.clinic_name || ""})`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs font-mono tracking-wider"
                >
                  <span>طلب تنفيذ مماثل على واتساب</span>
                  <ArrowUpLeft className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import type { Service } from "@/lib/types";
import { waLink } from "@/lib/wa";
import { ArrowUpLeft } from "lucide-react";

export default function Services({
  services,
  whatsapp,
}: {
  services: Service[];
  whatsapp: string;
}) {
  return (
    <section id="services" className="relative border-b border-white/10 py-24 md:py-36 bg-ink">
      <div className="mx-auto max-w-page px-6 md:px-10">
        {/* Section Index Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-brass block mb-2">
              DISCIPLINES & PRACTICES / 01
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-paper">
              الخدمات والمطبوعات
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-stone-400 font-light leading-relaxed">
            كل عنصر نصممه يخضع لمعايير مقروئية سريرية دقيقة وتوافق فني مع ماكينات الطباعة ومقاييس الحملات الرقمية.
          </p>
        </div>

        {/* Services Editorial Ledger */}
        {services.length === 0 ? (
          <div className="py-20 text-center border-b border-white/5">
            <p className="text-sm text-stone-500 font-mono">
              لم تتم إضافة خدمات في قاعدة البيانات بعد. يمكنك إضافتها من لوحة التحكم.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {services.map((s, index) => (
              <div
                key={s.id}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 py-10 md:py-12 items-baseline transition-colors hover:bg-white/[0.015]"
              >
                {/* Index Number */}
                <div className="md:col-span-2">
                  <span className="font-mono text-xs text-stone-500 group-hover:text-brass transition-colors">
                    [{String(index + 1).padStart(2, "0")}]
                  </span>
                </div>

                {/* Service Title & Scope */}
                <div className="md:col-span-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-paper group-hover:text-brass transition-colors">
                    {s.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="md:col-span-4">
                  <p className="text-sm sm:text-base text-stone-400 font-light leading-relaxed">
                    {s.description || "تنفيذ مخصص للعيادة يشمل الأصول الجاهزة للطباعة والملفات المفتوحة."}
                  </p>
                </div>

                {/* Direct Commission CTA */}
                <div className="md:col-span-2 flex md:justify-end">
                  <a
                    href={waLink(whatsapp, `أهلاً، أود الاستفسار وبدء مشروع لخدمة: ${s.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider text-brass hover:text-white transition-colors"
                  >
                    <span>طلب الخدمة</span>
                    <ArrowUpLeft className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { waLink } from "@/lib/wa";
import { ArrowDownLeft, ArrowLeft } from "lucide-react";

function LuxuryStationeryPad() {
  return (
    <div className="relative w-full max-w-[340px] md:max-w-[380px] select-none">
      {/* Background paper shadow stack (physical print feeling) */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 border border-white/10 bg-stone-900" />

      {/* Main Archival Paper Specimen */}
      <div className="relative border border-stone-700/60 bg-[#141416] p-7 md:p-8 text-stone-300">
        {/* Top Header of the Prescription */}
        <div className="border-b border-stone-800 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-lg font-bold text-paper">د. استشاري تخصصي</p>
              <p className="text-[11px] text-stone-400 font-light mt-0.5">
                زميل الكلية الملكية للأطباء والجراحين
              </p>
            </div>
            <div className="text-left font-mono text-[10px] text-brass uppercase tracking-wider">
              <span>RX / NO. 0184</span>
            </div>
          </div>
        </div>

        {/* Prescription Body with Subtle Architectural Grid Lines */}
        <div className="py-8 space-y-6">
          <div className="flex items-baseline justify-between border-b border-stone-800/80 pb-2 text-[11px] font-mono text-stone-400">
            <span>اسم المريض: .......................................</span>
            <span>التاريخ: ..... / ..... / 202...</span>
          </div>

          {/* Handcrafted Medical Symbol */}
          <div className="py-2">
            <span className="font-serif italic text-4xl text-brass opacity-90 select-none">
              ℞
            </span>
          </div>

          {/* Dotted medication lines */}
          <div className="space-y-4 pt-1 opacity-25">
            <div className="border-b border-dotted border-stone-400 h-1" />
            <div className="border-b border-dotted border-stone-400 h-1" />
            <div className="border-b border-dotted border-stone-400 h-1" />
            <div className="border-b border-dotted border-stone-400 h-1 w-2/3" />
          </div>
        </div>

        {/* Bottom Colophon / Print Specs */}
        <div className="border-t border-stone-800 pt-4 flex items-center justify-between text-[10px] font-mono text-stone-400">
          <span className="text-stone-300 font-semibold tracking-wider">CLINIC HUB ATELIER</span>
          <span className="text-brass">300 DPI • CMYK CERTIFIED</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ whatsapp }: { whatsapp: string }) {
  return (
    <section id="top" className="relative border-b border-white/10 pt-36 pb-24 md:pt-48 md:pb-36">
      <div className="mx-auto max-w-page px-6 md:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1.3fr_0.9fr]">
          {/* Studio Manifesto / Hero Text */}
          <div>
            <div className="inline-flex items-center gap-2 border-b border-brass pb-1 mb-8">
              <span className="font-mono text-[11px] uppercase tracking-widest text-brass">
                استوديو التصميم والهوية الطبية المستقل
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.18] text-paper">
              العيادة ليست مجرد غرفة كشف.
              <br />
              العيادة هوية تبدأ من أول روشتة وإعلان.
            </h1>

            <p className="mt-8 max-w-2xl text-base sm:text-lg font-light leading-relaxed text-stone-300">
              نصمم الروشتات الفاخرة، الهويات البصرية المعتمدة، وإعلانات السوشيال ميديا للأطباء والمراكز الطبية.
              نبتعد عن القوالب الجاهزة والابتذال التسويقي، لنبني حضوراً مهنياً يعزز ثقة المريض واحترام الزملاء.
            </p>

            {/* Direct Studio Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={waLink(whatsapp, "أهلاً، أود التحدث حول تصميمات وهوية عيادتي مع استوديو Clinic Hub")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <span>بدء العمل على هوية عيادتك</span>
                <ArrowDownLeft className="h-4 w-4" />
              </a>

              <a href="#work" className="btn-outline">
                <span>تصفح أرشيف الأعمال</span>
                <ArrowLeft className="h-4 w-4" />
              </a>
            </div>

            {/* Studio Note / Tangible Deliverables */}
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center gap-x-10 gap-y-4 text-xs font-mono text-stone-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                <span>ملفات طباعة CMYK جاهزة للمطابع</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                <span>توافق تام مع قيود الإعلان الطبي</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                <span>تسليم أصول الملفات Vector & PDF</span>
              </div>
            </div>
          </div>

          {/* Right Tactile Specimen */}
          <div className="flex justify-center lg:justify-end">
            <LuxuryStationeryPad />
          </div>
        </div>
      </div>
    </section>
  );
}

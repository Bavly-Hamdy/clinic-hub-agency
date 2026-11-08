"use client";

import { useState } from "react";
import { waLink } from "@/lib/wa";
import { sanitizeInstagramHandle } from "@/lib/validation";
import { ArrowUpLeft, Copy, Check } from "lucide-react";

type Props = { whatsapp: string; instagram: string; email: string };

export default function Contact({ whatsapp, instagram, email }: Props) {
  const [copied, setCopied] = useState(false);
  const igHandle = sanitizeInstagramHandle(instagram);

  const copyEmail = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section id="contact" className="relative border-b border-white/10 py-24 md:py-36 bg-[#09090b]">
        <div className="mx-auto max-w-page px-6 md:px-10">
          <div className="grid gap-16 lg:grid-cols-12 items-baseline">
            {/* Left Column: Heading and Contact Statement */}
            <div className="lg:col-span-6">
              <span className="font-mono text-xs uppercase tracking-widest text-brass block mb-3">
                COMMISSION & INQUIRY / 04
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold leading-tight text-paper">
                جاهز لبدء تجهيز هوية ومطبوعات عيادتك؟
              </h2>
              <p className="mt-6 text-base text-stone-300 font-light leading-relaxed max-w-lg">
                نناقش معك التخصص، نوع المطبوعات الورقية المطلوبة، ونماذج الحملات الرقمية المناسبة لنطاق عيادتك الجغرافي.
              </p>

              <div className="mt-10">
                <a
                  href={waLink(whatsapp, "أهلاً، أود بدء العمل على تصميمات وهوية عيادتي مع Clinic Hub")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <span>محادثة واتساب مباشرة مع الاستوديو</span>
                  <ArrowUpLeft className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Clear Editorial Channels */}
            <div className="lg:col-span-6 divide-y divide-white/10 border-t border-b border-white/10">
              {/* WhatsApp Row */}
              <div className="py-6 flex items-baseline justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] text-stone-500 uppercase block mb-1">
                    Direct Channel / واتساب
                  </span>
                  <a
                    href={waLink(whatsapp, "أهلاً، أود الاستفسار عن باقات العيادات")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-lg sm:text-xl font-bold text-paper hover:text-brass transition-colors"
                    dir="ltr"
                  >
                    +{whatsapp || "201000000000"}
                  </a>
                </div>
                <span className="font-mono text-xs text-brass">
                  [متاح للاستفسار]
                </span>
              </div>

              {/* Instagram Row */}
              {igHandle ? (
                <div className="py-6 flex items-baseline justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] text-stone-500 uppercase block mb-1">
                      Visual Archive / انستجرام
                    </span>
                    <a
                      href={`https://instagram.com/${igHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-base sm:text-lg font-medium text-stone-300 hover:text-white transition-colors"
                      dir="ltr"
                    >
                      @{igHandle}
                    </a>
                  </div>
                  <span className="font-mono text-xs text-stone-500">
                    [معرض الأعمال]
                  </span>
                </div>
              ) : null}

              {/* Email Row */}
              {email ? (
                <div className="py-6 flex items-baseline justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] text-stone-500 uppercase block mb-1">
                      Official Correspondence / البريد
                    </span>
                    <span
                      onClick={copyEmail}
                      className="cursor-pointer font-mono text-base sm:text-lg font-medium text-stone-300 hover:text-brass transition-colors block"
                      dir="ltr"
                    >
                      {email}
                    </span>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="font-mono text-xs text-stone-400 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <span className="text-brass flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" />
                        <span>تم النسخ</span>
                      </span>
                    ) : (
                      <span>[نسخ البريد]</span>
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Architectural Footer Colophon */}
      <footer className="py-10 bg-black text-xs font-mono text-stone-500 border-t border-white/5">
        <div className="mx-auto max-w-page px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-stone-300 font-bold" dir="ltr">CLINIC HUB ATELIER</span>
            <span>—</span>
            <span>استوديو مستقل للهوية والتسويق الطبي</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#top" className="hover:text-stone-300 transition-colors">أعلى الصفحة ↑</a>
            <a href="/admin/login" className="hover:text-stone-300 transition-colors">بوابة الفريق</a>
          </div>

          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة للاستوديو</p>
        </div>
      </footer>
    </>
  );
}

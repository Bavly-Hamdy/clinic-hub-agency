"use client";

import { waLink } from "@/lib/wa";
import { ArrowUpLeft, MessageSquare } from "lucide-react";

export default function FloatingWhatsApp({ whatsapp }: { whatsapp: string }) {
  if (!whatsapp) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <a
        href={waLink(whatsapp, "أهلاً، أود الاستفسار عن باقات وخدمات Clinic Hub للعيادات")}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 border border-stone-700 bg-stone-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-150 hover:border-brass hover:bg-black"
        aria-label="تواصل مع الاستوديو على واتساب"
      >
        <MessageSquare className="h-4 w-4 text-brass" />
        <span className="font-mono text-xs text-stone-200 group-hover:text-brass transition-colors">
          واتساب الاستوديو
        </span>
        <ArrowUpLeft className="h-3.5 w-3.5 text-stone-500 group-hover:text-brass transition-colors" />
      </a>
    </div>
  );
}

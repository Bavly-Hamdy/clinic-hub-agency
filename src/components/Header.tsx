"use client";

import { useState, useEffect } from "react";
import { waLink } from "@/lib/wa";
import { ArrowUpLeft, Menu, X } from "lucide-react";

export default function Header({ whatsapp }: { whatsapp: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-white/10 bg-ink/90 backdrop-blur-md py-4"
          : "border-b border-transparent bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-page items-center justify-between px-6 md:px-10">
        {/* Studio Identity Masthead */}
        <a href="#top" className="flex items-baseline gap-3" aria-label="Clinic Hub Studio">
          <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-paper" dir="ltr">
            CLINIC HUB
          </span>
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-widest text-brass">
            / MEDICAL ATELIER
          </span>
        </a>

        {/* Studio Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide text-stone-300">
          <a href="#services" className="hover:text-brass transition-colors">
            <span className="font-mono text-stone-500 text-[11px] ml-1.5">01</span>
            الخدمات والمطبوعات
          </a>
          <a href="#philosophy" className="hover:text-brass transition-colors">
            <span className="font-mono text-stone-500 text-[11px] ml-1.5">02</span>
            معايير الاستوديو
          </a>
          <a href="#work" className="hover:text-brass transition-colors">
            <span className="font-mono text-stone-500 text-[11px] ml-1.5">03</span>
            الأعمال السابقة
          </a>
          <a href="#contact" className="hover:text-brass transition-colors">
            <span className="font-mono text-stone-500 text-[11px] ml-1.5">04</span>
            تواصل
          </a>
        </nav>

        {/* Primary Studio Action */}
        <div className="flex items-center gap-4">
          <a
            href={waLink(whatsapp, "أهلاً، أود بدء تطوير هوية وتصميمات عيادتي مع Clinic Hub")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 border border-brass/50 bg-brass/10 px-4 py-2 text-[13px] font-medium text-brass hover:border-brass hover:bg-brass hover:text-black transition-all duration-150"
          >
            <span>بدء مشروع</span>
            <ArrowUpLeft className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-stone-300 hover:text-white md:hidden"
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Editorial Menu */}
      {menuOpen && (
        <div className="border-b border-white/10 bg-ink px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4 text-sm">
            <a
              href="#services"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/5 text-stone-300 hover:text-brass"
            >
              <span>الخدمات والمطبوعات</span>
              <span className="font-mono text-xs text-stone-500">01</span>
            </a>
            <a
              href="#philosophy"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/5 text-stone-300 hover:text-brass"
            >
              <span>معايير الاستوديو</span>
              <span className="font-mono text-xs text-stone-500">02</span>
            </a>
            <a
              href="#work"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/5 text-stone-300 hover:text-brass"
            >
              <span>الأعمال السابقة</span>
              <span className="font-mono text-xs text-stone-500">03</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/5 text-stone-300 hover:text-brass"
            >
              <span>تواصل مع الاستوديو</span>
              <span className="font-mono text-xs text-stone-500">04</span>
            </a>
            <a
              href={waLink(whatsapp, "أهلاً، أود الاستفسار عن خدمات العيادات")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-2 w-full text-center"
            >
              تواصل مباشرة على واتساب
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

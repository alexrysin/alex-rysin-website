"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "אודות", href: "/about" },
  { label: "איך זה עובד", href: "/process" },
  { label: "בלוג", href: "/blog" },
  { label: "המלצות", href: "/testimonials" },
  { label: "כלים", href: "/tools" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen && mobileMenuRef.current) {
      const firstLink = mobileMenuRef.current.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
    }
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" aria-label="אלכס ריסין - דף הבית" className="flex-shrink-0">
            <span className="text-2xl md:text-3xl font-bold text-[#1C3879] tracking-tight hover:text-[#2a4a9e] transition-colors leading-none">
              אלכס ריסין
            </span>
            <span className="block text-xs text-[#6B7280] mt-0.5">
              תכנון פיננסי וליווי לעצמאות כלכלית
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-medium transition-colors text-sm lg:text-base ${
                    isActive
                      ? "text-[#4A6FA5] underline underline-offset-4"
                      : "text-[#1C3879] hover:text-[#4A6FA5]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button (desktop) - #4d6617 = olive כהה יותר, קונטרסט 4.56:1 עם לבן ✓ */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="inline-block bg-[#4d6617] hover:bg-[#3d5213] text-white font-bold px-5 py-2.5 rounded-lg transition-colors text-sm lg:text-base shadow-sm"
            >
              קבע שיחת היכרות
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[#1C3879] hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1C3879]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "סגור תפריט ניווט" : "פתח תפריט ניווט"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-gray-100 shadow-lg"
        >
          <nav aria-label="ניווט נייד" className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-medium py-3 px-4 rounded-lg transition-colors text-right ${
                    isActive ? "bg-blue-50 text-[#4A6FA5]" : "text-[#1C3879] hover:bg-gray-50"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 pb-1">
              <Link
                href="/contact"
                className="block w-full text-center bg-[#4d6617] hover:bg-[#3d5213] text-white font-bold px-5 py-3 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                קבע שיחת היכרות
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

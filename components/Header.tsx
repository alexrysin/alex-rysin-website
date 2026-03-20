"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "דף הבית", href: "/" },
  { label: "אודות", href: "/about" },
  { label: "בלוג", href: "/blog" },
  { label: "המלצות", href: "/testimonials" },
  { label: "צור קשר", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl md:text-3xl font-bold text-[#1C3879] tracking-tight hover:text-[#2a4a9e] transition-colors">
              אלכס ריסין
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#1C3879] font-medium hover:text-[#4A6FA5] transition-colors text-sm lg:text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button (desktop) */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="inline-block bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold px-5 py-2.5 rounded-lg transition-colors text-sm lg:text-base shadow-sm"
            >
              קבע שיחת היכרות
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[#1C3879] hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#1C3879] font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-right"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-1">
              <Link
                href="/contact"
                className="block w-full text-center bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold px-5 py-3 rounded-lg transition-colors"
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

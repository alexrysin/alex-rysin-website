import Link from "next/link";

const navLinks = [
  { label: "דף הבית", href: "/" },
  { label: "אודות", href: "/about" },
  { label: "בלוג", href: "/blog" },
  { label: "המלצות", href: "/testimonials" },
  { label: "צור קשר", href: "/contact" },
  { label: "כלים", href: "/tools" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1C3879] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/">
              <span className="text-2xl font-bold text-white hover:text-blue-200 transition-colors">
                אלכס ריסין
              </span>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed">
              תכנון פיננסי ועצמאות כלכלית
            </p>
            <p className="text-blue-300 text-sm leading-relaxed mt-2">
              מלווה אנשים חכמים לבנות עושר אמיתי — מהבהירות ועד לביצוע בפועל.
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-lg mb-1">קישורים מהירים</h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-blue-200 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-lg mb-1">צור קשר</h3>
            <div className="flex flex-col gap-2 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>alex@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>050-123-4567</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>ראשון–חמישי, 9:00–18:00</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#2a4a9e] flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-blue-300">
          <p>© 2025 אלכס ריסין. כל הזכויות שמורות.</p>
          <div className="flex items-center gap-4">
            <Link href="/accessibility" className="hover:text-white transition-colors underline underline-offset-2">
              הצהרת נגישות
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

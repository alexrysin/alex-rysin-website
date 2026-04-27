"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    _gotcha: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");

    try {
      const res = await fetch("https://formspree.io/f/xrerjwgy", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormState("success");
        setFormData({ name: "", phone: "", email: "", message: "", _gotcha: "" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1C3879] py-24 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#6B8E23] bg-opacity-80 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            השלב הראשון הוא הכי קל
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            בואו נדבר
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto">
            שיחת היכרות בחינם לגמרי. לא צריך להכין כלום מראש - רק להגיע.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 720 0 0 20L0 40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#F8F9FA] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form - 3/5 */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-[#1C3879] mb-2">
                  שלחו הודעה
                </h2>
                <p className="text-gray-500 text-sm mb-7">
                  אחזור אליכם בתוך יום עסקים אחד.
                </p>

                {formState === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#6B8E23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C3879] mb-2">ההודעה נשלחה!</h3>
                    <p className="text-gray-500 mb-6">
                      תודה שפניתם. אחזור אליכם בהקדם.
                    </p>
                    <button
                      onClick={() => setFormState("idle")}
                      className="text-[#6B8E23] font-semibold hover:underline text-sm"
                    >
                      שלח הודעה נוספת
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Honeypot — hidden from humans, bots fill it and Formspree drops the submission.
                        Wrapper has 0x0 size with overflow:hidden so the negative-positioned input
                        cannot leak into the document flow (otherwise RTL layouts on mobile browsers
                        scroll to the empty negative space and show a blank page). */}
                    <div aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
                      <input
                        type="text"
                        name="_gotcha"
                        value={formData._gotcha}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        שם מלא <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="ישראל ישראלי"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1C3879] focus:ring-2 focus:ring-[#1C3879] focus:ring-opacity-20 outline-none transition text-right bg-gray-50 focus:bg-white"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        טלפון
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="050-123-4567"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1C3879] focus:ring-2 focus:ring-[#1C3879] focus:ring-opacity-20 outline-none transition text-right bg-gray-50 focus:bg-white"
                        dir="ltr"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        דואר אלקטרוני <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1C3879] focus:ring-2 focus:ring-[#1C3879] focus:ring-opacity-20 outline-none transition text-right bg-gray-50 focus:bg-white"
                        dir="ltr"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                      >
                        הודעה
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="ספרו לנו בקצרה מה מביא אתכם..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1C3879] focus:ring-2 focus:ring-[#1C3879] focus:ring-opacity-20 outline-none transition resize-none text-right bg-gray-50 focus:bg-white"
                      />
                    </div>

                    {formState === "error" && (
                      <div
                        role="alert"
                        aria-live="assertive"
                        className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                      >
                        אירעה שגיאה בשליחה. אנא נסו שוב או צרו קשר ישיר בוואטסאפ.
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formState === "submitting"}
                      className="w-full bg-[#6B8E23] hover:bg-[#5a781e] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-4 rounded-xl transition-all duration-300 text-lg flex items-center justify-center gap-2"
                    >
                      {formState === "submitting" ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          שולח...
                        </>
                      ) : (
                        "שלח הודעה"
                      )}
                    </button>

                    <p className="text-gray-400 text-xs text-center">
                      הפרטים ישמשו ליצירת קשר בלבד ולא יועברו לצד שלישי.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar - 2/5 */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Direct contact */}
              <div className="bg-white rounded-2xl shadow-sm p-7">
                <h3 className="text-xl font-bold text-[#1C3879] mb-5">
                  או צרו קשר ישיר
                </h3>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/972544580159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group mb-4"
                >
                  <div className="w-12 h-12 bg-[#6B8E23] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#1C3879] text-sm">וואטסאפ</p>
                    <p className="text-gray-500 text-xs mt-0.5">054-4580159</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:alex@alexrysin.co.il"
                  className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group mb-4"
                >
                  <div className="w-12 h-12 bg-[#1C3879] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#1C3879] text-sm">דואר אלקטרוני</p>
                    <p className="text-gray-500 text-xs mt-0.5">alex@alexrysin.co.il</p>
                  </div>
                </a>
              </div>

              {/* Reassurance card */}
              <div className="bg-[#1C3879] rounded-2xl p-7 text-white">
                <div className="w-12 h-12 bg-[#6B8E23] rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-3">ללא התחייבות</h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                  שיחה קצרה שעשויה לשנות הרבה. לא מוכרים, לא לוחצים - רק שיחה אמיתית.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "שיחה ראשונה בחינם",
                    "ללא לחץ ממכירה",
                    "תשובות לשאלות שלכם",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-blue-100">
                      <svg className="w-4 h-4 text-[#6B8E23] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

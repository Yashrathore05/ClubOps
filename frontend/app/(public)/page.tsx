"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#fafbfc] text-[#1a1d21] antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[#e8eaed] bg-[#fafbfc]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#1a1d21]">
            ClubOps
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2.5 text-sm font-medium text-[#5f6368] transition hover:bg-[#e8eaed] hover:text-[#1a1d21]"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#1a73e8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1765cc]"
            >
              Get started free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-28">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[#e8f0fe] opacity-80 blur-3xl" />
        <div className="absolute -bottom-20 -left-40 h-72 w-72 rounded-full bg-[#e6f4ea] opacity-60 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-[#1a1d21] sm:text-5xl lg:text-6xl">
            Run your club.
            <br />
            <span className="text-[#1a73e8]">No spreadsheets.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#5f6368] sm:text-xl">
            Events, attendance, and certificates in one place. Sign up with Google or email—you’re in.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#1765cc] sm:w-auto"
            >
              Get started free
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#dadce0] bg-white px-8 py-4 text-base font-medium text-[#1a1d21] transition hover:border-[#1a73e8] hover:bg-[#f8f9fa] sm:w-auto"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-[#e8eaed] bg-white py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#1a73e8]">500+</div>
              <div className="text-sm text-[#5f6368]">Events run</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1a73e8]">20k+</div>
              <div className="text-sm text-[#5f6368]">Certificates sent</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1a73e8]">Clubs</div>
              <div className="text-sm text-[#5f6368]">Worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-[#1a1d21] sm:text-3xl">
            Built for how you actually work
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#5f6368]">
            Stop switching between forms, sheets, and DMs.
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e8eaed] bg-white p-7 shadow-sm">
              <h3 className="text-lg font-semibold text-[#ea4335]">The old way</h3>
              <ul className="mt-4 space-y-2.5 text-[#5f6368]">
                {["A new form for every event", "Sheets that never sync", "Manual attendance", "Certificates one by one", "Endless follow-ups"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#ea4335]/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-[#1a73e8]/30 bg-[#e8f0fe]/50 p-7 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a73e8]">With ClubOps</h3>
              <ul className="mt-4 space-y-2.5 text-[#5f6368]">
                {["One hub for all events", "Token-based attendance", "Auto certificate generation", "Bulk emails", "Everything in one place"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#1a73e8]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#e8eaed] bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-[#1a1d21] sm:text-3xl">
            Everything in one place
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#5f6368]">
            Events, attendance, certificates. No more juggling.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e8eaed] bg-[#fafbfc] p-6 text-center transition hover:border-[#1a73e8]/40 hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f0fe] text-[#1a73e8]">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-semibold text-[#1a1d21]">Events</h3>
              <p className="mt-2 text-sm text-[#5f6368]">Create events, share links, track everything.</p>
            </div>
            <div className="rounded-2xl border border-[#e8eaed] bg-[#fafbfc] p-6 text-center transition hover:border-[#1a73e8]/40 hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f4ea] text-[#34a853]">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h3 className="font-semibold text-[#1a1d21]">Attendance</h3>
              <p className="mt-2 text-sm text-[#5f6368]">Token-based check-in. No fake lists.</p>
            </div>
            <div className="rounded-2xl border border-[#e8eaed] bg-[#fafbfc] p-6 text-center transition hover:border-[#1a73e8]/40 hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fef7e0] text-[#f9ab00]">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="font-semibold text-[#1a1d21]">Certificates</h3>
              <p className="mt-2 text-sm text-[#5f6368]">Generate and email in bulk. Done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-[#e8eaed] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-[#1a1d21] sm:text-3xl">
            Loved by club leads
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { name: "Ananya S.", role: "Events Lead", text: "No more attendance headaches. Seriously." },
              { name: "Rohit V.", role: "Club President", text: "Events to certificates—it just works." },
              { name: "Sneha P.", role: "Core Team", text: "Finally something built for how we actually run things." },
            ].map((q) => (
              <div key={q.name} className="rounded-2xl border border-[#e8eaed] bg-white p-6 shadow-sm">
                <p className="text-[#1a1d21]">"{q.text}"</p>
                <div className="mt-4">
                  <div className="font-semibold text-[#1a1d21]">{q.name}</div>
                  <div className="text-sm text-[#5f6368]">{q.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#e8eaed] bg-[#e8f0fe]/40 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#1a73e8]/20 bg-white p-10 text-center shadow-lg sm:p-14">
          <h2 className="text-2xl font-bold text-[#1a1d21] sm:text-3xl">
            Get your club on ClubOps
          </h2>
          <p className="mt-3 text-[#5f6368]">
            Sign up with Google or email. Free to start.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#1a73e8] px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#1765cc] sm:w-auto"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#dadce0] px-8 py-4 text-base font-medium text-[#1a1d21] transition hover:bg-[#f8f9fa] sm:w-auto"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e8eaed] py-8 text-center text-sm text-[#5f6368]">
        © {new Date().getFullYear()} ClubOps · For clubs everywhere
      </footer>
    </main>
  );
}

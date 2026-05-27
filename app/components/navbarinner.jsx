"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { NAV_LINKS } from "./navLinks";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useUser();
  const userRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (userRef.current && !userRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    setMenuOpen(false);
  };

  const isActive = (href) => {
    if (href.startsWith("http")) return false;
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9998] h-[72px] bg-white dark:bg-[#0f0f0f] flex items-center transition-all duration-200 ${
          scrolled
            ? "border-b border-[#e5e7eb] dark:border-[#222] shadow-sm"
            : "border-b border-transparent"
        }`}
        style={{ fontFamily: "'Inter', 'Source Sans 3', sans-serif" }}
      >
        <div className="w-full max-w-[1200px] mx-auto px-8 flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="text-[26px] font-black text-[#1a1a1a] dark:text-white tracking-tight hover:opacity-75 transition-opacity"
            style={{ fontFamily: "'Inter', 'Source Sans 3', sans-serif", letterSpacing: '-0.03em' }}
          >
            Algo<span className="text-[#a435f0]">Buddy</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`text-[15px] font-medium transition-colors duration-150 focus-ring ${
                  isActive(l.href)
                    ? "text-primary dark:text-primary font-semibold"
                    : "text-[#4b5563] dark:text-[#a3a3a3] hover:text-[#1a1a1a] dark:hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right: auth + theme toggle */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-[#e5e7eb] dark:border-[#333] hover:border-[#a435f0] transition-colors"
                >
                  <img
                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.email)}`}
                    alt="avatar"
                    className="w-7 h-7 rounded-full"
                  />
                  <svg
                    className="w-3.5 h-3.5 text-[#6b7280]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#333] shadow-xl rounded-xl z-[9999] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#f3f4f6] dark:border-[#222]">
                      <p className="text-[13px] text-[#6b7280] dark:text-[#737373] truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-[14px] font-medium text-[#1a1a1a] dark:text-[#f5f5f5] hover:bg-[#f9fafb] dark:hover:bg-[#222] transition-colors"
                    >
                      <svg className="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      My Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-[14px] font-medium text-[#dc2626] hover:bg-[#fef2f2] dark:hover:bg-[#2a1515] transition-colors border-t border-[#f3f4f6] dark:border-[#222]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="h-[42px] px-7 flex items-center text-[15px] font-bold text-white bg-[#1a1a1a] dark:bg-white dark:text-[#1a1a1a] rounded-full hover:bg-[#a435f0] dark:hover:bg-[#a435f0] dark:hover:text-white transition-all duration-150"
              >
                Sign in
              </Link>
            )}

            {/* Desktop Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#4b5563] dark:text-[#a3a3a3] hover:bg-[#f3f4f6] dark:hover:bg-[#222] transition-colors"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="md:hidden w-10 h-10 flex items-center justify-center text-[#4b5563] dark:text-[#a3a3a3] rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[#222] transition-colors"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          className="fixed top-[72px] left-0 right-0 bottom-0 z-[9997] bg-white dark:bg-[#0f0f0f] overflow-y-auto border-t border-[#e5e7eb] dark:border-[#222]"
          style={{ fontFamily: "'Inter', 'Source Sans 3', sans-serif" }}
        >
          <div className="py-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`block px-6 py-3.5 text-[16px] font-medium transition-colors focus-ring ${
                  isActive(l.href)
                    ? "text-[#a435f0] bg-[#faf5ff] dark:bg-[#1a0a2e]"
                    : "text-[#374151] dark:text-[#a3a3a3] hover:bg-[#f9fafb] dark:hover:bg-[#1a1a1a] hover:text-[#1a1a1a] dark:hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[#222] flex flex-col gap-3">
            {user ? (
              <>
                <p className="text-[13px] text-[#6b7280] dark:text-[#737373] truncate pb-1">
                  {user.email}
                </p>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="h-[44px] flex items-center justify-center text-[15px] font-semibold border border-[#d1d5db] dark:border-[#444] rounded-full text-[#1a1a1a] dark:text-white hover:border-[#a435f0] hover:text-[#a435f0] transition-all"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="h-[44px] text-[15px] font-semibold text-[#dc2626] border border-[#fecaca] rounded-full hover:bg-[#fef2f2] transition-all"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="h-[44px] flex items-center justify-center text-[15px] font-semibold text-[#1a1a1a] dark:text-white border border-[#d1d5db] dark:border-[#444] rounded-full hover:border-[#a435f0] hover:text-[#a435f0] transition-all"
              >
                Sign in
              </Link>
            )}

            {/* Mobile Dark mode toggle */}
            <button
              onClick={() => { toggleTheme(); setMenuOpen(false); }}
              aria-label="Toggle theme"
              className="h-[44px] w-full flex items-center justify-center gap-2 text-[15px] font-semibold text-[#4b5563] dark:text-[#a3a3a3] border border-[#d1d5db] dark:border-[#444] rounded-full hover:border-[#a435f0] hover:text-[#a435f0] transition-all"
            >
              {theme === "light" ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                  Dark Mode
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  Light Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="h-[72px]" />
    </>
  );
}

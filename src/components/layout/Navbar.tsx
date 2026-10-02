"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Terminal,
  Trophy,
  Calendar,
  Users,
  BookOpen,
  Info,
  Building2,
  User,
  UsersRound,
  LogOut,
  ChevronDown,
  ClipboardList,
  Shield,
  Sparkles,
} from "lucide-react";
import { NexhackLogo } from "../ui/NexhackLogo";

interface NavbarProps {
  onJoinClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);

  const isSignedIn = status === "authenticated" && !!session?.user;
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const firstName = user?.name?.split(" ")[0] ?? "You";
  const avatarSrc = user?.image ?? null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileMenuOpen]);

  const handleSignOut = useCallback(async () => {
    setProfileOpen(false);
    await signOut({ callbackUrl: "/" });
  }, []);

  const navLinks = [
    { label: "Home",       href: "/",           icon: Terminal  },
    { label: "Hackathons", href: "/hackathons",  icon: Trophy    },
    { label: "Events",     href: "/events",      icon: Calendar  },
    { label: "Community",  href: "/community",   icon: Users     },
    { label: "About",      href: "/about",       icon: Info      },
    { label: "Resources",  href: "/resources",   icon: BookOpen  },
  ];

  const profileMenuItems = [
    { label: "Profile",          href: "/profile",       icon: User,           desc: "Edit your info & avatar"       },
    { label: "My Team",          href: "/team",          icon: UsersRound,     desc: "Create or manage your team"    },
    { label: "My Registrations", href: "/registrations", icon: ClipboardList,  desc: "Hackathons & events you joined" },
  ];

  /* ── Avatar component — shared between desktop + mobile ── */
  const Avatar = ({ size = "sm" }: { size?: "sm" | "md" }) => {
    const dim = size === "md" ? "w-10 h-10 text-base" : "w-8 h-8 text-sm";
    if (avatarSrc) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarSrc}
          alt={user?.name ?? "User"}
          className={`${dim} rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-blue-500/20`}
        />
      );
    }
    return (
      <div className={`${dim} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white shadow-sm ring-2 ring-blue-500/20 flex items-center justify-center font-black text-white`}>
        {firstName[0]?.toUpperCase() ?? "U"}
      </div>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-2.5 sm:py-3"
            : "bg-white/80 backdrop-blur-xs py-3 sm:py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group focus:outline-hidden shrink-0" aria-label="NEXHACK Home">
              <NexhackLogo size="md" />
            </Link>

            {/* Desktop nav pill */}
            <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50/80 border border-slate-200/80 shadow-2xs">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      isActive ? "text-blue-600 bg-white shadow-xs font-bold" : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    {link.label}
                    {isActive && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop right — auth-aware */}
            <div className="hidden sm:flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 hover:bg-indigo-100/80 hover:border-indigo-300 transition-all shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Admin</span>
                </Link>
              )}

              {isSignedIn ? (
                /* ── Profile dropdown ── */
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((p) => !p)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer group"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <Avatar size="sm" />
                    <span className="text-xs font-bold text-slate-700 max-w-[80px] truncate hidden md:block">
                      {firstName}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown panel */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User header */}
                      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-3">
                        <Avatar size="md" />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">{user?.name ?? "NEXHACK Member"}</p>
                          <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5 space-y-0.5">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/60 transition-colors group mb-1"
                          >
                            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <Shield className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-indigo-900 group-hover:text-indigo-950 flex items-center gap-1">
                                Admin Console
                                <Sparkles className="w-3 h-3 text-indigo-600" />
                              </p>
                              <p className="text-[10px] text-indigo-600 font-medium">Operations & management</p>
                            </div>
                          </Link>
                        )}
                        {profileMenuItems.map(({ label, href, icon: Icon, desc }) => (
                          <Link
                            key={label}
                            href={href}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors">
                              <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{label}</p>
                              <p className="text-[10px] text-slate-400">{desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Sign out */}
                      <div className="p-1.5 border-t border-slate-100">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 transition-colors group cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-rose-100 flex items-center justify-center shrink-0 transition-colors">
                            <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600 transition-colors" />
                          </div>
                          <p className="text-xs font-bold text-slate-700 group-hover:text-rose-600">Sign Out</p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Sign in / Sign up ── */
                <>
                  <Link href="/signin" className="text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all bg-white">
                    Sign In
                  </Link>
                  <Link href="/signup" className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white transition-all">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile right */}
            <div className="flex sm:hidden items-center gap-1.5">
              {isSignedIn ? (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-lg cursor-pointer"
                  aria-label="Open menu"
                >
                  <Avatar size="sm" />
                  <Menu className="w-4 h-4 text-slate-600" />
                </button>
              ) : (
                <>
                  <Link href="/signin" className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold">Sign In</Link>
                  <Link href="/signup" className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold">Sign Up</Link>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                    aria-label="Toggle mobile menu"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-16 left-3 right-3 max-h-[85vh] bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200 overflow-y-auto space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">

            {/* Header row */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <NexhackLogo size="sm" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Signed-in user strip */}
            {isSignedIn && (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Avatar size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    <IconComponent className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <Link href="/campus" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${pathname === "/campus" ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"}`}>
                <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Host on Campus</span>
              </Link>
            </nav>

            {/* Auth section */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {isSignedIn ? (
                <div className="flex flex-col gap-1">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 transition-colors mb-1"
                    >
                      <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Admin Console</span>
                    </Link>
                  )}
                  {profileMenuItems.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:border-blue-400 hover:text-blue-600 transition-all">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-700 transition-all">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

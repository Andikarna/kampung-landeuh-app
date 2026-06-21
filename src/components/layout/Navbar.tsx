"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";
import { Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-md shadow-sm" />
              <span className={cn(
                "font-heading font-bold text-xl tracking-tight",
                !isScrolled && pathname === "/" ? "text-white" : "text-primary"
              )}>
                {APP_NAME}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary font-semibold"
                    : (!isScrolled && pathname === "/" ? "text-white/90 hover:text-white" : "text-muted-foreground")
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role?.name === "Admin" && (
                  <Link
                    href="/admin"
                    className={cn(
                      "text-sm font-medium",
                      !isScrolled && pathname === "/" ? "text-white" : "text-foreground"
                    )}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="relative group">
                  <button className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    !isScrolled && pathname === "/" ? "text-white" : "text-foreground"
                  )}>
                    <User className="w-4 h-4" />
                    {user.fullName}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-1">
                      <Link href="/profil" className="block px-4 py-2 text-sm hover:bg-muted">Profil Saya</Link>
                      <Link href="/reservasi/riwayat" className="block px-4 py-2 text-sm hover:bg-muted">Riwayat Reservasi</Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/masuk"
                  className={cn(
                    "text-sm font-medium",
                    !isScrolled && pathname === "/" ? "text-white" : "text-foreground"
                  )}
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 rounded-md",
                !isScrolled && pathname === "/" ? "text-white" : "text-foreground"
              )}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t my-2 pt-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-muted-foreground">Masuk sebagai {user.fullName}</div>
                  {user.role?.name === "Admin" && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md">Dashboard Admin</Link>
                  )}
                  <Link href="/profil" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md">Profil Saya</Link>
                  <Link href="/reservasi/riwayat" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md">Riwayat Reservasi</Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-destructive hover:bg-muted rounded-md">Keluar</button>
                </>
              ) : (
                <>
                  <Link href="/masuk" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md">Masuk</Link>
                  <Link href="/daftar" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-primary hover:bg-muted rounded-md">Daftar</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

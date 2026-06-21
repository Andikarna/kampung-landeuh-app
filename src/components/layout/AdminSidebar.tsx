"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_NAME, ADMIN_NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Building, 
  Image as ImageIcon, 
  BookOpen, 
  Star, 
  Users, 
  Mail,
  LogOut
} from "lucide-react";

// Icon mapping based on strings in constants
const iconMap: Record<string, any> = {
  LayoutDashboard,
  MapPin,
  Calendar,
  Building,
  Image: ImageIcon,
  BookOpen,
  Star,
  Users,
  Mail
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="hidden border-r bg-slate-900 text-slate-300 md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-4">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-md" />
            <span className="font-heading font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors">
              {APP_NAME}
            </span>
          </Link>
        </div>
        
        <div className="px-4 pb-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Admin Panel
          </h2>
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
              {user?.fullName?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName || "Admin"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                Administrator
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 space-y-1">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon];
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                  aria-hidden="true"
                />
                {link.label}
              </Link>
            );
          })}
        </div>
        
        <div className="flex-shrink-0 p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="group flex w-full items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-400" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

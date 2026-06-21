import Link from "next/link";
import { APP_NAME, APP_DESCRIPTION, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { MapPin, Phone, Mail, Link as LinkIcon, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Desc */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-2xl text-white tracking-tight">
              {APP_NAME}
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              {APP_DESCRIPTION}
            </p>
            <div className="flex space-x-4 pt-2">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <LinkIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{SOCIAL_LINKS.address}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{SOCIAL_LINKS.phone}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{SOCIAL_LINKS.email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4 text-slate-400">Dapatkan informasi terbaru seputar wisata dan event di Kampung Landeuh.</p>
            <form className="flex space-x-2" action="#">
              <input
                type="email"
                placeholder="Email Anda"
                className="bg-slate-800 border-none text-sm w-full px-4 py-2 rounded-md focus:ring-2 focus:ring-primary outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. Hak Cipta Dilindungi.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/kebijakan-privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat-ketentuan" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

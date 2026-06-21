import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function generateBookingNumber(): string {
  const date = new Date();
  const prefix = "BK";
  const timestamp = date.getFullYear().toString().slice(-2) +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    maintenance: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    ongoing: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Menunggu",
    confirmed: "Dikonfirmasi",
    cancelled: "Dibatalkan",
    completed: "Selesai",
    active: "Aktif",
    inactive: "Nonaktif",
    maintenance: "Pemeliharaan",
    upcoming: "Akan Datang",
    ongoing: "Berlangsung",
  };
  return labels[status] || status;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

"use client";

import { useState, useMemo } from "react";
import { Search, X, Check } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Daftar icon Lucide yang relevan untuk fasilitas wisata
export const FACILITY_ICONS = [
  "Building",
  "Car",
  "Bath",
  "UtensilsCrossed",
  "ShoppingBag",
  "Home",
  "Info",
  "Wifi",
  "Phone",
  "MapPin",
  "Camera",
  "Music",
  "TreePine",
  "Mountain",
  "Waves",
  "Tent",
  "Bike",
  "Bus",
  "Boat",
  "ParkingCircle",
  "Toilet",
  "Baby",
  "Accessibility",
  "HeartPulse",
  "ShieldCheck",
  "Flame",
  "Droplets",
  "Trash2",
  "Power",
  "Lightbulb",
  "BedDouble",
  "Coffee",
  "Utensils",
  "Pizza",
  "IceCream2",
  "Gift",
  "BookOpen",
  "GraduationCap",
  "Microscope",
  "Palette",
  "Gamepad2",
  "Dumbbell",
  "FootprintsIcon",
  "Fish",
  "Leaf",
  "Sun",
  "Moon",
  "Star",
  "Flag",
  "Landmark",
  "Store",
  "Printer",
  "Clock",
  "CalendarDays",
  "Users",
  "UserCheck",
  "Lock",
  "Key",
  "Bell",
  "Mail",
  "MessageCircle",
  "Globe",
  "Banknote",
  "CreditCard",
  "Ticket",
  "QrCode",
  "Video",
  "Speaker",
  "Tv2",
  "Monitor",
  "Smartphone",
  "AirVent",
  "Snowflake",
  "Wind",
  "Zap",
  "RadioTower",
  "Syringe",
  "Pill",
  "Stethoscope",
  "Map",
  "Navigation",
  "SignpostBig",
] as const;

export type FacilityIconName = (typeof FACILITY_ICONS)[number];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label = "Pilih Ikon" }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return FACILITY_ICONS;
    return FACILITY_ICONS.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Render the selected icon dynamically
  const SelectedIconComponent = value
    ? (LucideIcons as any)[value]
    : LucideIcons.Building;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          {SelectedIconComponent ? (
            <SelectedIconComponent className="w-5 h-5" />
          ) : (
            <LucideIcons.HelpCircle className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{value || "Belum dipilih"}</p>
          <p className="text-xs text-muted-foreground">Klik untuk memilih ikon</p>
        </div>
        <LucideIcons.ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Picker */}
      {open && (
        <div className="border rounded-xl bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari ikon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Icon Grid */}
          <div className="p-3 max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">
                Ikon tidak ditemukan
              </p>
            ) : (
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
                {filtered.map((iconName) => {
                  const IconComp = (LucideIcons as any)[iconName];
                  const isSelected = value === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      title={iconName}
                      onClick={() => {
                        onChange(iconName);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`relative group flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all hover:border-primary/60 hover:bg-primary/5 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-transparent text-muted-foreground"
                      }`}
                    >
                      {IconComp && <IconComp className="w-5 h-5" />}
                      {isSelected && (
                        <span className="absolute top-0.5 right-0.5">
                          <Check className="w-2.5 h-2.5 text-primary" />
                        </span>
                      )}
                      <span className="text-[9px] leading-tight text-center truncate w-full hidden group-hover:block">
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {filtered.length} ikon tersedia
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

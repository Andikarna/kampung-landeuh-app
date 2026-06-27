"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

// Kumpulan emoji yang relevan untuk kategori wisata, dikelompokkan per tema
const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Alam",
    emojis: ["🌿", "🌳", "🌲", "🌴", "🌵", "🍃", "🌾", "🍀", "🌺", "🌸", "🌼", "🌻", "🌹", "🍁", "🍂", "🌍", "🌊", "⛰️", "🏔️", "🗻", "🌋", "🏕️", "🏝️", "🌅", "🌄", "🌠", "🌌", "🌤️", "⛅", "🌈"],
  },
  {
    label: "Budaya & Seni",
    emojis: ["🎭", "🎪", "🎨", "🎬", "🎤", "🎵", "🎶", "🥁", "🎷", "🎺", "🎻", "🪕", "🎠", "🪅", "🪆", "🎎", "👘", "🪭", "🏺", "🗿", "🛕", "⛪", "🕌", "🕍", "🏛️", "🗼", "🗽", "🗺️"],
  },
  {
    label: "Edukasi",
    emojis: ["📚", "📖", "📝", "✏️", "🔬", "🔭", "🧬", "🧪", "🧫", "💡", "🎓", "🏫", "📐", "📏", "🖊️", "📓", "🧮", "🗂️", "📊", "🧑‍🏫"],
  },
  {
    label: "Kuliner",
    emojis: ["🍜", "🍚", "🍣", "🍱", "🥘", "🫕", "🥗", "🍲", "🍛", "🥩", "🍗", "🍖", "🌮", "🌯", "🥙", "🥪", "🍕", "🥚", "🧆", "🥦", "🍠", "🥜", "🫘", "🍌", "🥭", "🍍", "☕", "🍵", "🧃", "🫖"],
  },
  {
    label: "Pertanian",
    emojis: ["🌾", "🚜", "🌱", "🪴", "🌽", "🍅", "🥕", "🧅", "🧄", "🍓", "🫐", "🍈", "🥝", "🍒", "🌿", "🐄", "🐓", "🐑", "🐐", "🐇"],
  },
  {
    label: "Religi & Spiritual",
    emojis: ["🕌", "🛕", "⛪", "🕍", "🙏", "📿", "☪️", "✝️", "🕊️", "🌙", "⭐", "✨", "🔮", "🪬", "🧿", "📖", "🕯️", "🪔", "💫"],
  },
  {
    label: "Olahraga & Aktivitas",
    emojis: ["⛺", "🧗", "🏊", "🚵", "🤿", "🎣", "🏹", "🧘", "🏋️", "🤸", "🎯", "🪁", "🎽", "🏅", "🥇", "🎿", "🛶", "🚣", "🪂", "🧩"],
  },
  {
    label: "Perjalanan",
    emojis: ["🗺️", "🧳", "🎒", "🏕️", "🛖", "🏠", "🚗", "🚌", "🚂", "✈️", "⛵", "🚤", "🛺", "🛵", "🚲", "🛤️", "🗻", "🌅", "📍", "🧭"],
  },
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
}

export function EmojiPicker({ value, onChange, label = "Pilih Ikon Emoji" }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-xl shrink-0">
          {value || "❓"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{value ? `Terpilih: ${value}` : "Belum dipilih"}</p>
          <p className="text-xs text-muted-foreground">Klik untuk memilih emoji</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="border rounded-xl bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          {/* Category Tabs */}
          <div className="flex overflow-x-auto border-b bg-slate-50 dark:bg-slate-800/50 scrollbar-none">
            {EMOJI_GROUPS.map((group, idx) => (
              <button
                key={group.label}
                type="button"
                onClick={() => setActiveGroup(idx)}
                className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                  activeGroup === idx
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="p-3 max-h-56 overflow-y-auto">
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
              {EMOJI_GROUPS[activeGroup].emojis.map((emoji) => {
                const isSelected = value === emoji;
                return (
                  <button
                    key={emoji}
                    type="button"
                    title={emoji}
                    onClick={() => {
                      onChange(emoji);
                      setOpen(false);
                    }}
                    className={`relative flex items-center justify-center w-9 h-9 rounded-lg text-xl border transition-all hover:border-primary/60 hover:bg-primary/5 hover:scale-110 ${
                      isSelected
                        ? "border-primary bg-primary/10 scale-110 shadow-sm"
                        : "border-transparent"
                    }`}
                  >
                    {emoji}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="text-xs text-destructive hover:underline"
              >
                Hapus ikon
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground ml-auto px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

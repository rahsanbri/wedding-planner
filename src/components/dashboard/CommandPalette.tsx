"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  CalendarRange,
  CheckSquare,
  Church,
  FileBarChart,
  Search,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import { searchWeddingData } from "@/lib/search";
import type { SearchResultKind } from "@/lib/search";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  view: string;
  kindLabel: string;
  icon: LucideIcon;
}

const kindIcons: Record<SearchResultKind, LucideIcon> = {
  event: Church,
  budget: Wallet,
  guest: Users,
  vendor: Briefcase,
  checklist: CheckSquare,
  timeline: CalendarRange,
};

const kindLabels: Record<SearchResultKind, string> = {
  event: "Acara",
  budget: "Budget",
  guest: "Tamu",
  vendor: "Vendor",
  checklist: "Checklist",
  timeline: "Timeline",
};

const quickLinks: PaletteItem[] = [
  {
    id: "module:budget",
    title: "Budget Tracker",
    subtitle: "Rincian pos anggaran & pembayaran",
    view: "budget",
    kindLabel: "Modul",
    icon: Wallet,
  },
  {
    id: "module:guests",
    title: "Guest List & RSVP",
    subtitle: "Daftar tamu, meja, dan konfirmasi",
    view: "guests",
    kindLabel: "Modul",
    icon: Users,
  },
  {
    id: "module:vendors",
    title: "Vendor Database",
    subtitle: "Kontak dan progres pembayaran vendor",
    view: "vendors",
    kindLabel: "Modul",
    icon: Briefcase,
  },
  {
    id: "module:checklist",
    title: "Master Checklist",
    subtitle: "To-do lintas fase H-180 sampai Hari-H",
    view: "checklist",
    kindLabel: "Modul",
    icon: CheckSquare,
  },
  {
    id: "module:rundown",
    title: "Rundown & Timeline",
    subtitle: "Roadmap persiapan dan agenda Hari-H",
    view: "rundown",
    kindLabel: "Modul",
    icon: CalendarRange,
  },
  {
    id: "module:report",
    title: "Laporan & Export",
    subtitle: "Ringkasan siap cetak dan export data",
    view: "report",
    kindLabel: "Modul",
    icon: FileBarChart,
  },
  {
    id: "module:settings",
    title: "Pengaturan",
    subtitle: "Tanggal Hari H, target tamu, dan data",
    view: "settings",
    kindLabel: "Modul",
    icon: Settings,
  },
];

export function CommandPalette({ onClose, onNavigate }: CommandPaletteProps) {
  const { data } = useWeddingData();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useMemo(
    () => searchWeddingData(data, query),
    [data, query],
  );

  const items = useMemo<PaletteItem[]>(() => {
    if (query.trim().length === 0) return quickLinks;

    return results.map((result) => ({
      id: result.id,
      title: result.title,
      subtitle: result.subtitle,
      view: result.view,
      kindLabel: kindLabels[result.kind],
      icon: kindIcons[result.kind],
    }));
  }, [query, results]);

  const activeIndex = Math.min(selectedIndex, Math.max(0, items.length - 1));

  const choose = (item: PaletteItem) => {
    onNavigate(item.view);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((previous) => Math.min(previous + 1, items.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((previous) => Math.max(previous - 1, 0));
      return;
    }
    if (event.key === "Enter" && items[activeIndex]) {
      event.preventDefault();
      choose(items[activeIndex]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#3a281c]/40 backdrop-blur-xs flex items-start justify-center px-3 sm:px-4 pt-6 sm:pt-[10vh] print:hidden"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pencarian global"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
        className="w-full max-w-2xl rounded-3xl border border-[#ede4d8] bg-[#fdfaf7] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#ede4d8] bg-[#ffffff]">
          <Search className="w-5 h-5 text-[#c98858] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Cari tamu, vendor, tugas, budget, agenda..."
            aria-label="Cari data pernikahan"
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-[#3a281c] placeholder:text-[#6f5a49] focus:outline-hidden"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pencarian"
            className="p-1.5 rounded-lg text-[#7a6452] hover:text-[#3a281c] hover:bg-[#f3e7dc] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto custom-scrollbar p-2">
          {query.trim().length === 0 && (
            <p className="px-3 pt-2 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49]">
              Buka Modul
            </p>
          )}

          {query.trim().length > 0 && items.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-semibold text-[#3a281c]">
                Tidak ada hasil untuk &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#6f5a49] mt-1">
                Coba kata kunci lain seperti nama tamu, vendor, atau agenda.
              </p>
            </div>
          )}

          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => choose(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer",
                  isActive ? "bg-[#f1dfcf]" : "hover:bg-[#f8efe5]",
                )}
              >
                <span
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    isActive
                      ? "bg-[#c98858] text-white"
                      : "bg-[#faece0] text-[#b57a41]",
                  )}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-[#3a281c] truncate">
                    {item.title}
                  </span>
                  <span className="block text-[10.5px] text-[#6f5a49] truncate mt-0.5">
                    {item.subtitle}
                  </span>
                </span>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#78614f] bg-[#f3e7dc] px-2 py-0.5 rounded-md shrink-0">
                  {item.kindLabel}
                </span>
                <ArrowRight
                  className={cn(
                    "w-3.5 h-3.5 shrink-0",
                    isActive ? "text-[#6b3c1b]" : "text-[#bdafa2]",
                  )}
                />
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-[#ede4d8] bg-[#ffffff] flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-[#6f5a49]">
          <span>{items.length} hasil</span>
          <span className="flex items-center gap-3">
            <span>↑↓ navigasi</span>
            <span>Enter buka</span>
            <span>Esc tutup</span>
          </span>
        </div>
      </div>
    </div>
  );
}

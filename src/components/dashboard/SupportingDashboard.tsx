import React, { useState } from "react";
import { Wallet, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import {
  budgetSummary,
  categoryBreakdown,
  checklistSummary,
  formatRupiah,
  guestSummary,
} from "@/lib/selectors";
import { eventsDatabase } from "@/data/weddingEvents";
import type { BudgetItem } from "@/data/budgetData";

interface SupportingDashboardProps {
  onDetailClick?: (section: string) => void;
}

const categoryColors: Record<BudgetItem["category"], string> = {
  "Acara Utama": "#c98858",
  "Dekorasi & Venue": "#e3b5a4",
  Dokumentasi: "#b89569",
  "Katering & FnB": "#9ea873",
  "Busana & MUA": "#b85e6f",
  "Lain-lain": "#d8c3b0",
};

export function SupportingDashboard({ onDetailClick }: SupportingDashboardProps) {
  const { data } = useWeddingData();
  const [mode, setMode] = useState<"modul" | "ringkasan">("modul");
  const budget = budgetSummary(data.budgetItems);
  const guests = guestSummary(data.guests);
  const checklist = checklistSummary(data.checklist);
  const breakdown = categoryBreakdown(data.budgetItems);
  const nextMilestone = data.timeline.find(
    (milestone) => milestone.status !== "completed",
  );
  const totalContract = data.vendors.reduce(
    (sum, vendor) => sum + vendor.totalContract,
    0,
  );
  const averageVendorProgress =
    data.vendors.length > 0
      ? Math.round(
          data.vendors.reduce(
            (sum, vendor) => sum + vendor.paymentProgress,
            0,
          ) / data.vendors.length,
        )
      : 0;

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - budget.percentPaid / 100);

  const topCategories = breakdown.slice(0, 3);
  const otherCategories = breakdown.slice(3);
  const otherTotal = otherCategories.reduce((sum, item) => sum + item.estimated, 0);
  const filledGuestSlots =
    guests.totalInvitations > 0
      ? Math.round((guests.confirmed / guests.totalInvitations) * 10)
      : 0;
  const rundownHighlights = [0, 2, 3]
    .map((index) => eventsDatabase.resepsi.rundown[index])
    .filter(Boolean);

  return (
    <div className="space-y-3 sm:space-y-4 select-none">
      {/* Header with Modul / Ringkasan Switch */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-xl font-serif font-bold text-[#3a281c]">
          Supporting Dashboard
        </h2>
        <div className="flex items-center bg-[#f3e7dc] p-0.5 sm:p-1 rounded-full border border-[#ede1d5] text-xs">
          <button
            type="button"
            onClick={() => setMode("modul")}
            aria-pressed={mode === "modul"}
            className={cn(
              "px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs font-medium transition-colors cursor-pointer",
              mode === "modul"
                ? "bg-[#c98858] text-[#ffffff] shadow-xs"
                : "text-[#7a6452] hover:text-[#3a281c]",
            )}
          >
            Modul
          </button>
          <button
            type="button"
            onClick={() => setMode("ringkasan")}
            aria-pressed={mode === "ringkasan"}
            className={cn(
              "px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs font-medium transition-colors cursor-pointer",
              mode === "ringkasan"
                ? "bg-[#c98858] text-[#ffffff] shadow-xs"
                : "text-[#7a6452] hover:text-[#3a281c]",
            )}
          >
            Ringkasan
          </button>
        </div>
      </div>

      {/* 3 Widgets Grid */}
      {mode === "modul" && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        
        {/* WIDGET 1: Budget Breakdown */}
        <div className="soft-card p-3.5 sm:p-5 md:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="p-1 sm:p-1.5 rounded-lg bg-[#faece0] text-[#b57a41]">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#3a281c]">Budget Breakdown</h3>
            </div>
            <button 
              onClick={() => onDetailClick?.("budget")}
              aria-label="Lihat detail budget"
              className="text-[11px] sm:text-xs text-[#b07d57] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Detail →
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 my-auto">
            {/* Donut Chart Container */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  stroke="#f1e7da"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  stroke="#c98858"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-base font-serif font-bold text-[#3a281c] leading-none">
                  {budget.percentPaid}%
                </span>
                <span className="text-[9.5px] text-[#6f5a49] mt-0.5">Terbayar</span>
              </div>
            </div>

            {/* Breakdown Items */}
            <div className="flex-1 space-y-1.5 text-xs">
              {topCategories.map((item) => (
                <div key={item.category} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: categoryColors[item.category] }}
                    />
                    <span className="text-[#635345] truncate">{item.category}</span>
                  </div>
                  <span className="font-semibold text-[#3a281c] whitespace-nowrap">
                    {formatRupiah(item.estimated)}
                  </span>
                </div>
              ))}
              {otherTotal > 0 && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: categoryColors["Lain-lain"] }}
                    />
                    <span className="text-[#635345] truncate">
                      Lainnya ({otherCategories.length} kategori)
                    </span>
                  </div>
                  <span className="font-semibold text-[#3a281c] whitespace-nowrap">
                    {formatRupiah(otherTotal)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* WIDGET 2: Rundown Hari H */}
        <div className="soft-card p-3.5 sm:p-5 md:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="p-1 sm:p-1.5 rounded-lg bg-[#faece0] text-[#b57a41]">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#3a281c]">Rundown Hari H</h3>
            </div>
            <button 
              onClick={() => onDetailClick?.("rundown")}
              aria-label="Lihat seluruh rundown"
              className="text-[11px] sm:text-xs text-[#b07d57] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Semua →
            </button>
          </div>

          <div className="space-y-2 sm:space-y-3 relative pl-3 my-auto">
            <div className="absolute left-4 top-1.5 bottom-1.5 w-0.5 bg-[#ebd9c7]" />

            {rundownHighlights.map((item) => (
              <div key={item.time} className="flex items-center gap-2 sm:gap-3 relative z-10 text-xs">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-[#b57a41] bg-[#ffffff] shrink-0" />
                <span className="font-bold text-[#805030] w-11 sm:w-12 text-[11px] sm:text-[11.5px] shrink-0">
                  {item.time.split(" - ")[0]}
                </span>
                <span className="text-[#3a281c] font-medium truncate">{item.activity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 3: Status Tamu */}
        <div className="soft-card p-3.5 sm:p-5 md:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="p-1 sm:p-1.5 rounded-lg bg-[#faece0] text-[#b57a41]">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#3a281c]">Status Tamu</h3>
            </div>
            <button 
              onClick={() => onDetailClick?.("guests")}
              aria-label="Lihat detail status tamu"
              className="text-[11px] sm:text-xs text-[#b07d57] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Detail →
            </button>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold text-[#3a281c]">
                {guests.confirmed} / {data.settings.guestTarget}
              </span>
            </div>
            <p className="text-xs text-[#789d6e] font-semibold mt-0.5">
              {guests.percentConfirmed}% Konfirmasi dari {guests.totalInvitations} pax
            </p>

            {/* Silhouette Row */}
            <div className="flex items-center gap-1.5 my-3" aria-hidden="true">
              {[...Array(10)].map((_, i) => (
                <Users
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < filledGuestSlots ? "text-[#789d6e]" : "text-[#d8c3b0]",
                  )}
                />
              ))}
            </div>

            {/* Indicator Legend */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-[#6f5a49]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#789d6e]" />
                <span>Hadir ({guests.confirmed})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#d8c3b0]" />
                <span>Tidak Hadir ({guests.declined})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#e5c378]" />
                <span>Menunggu ({guests.pending})</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      )}

      {mode === "ringkasan" && (
        <div className="soft-card p-5 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0e6d8] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#3a281c]">
                Ringkasan Eksekutif
              </h3>
              <p className="text-[11px] text-[#6f5a49] mt-0.5">
                Kondisi perencanaan saat ini dalam satu tampilan.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f5a49] bg-[#f3e7dc] px-2.5 py-1 rounded-md w-fit">
              Live
            </span>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#fdfaf7] border border-[#f0e6d8]">
              <p className="text-[10px] uppercase tracking-wider text-[#6f5a49]">
                Anggaran
              </p>
              <p className="text-lg font-serif font-bold text-[#3a281c] mt-0.5">
                {formatRupiah(budget.totalEstimated)}
              </p>
              <p className="text-[10.5px] text-[#789d6e] font-semibold mt-0.5">
                {budget.percentPaid}% terbayar • sisa {formatRupiah(budget.remaining)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fdfaf7] border border-[#f0e6d8]">
              <p className="text-[10px] uppercase tracking-wider text-[#6f5a49]">
                Tamu
              </p>
              <p className="text-lg font-serif font-bold text-[#3a281c] mt-0.5">
                {guests.confirmed} / {data.settings.guestTarget}
              </p>
              <p className="text-[10.5px] text-[#6f5a49] mt-0.5">
                {guests.pending} pax menunggu konfirmasi
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fdfaf7] border border-[#f0e6d8]">
              <p className="text-[10px] uppercase tracking-wider text-[#6f5a49]">
                Checklist
              </p>
              <p className="text-lg font-serif font-bold text-[#3a281c] mt-0.5">
                {checklist.percent}%
              </p>
              <p className="text-[10.5px] text-[#6f5a49] mt-0.5">
                {checklist.completed} dari {checklist.total} item selesai
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fdfaf7] border border-[#f0e6d8]">
              <p className="text-[10px] uppercase tracking-wider text-[#6f5a49]">
                Vendor
              </p>
              <p className="text-lg font-serif font-bold text-[#3a281c] mt-0.5">
                {data.vendors.length} mitra
              </p>
              <p className="text-[10.5px] text-[#6f5a49] mt-0.5">
                {formatRupiah(totalContract)} • rata-rata {averageVendorProgress}%
              </p>
            </div>
          </div>

          {nextMilestone && (
            <div className="p-3.5 rounded-xl bg-[#faece0]/60 border border-[#edd5c0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9c8979]">
                  Agenda Berikutnya
                </p>
                <p className="text-xs font-bold text-[#3a281c] mt-0.5">
                  {nextMilestone.title}
                </p>
                <p className="text-[10.5px] text-[#6f5a49]">
                  {nextMilestone.dateFormatted} • {nextMilestone.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDetailClick?.("rundown")}
                className="text-xs font-semibold text-[#805030] hover:underline cursor-pointer w-fit"
              >
                Lihat Timeline →
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onDetailClick?.("budget")}
              className="px-3 py-1.5 rounded-lg bg-[#f3e7dc] text-[#78614f] text-[11px] font-semibold hover:bg-[#ede1d3] transition-colors cursor-pointer"
            >
              Buka Budget
            </button>
            <button
              type="button"
              onClick={() => onDetailClick?.("guests")}
              className="px-3 py-1.5 rounded-lg bg-[#f3e7dc] text-[#78614f] text-[11px] font-semibold hover:bg-[#ede1d3] transition-colors cursor-pointer"
            >
              Buka Tamu
            </button>
            <button
              type="button"
              onClick={() => onDetailClick?.("rundown")}
              className="px-3 py-1.5 rounded-lg bg-[#f3e7dc] text-[#78614f] text-[11px] font-semibold hover:bg-[#ede1d3] transition-colors cursor-pointer"
            >
              Buka Timeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

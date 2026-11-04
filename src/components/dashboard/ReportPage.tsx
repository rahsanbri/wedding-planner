"use client";

import React from "react";
import {
  ArrowLeft,
  Briefcase,
  CheckSquare,
  Download,
  Printer,
  Users,
  Wallet,
} from "lucide-react";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import {
  budgetSummary,
  categoryBreakdown,
  checklistSummary,
  formatRupiah,
  formatWeddingDate,
  groupChecklistByPhase,
  guestSummary,
} from "@/lib/selectors";
import { downloadFile } from "@/lib/download";

interface ReportPageProps {
  onBack: () => void;
}

const phaseOrder = [
  "H-180 s/d H-120",
  "H-90 s/d H-60",
  "H-30 s/d H-14",
  "H-7 s/d Hari-H",
] as const;

export function ReportPage({ onBack }: ReportPageProps) {
  const { data } = useWeddingData();
  const budget = budgetSummary(data.budgetItems);
  const categories = categoryBreakdown(data.budgetItems);
  const guests = guestSummary(data.guests);
  const checklist = checklistSummary(data.checklist);
  const groupedChecklist = groupChecklistByPhase(data.checklist);
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

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    downloadFile(
      "wedding-planner-backup.json",
      JSON.stringify(data, null, 2),
      "application/json",
    );
  };

  return (
    <div className="space-y-3.5 sm:space-y-6 pb-8 sm:pb-12 w-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-[#ede4d8] print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#805030] hover:text-[#3a281c] bg-[#ffffff] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-[#ede4d8] shadow-2xs hover:bg-[#faf5ef] transition-colors w-fit cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Kembali</span>
          <span className="hidden sm:inline">ke Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#ffffff] border border-[#ede4d8] text-[#6f5a49] text-[11px] sm:text-xs font-semibold hover:text-[#3a281c] hover:bg-[#faf5ef] shadow-2xs cursor-pointer"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">Export</span> JSON
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#c98858] text-[#ffffff] text-[11px] sm:text-xs font-semibold hover:brightness-105 shadow-2xs cursor-pointer"
          >
            <Printer className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      <div className="soft-card p-3.5 sm:p-6 md:p-8 bg-gradient-to-r from-[#faece1] via-[#f8e4d6] to-[#f4dccb] border border-[#ecd5c3] print:bg-none print:bg-white print:border-0 print:shadow-none print:p-0 print:pb-4">
        <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#7a4825]">
          Laporan Pernikahan
        </span>
        <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-[#3a281c] mt-0.5 sm:mt-1">
          Our Wedding — Ringkasan Laporan
        </h1>
        <p className="text-[11px] sm:text-sm text-[#7a6452] mt-1 sm:mt-2">
          Target Hari H: <strong>{formatWeddingDate(data.settings.targetDate)}</strong>{" "}
          • Target tamu: <strong>{data.settings.guestTarget} pax</strong>
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4">
        <div className="soft-card p-2.5 sm:p-5 print:break-inside-avoid flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[9px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">
              Anggaran
            </span>
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c98858] shrink-0" />
          </div>
          <p className="text-sm sm:text-xl font-serif font-bold text-[#3a281c] truncate">
            {formatRupiah(budget.totalEstimated)}
          </p>
          <p className="text-[9px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">
            {budget.percentPaid}% lunas • sisa {formatRupiah(budget.remaining)}
          </p>
        </div>

        <div className="soft-card p-5 print:break-inside-avoid">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49]">
              Tamu
            </span>
            <Users className="w-4 h-4 text-[#789d6e]" />
          </div>
          <p className="text-xl font-serif font-bold text-[#3a281c]">
            {guests.confirmed} / {data.settings.guestTarget}
          </p>
          <p className="text-[11px] text-[#6f5a49] mt-1">
            {guests.totalInvitations} pax terdata • {guests.pending} menunggu
          </p>
        </div>

        <div className="soft-card p-5 print:break-inside-avoid">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49]">
              Checklist
            </span>
            <CheckSquare className="w-4 h-4 text-[#b57a41]" />
          </div>
          <p className="text-xl font-serif font-bold text-[#3a281c]">
            {checklist.percent}%
          </p>
          <p className="text-[11px] text-[#6f5a49] mt-1">
            {checklist.completed} dari {checklist.total} item selesai
          </p>
        </div>

        <div className="soft-card p-5 print:break-inside-avoid">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49]">
              Vendor
            </span>
            <Briefcase className="w-4 h-4 text-[#9ea873]" />
          </div>
          <p className="text-xl font-serif font-bold text-[#3a281c]">
            {data.vendors.length} mitra
          </p>
          <p className="text-[11px] text-[#6f5a49] mt-1">
            {formatRupiah(totalContract)} • rata-rata {averageVendorProgress}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="soft-card p-6 print:break-inside-avoid">
          <h2 className="text-base font-serif font-bold text-[#3a281c] mb-3">
            Anggaran per Kategori
          </h2>
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#ede4d8] text-[#6f5a49] text-[10px] uppercase tracking-wider">
                  <th className="py-2 pr-3">Kategori</th>
                  <th className="py-2 px-3 text-right">Estimasi</th>
                  <th className="py-2 px-3 text-right">Terbayar</th>
                  <th className="py-2 pl-3 text-right">Sisa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1e7da]">
                {categories.map((category) => (
                  <tr key={category.category}>
                    <td className="py-2 pr-3 font-semibold text-[#3a281c]">
                      {category.category}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      {formatRupiah(category.estimated)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-[#789d6e]">
                      {formatRupiah(category.paid)}
                    </td>
                    <td className="py-2 pl-3 text-right font-mono text-[#805030]">
                      {formatRupiah(category.estimated - category.paid)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="soft-card p-6 print:break-inside-avoid">
          <h2 className="text-base font-serif font-bold text-[#3a281c] mb-3">
            Ringkasan RSVP
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-green-50/60 border border-green-100 text-center">
              <p className="text-lg font-serif font-bold text-green-800">
                {guests.confirmed}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">
                Hadir
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
              <p className="text-lg font-serif font-bold text-amber-800">
                {guests.pending}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Menunggu
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-50/60 border border-red-100 text-center">
              <p className="text-lg font-serif font-bold text-red-800">
                {guests.declined}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                Tidak Hadir
              </p>
            </div>
          </div>
          <p className="text-[11px] text-[#6f5a49] mt-3">
            Total {guests.totalEntries} entri undangan dengan {guests.totalInvitations} pax.
            Tingkat konfirmasi {guests.percentConfirmed}%.
          </p>
        </div>

        <div className="soft-card p-6 print:break-inside-avoid">
          <h2 className="text-base font-serif font-bold text-[#3a281c] mb-3">
            Checklist per Fase
          </h2>
          <div className="space-y-2">
            {phaseOrder.map((phase) => {
              const items = groupedChecklist[phase];
              const done = items.filter((item) => item.completed).length;
              const percent =
                items.length > 0 ? Math.round((done / items.length) * 100) : 0;
              return (
                <div key={phase} className="p-2.5 rounded-xl bg-[#fdfaf7] border border-[#f0e6d8]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#3a281c]">{phase}</span>
                    <span className="text-[#6f5a49]">
                      {done}/{items.length} • {percent}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#f1e7da] rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-[#789d6e] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="soft-card p-6 print:break-inside-avoid">
          <h2 className="text-base font-serif font-bold text-[#3a281c] mb-3">
            Vendor & Pembayaran
          </h2>
          <div className="space-y-2">
            {data.vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#fdfaf7] border border-[#f0e6d8]"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#3a281c] truncate">
                    {vendor.name}
                  </p>
                  <p className="text-[10px] text-[#6f5a49]">
                    {vendor.category} • {vendor.contactPerson}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-mono font-bold text-[#3a281c]">
                    {formatRupiah(vendor.totalContract)}
                  </p>
                  <p className="text-[10px] text-[#789d6e] font-semibold">
                    {vendor.paymentProgress}% terbayar
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="soft-card p-6 print:break-inside-avoid">
        <h2 className="text-base font-serif font-bold text-[#3a281c] mb-3">
          Agenda Timeline Mendatang
        </h2>
        <div className="space-y-2">
          {data.timeline
            .filter((milestone) => milestone.status !== "completed")
            .slice(0, 8)
            .map((milestone) => (
            <div
              key={milestone.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-xl bg-[#fdfaf7] border border-[#f0e6d8]"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#3a281c] truncate">
                  {milestone.title}
                </p>
                <p className="text-[10px] text-[#6f5a49]">
                  {milestone.dateFormatted} • {milestone.pillar} • {milestone.location}
                </p>
              </div>
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#6f5a49] bg-[#f3e7dc] px-2 py-0.5 rounded-md shrink-0">
                {milestone.phaseName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Wallet, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download
} from "lucide-react";
import { BudgetItem } from "@/data/budgetData";
import { cn, createId } from "@/lib/utils";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import {
  budgetStatusBreakdown,
  budgetSummary,
  categoryBreakdown,
  formatRupiah,
} from "@/lib/selectors";
import { budgetToCsv } from "@/lib/csv";
import { downloadFile } from "@/lib/download";

interface BudgetPageProps {
  onBack: () => void;
  initialShowAddForm?: boolean;
}

type SortField = "title" | "category" | "vendorName" | "estimatedBudget" | "actualPaid" | "paymentStatus";
type SortOrder = "asc" | "desc";

const statusMeta: Record<
  BudgetItem["paymentStatus"],
  { label: string; className: string; dot: string }
> = {
  lunas: {
    label: "Lunas",
    className: "bg-green-50/60 border-green-100 text-green-800",
    dot: "bg-green-500",
  },
  dp: {
    label: "DP / Uang Muka",
    className: "bg-amber-50/60 border-amber-100 text-amber-800",
    dot: "bg-amber-500",
  },
  belum_bayar: {
    label: "Belum Bayar",
    className: "bg-red-50/60 border-red-100 text-red-800",
    dot: "bg-red-500",
  },
};

export function BudgetPage({ onBack, initialShowAddForm = false }: BudgetPageProps) {
  const { data, setBudgetItems } = useWeddingData();
  const items = data.budgetItems;
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(initialShowAddForm);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>("category");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // New Item State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<BudgetItem["category"]>("Acara Utama");
  const [newVendor, setNewVendor] = useState("");
  const [newEstimate, setNewEstimate] = useState<number | "">("");
  const [newPaid, setNewPaid] = useState<number | "">("");
  const [newStatus, setNewStatus] = useState<BudgetItem["paymentStatus"]>("dp");
  const [newNotes, setNewNotes] = useState("");

  // Edit Item State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editEstimate, setEditEstimate] = useState<number>(0);
  const [editPaid, setEditPaid] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<BudgetItem["paymentStatus"]>("dp");

  // Calculations
  const {
    totalEstimated,
    totalPaid,
    remaining: remainingDue,
    percentPaid: percentagePaid,
  } = budgetSummary(items);
  const categoryTotals = categoryBreakdown(items);
  const statusTotals = budgetStatusBreakdown(items);

  const handleExportCsv = () => {
    downloadFile("budget-wedding.csv", budgetToCsv(items), "text/csv;charset=utf-8");
  };

  // Sorting Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Add Item Handler
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newEstimate) return;

    const newItem: BudgetItem = {
      id: createId("b"),
      title: newTitle.trim(),
      category: newCategory,
      vendorName: newVendor.trim() || "Belum ditentukan",
      estimatedBudget: Number(newEstimate),
      actualPaid: Number(newPaid || 0),
      paymentStatus: Number(newPaid || 0) >= Number(newEstimate) ? "lunas" : newStatus,
      notes: newNotes.trim() || "-",
    };

    setBudgetItems((previous) => [newItem, ...previous]);
    setNewTitle("");
    setNewVendor("");
    setNewEstimate("");
    setNewPaid("");
    setNewNotes("");
    setShowAddForm(false);
  };

  // Start Edit
  const handleStartEdit = (item: BudgetItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditEstimate(item.estimatedBudget);
    setEditPaid(item.actualPaid);
    setEditStatus(item.paymentStatus);
  };

  // Save Edit
  const handleSaveEdit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    setBudgetItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: editTitle.trim() || item.title,
              estimatedBudget: Number(editEstimate),
              actualPaid: Number(editPaid),
              paymentStatus: Number(editPaid) >= Number(editEstimate) ? "lunas" : editStatus,
            }
          : item
      )
    );
    setEditingId(null);
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    if (confirm("Hapus pos anggaran ini?")) {
      setBudgetItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Filter & Sort Items
  const sortedAndFilteredItems = [...items]
    .filter((item) => {
      if (filterCategory === "all") return true;
      return item.category === filterCategory;
    })
    .sort((a, b) => {
      const valA: string | number = a[sortField];
      const valB: string | number = b[sortField];

      if (typeof valA === "string") {
        const compareRes = valA.localeCompare(valB as string);
        return sortOrder === "asc" ? compareRes : -compareRes;
      } else {
        return sortOrder === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
    });

  // Header Sort Icon Helper
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#bfaea0] ml-1 opacity-70 group-hover:opacity-100" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#c98858] ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#c98858] ml-1" />
    );
  };

  return (
    <div className="space-y-3.5 sm:space-y-6 pb-8 sm:pb-12 w-full animate-in fade-in duration-300">
      {/* Header Back Button */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#ede4d8] gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#805030] hover:text-[#3a281c] bg-[#ffffff] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-[#ede4d8] shadow-2xs hover:bg-[#faf5ef] transition-colors w-fit cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Kembali</span>
          <span className="hidden sm:inline">ke Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#6f5a49] shrink-0">
          <span className="hidden sm:inline">Realisasi:</span>
          <span className="font-bold text-[#789d6e] bg-green-50/80 px-2 py-0.5 rounded-md border border-green-200 text-[11px] sm:text-xs">
            {percentagePaid}% Terbayar
          </span>
        </div>
      </div>

      {/* KPI Stats Cards Row (3-col compact on mobile) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {/* Total Target Anggaran */}
        <div className="soft-card p-2.5 sm:p-5 bg-gradient-to-br from-[#ffffff] to-[#fbf7f2] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">
              Target
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#faece0] text-[#b57a41] flex items-center justify-center shrink-0">
              <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h2 className="text-sm sm:text-2xl font-serif font-bold text-[#3a281c] truncate">
            {formatRupiah(totalEstimated)}
          </h2>
          <p className="text-[9px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">{items.length} Pos Alokasi</p>
        </div>

        {/* Realisasi Pembayaran */}
        <div className="soft-card p-2.5 sm:p-5 bg-gradient-to-br from-[#ffffff] to-[#fbf7f2] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">
              Terbayar
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h2 className="text-sm sm:text-2xl font-serif font-bold text-[#789d6e] truncate">
            {formatRupiah(totalPaid)}
          </h2>
          <p className="text-[9px] sm:text-[11px] text-[#789d6e] font-semibold mt-0.5 sm:mt-1 truncate">{percentagePaid}% Total</p>
        </div>

        {/* Sisa Tagihan */}
        <div className="soft-card p-2.5 sm:p-5 bg-gradient-to-br from-[#ffffff] to-[#fbf7f2] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">
              Sisa Tagihan
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h2 className="text-sm sm:text-2xl font-serif font-bold text-[#b57a41] truncate">
            {formatRupiah(remainingDue)}
          </h2>
          <p className="text-[9px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">Jatuh Tempo H-7</p>
        </div>
      </div>

      {/* Analytics Card */}
      <div className="soft-card p-3.5 sm:p-6 space-y-3 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0e6d8] pb-3">
          <div>
            <h3 className="text-base font-serif font-bold text-[#3a281c]">
              Analitik Anggaran
            </h3>
            <p className="text-xs text-[#6f5a49] mt-0.5">
              Realisasi pembayaran per kategori dan status.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#f3e7dc] text-[#78614f] font-semibold border border-[#ede1d5]">
            {items.length} pos • {percentagePaid}% terbayar
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49]">
              Realisasi per Kategori
            </p>
            {categoryTotals.map((category) => {
              const percent =
                category.estimated > 0
                  ? Math.round((category.paid / category.estimated) * 100)
                  : 0;

              return (
                <div key={category.category} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-semibold text-[#3a281c] truncate">
                      {category.category}
                    </span>
                    <span className="text-[#6f5a49] shrink-0">
                      {formatRupiah(category.paid)} / {formatRupiah(category.estimated)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#f1e7da] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c98858] rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#6f5a49]">{percent}% terbayar</p>
                </div>
              );
            })}
          </div>

          <div className="space-y-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49]">
              Status Pembayaran
            </p>
            {statusTotals.map((status) => {
              const meta = statusMeta[status.status];
              return (
                <div
                  key={status.status}
                  className={cn(
                    "flex items-center justify-between gap-3 p-3 rounded-xl border",
                    meta.className,
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", meta.dot)} />
                    <div>
                      <p className="text-xs font-bold">{meta.label}</p>
                      <p className="text-[10.5px] opacity-80">{status.count} pos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">{formatRupiah(status.estimated)}</p>
                    <p className="text-[10.5px] opacity-80">
                      Terbayar {formatRupiah(status.paid)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Budget Table Card */}
      <div className="soft-card p-3 sm:p-6 space-y-3 sm:space-y-4">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-[#f0e6d8] pb-3 sm:pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#3a281c]">
              Rincian Pos Anggaran & Pembayaran Vendor
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filter kategori anggaran"
              className="px-3 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs font-semibold text-[#3a281c]"
            >
              <option value="all">Semua Kategori</option>
              <option value="Acara Utama">Acara Utama</option>
              <option value="Dekorasi & Venue">Dekorasi & Venue</option>
              <option value="Dokumentasi">Dokumentasi</option>
              <option value="Katering & FnB">Katering & FnB</option>
              <option value="Busana & MUA">Busana & MUA</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#ffffff] border border-[#ede4d8] text-[#6f5a49] text-xs font-semibold hover:text-[#3a281c] hover:bg-[#faf5ef] shadow-2xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#c98858] text-[#ffffff] text-xs font-semibold hover:brightness-105 shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pos Anggaran</span>
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="p-4 rounded-xl bg-[#fdfaf7] border border-[#ede4d8] space-y-3">
            <h4 className="text-xs font-bold text-[#3a281c]">Tambah Pos Biaya / Tagihan Baru</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Nama Pengeluaran (contoh: Souvenir VIP)"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs sm:col-span-2"
                required
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as BudgetItem["category"])}
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              >
                <option value="Acara Utama">Acara Utama</option>
                <option value="Dekorasi & Venue">Dekorasi & Venue</option>
                <option value="Dokumentasi">Dokumentasi</option>
                <option value="Katering & FnB">Katering & FnB</option>
                <option value="Busana & MUA">Busana & MUA</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                value={newVendor}
                onChange={(e) => setNewVendor(e.target.value)}
                placeholder="Nama Vendor / PIC"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              />
              <input
                type="number"
                value={newEstimate}
                onChange={(e) => setNewEstimate(e.target.value ? Number(e.target.value) : "")}
                placeholder="Estimasi Total (Rp)"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
                required
              />
              <input
                type="number"
                value={newPaid}
                onChange={(e) => setNewPaid(e.target.value ? Number(e.target.value) : "")}
                placeholder="Telah Dibayar (Rp)"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              />
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as BudgetItem["paymentStatus"])}
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              >
                <option value="dp">Status: DP / Uang Muka</option>
                <option value="lunas">Status: Lunas</option>
                <option value="belum_bayar">Status: Belum Bayar</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-[#6f5a49]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#c98858] text-white text-xs font-semibold hover:brightness-105"
              >
                Simpan Pos Anggaran
              </button>
            </div>
          </form>
        )}

        {/* Table View dengan Interactive Sortable Headers */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#ede4d8] text-[#6f5a49] text-[10.5px] uppercase font-bold tracking-wider select-none">
                {/* Column 1: Pos Pengeluaran */}
                <th 
                  onClick={() => handleSort("title")}
                  className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group transition-colors"
                >
                  <div className="flex items-center">
                    <span>Pos Pengeluaran</span>
                    {renderSortIcon("title")}
                  </div>
                </th>

                {/* Column 2: Kategori */}
                <th 
                  onClick={() => handleSort("category")}
                  className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group transition-colors"
                >
                  <div className="flex items-center">
                    <span>Kategori</span>
                    {renderSortIcon("category")}
                  </div>
                </th>

                {/* Column 3: Vendor */}
                <th 
                  onClick={() => handleSort("vendorName")}
                  className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group transition-colors"
                >
                  <div className="flex items-center">
                    <span>Vendor / PIC</span>
                    {renderSortIcon("vendorName")}
                  </div>
                </th>

                {/* Column 4: Target Estimasi */}
                <th 
                  onClick={() => handleSort("estimatedBudget")}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#3a281c] group transition-colors"
                >
                  <div className="flex items-center justify-end">
                    <span>Target Estimasi</span>
                    {renderSortIcon("estimatedBudget")}
                  </div>
                </th>

                {/* Column 5: Telah Terbayar */}
                <th 
                  onClick={() => handleSort("actualPaid")}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#3a281c] group transition-colors"
                >
                  <div className="flex items-center justify-end">
                    <span>Telah Terbayar</span>
                    {renderSortIcon("actualPaid")}
                  </div>
                </th>

                {/* Column 6: Status */}
                <th 
                  onClick={() => handleSort("paymentStatus")}
                  className="py-3 px-3 text-center cursor-pointer hover:text-[#3a281c] group transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <span>Status</span>
                    {renderSortIcon("paymentStatus")}
                  </div>
                </th>

                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1e7da]">
              {sortedAndFilteredItems.map((item) => {
                const isEditing = editingId === item.id;

                if (isEditing) {
                  return (
                    <tr key={item.id} className="bg-[#fef9f5]">
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                        />
                      </td>
                      <td className="py-3 px-3 text-[#7a6452]">{item.category}</td>
                      <td className="py-3 px-3 text-[#7a6452]">{item.vendorName}</td>
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          value={editEstimate}
                          onChange={(e) => setEditEstimate(Number(e.target.value))}
                          className="w-28 px-2 py-1 bg-white border border-[#c98858] rounded text-xs text-right"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          value={editPaid}
                          onChange={(e) => setEditPaid(Number(e.target.value))}
                          className="w-28 px-2 py-1 bg-white border border-[#c98858] rounded text-xs text-right"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as BudgetItem["paymentStatus"])}
                          className="px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                        >
                          <option value="lunas">Lunas</option>
                          <option value="dp">DP</option>
                          <option value="belum_bayar">Belum Bayar</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => handleSaveEdit(item.id, e)}
                            className="p-1 rounded bg-[#789d6e] text-white hover:brightness-105"
                            title="Simpan"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded bg-[#ded3c5] text-[#3a281c]"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={item.id} className="hover:bg-[#faf5ef] transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#3a281c]">{item.title}</p>
                      {item.notes && <p className="text-[10px] text-[#6f5a49] mt-0.5">{item.notes}</p>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#f3e7dc] text-[#78614f] text-[10px] font-semibold whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#554437] font-medium">{item.vendorName}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#3a281c]">
                      {formatRupiah(item.estimatedBudget)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-[#789d6e]">
                      {formatRupiah(item.actualPaid)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn(
                        "text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        item.paymentStatus === "lunas" ? "bg-green-100 text-green-700" :
                        item.paymentStatus === "dp" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {item.paymentStatus === "lunas" ? "Lunas" : item.paymentStatus === "dp" ? "DP Terbayar" : "Belum Bayar"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1 rounded bg-[#ffffff] border border-[#ede4d8] text-[#7a6452] hover:text-[#3a281c]"
                          title="Edit Pos Anggaran"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                          title="Hapus Pos Anggaran"
                          aria-label={`Hapus ${item.title}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {sortedAndFilteredItems.map((item) => {
            const isEditing = editingId === item.id;

            if (isEditing) {
              return (
                <form
                  key={item.id}
                  onSubmit={(event) => handleSaveEdit(item.id, event)}
                  className="p-4 rounded-2xl border border-[#c98858]/40 bg-[#fef9f5] space-y-2.5"
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    aria-label="Judul pos anggaran"
                    className="w-full px-2.5 py-1.5 bg-white border border-[#c98858] rounded-lg text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={editEstimate}
                      onChange={(event) => setEditEstimate(Number(event.target.value))}
                      aria-label="Target estimasi"
                      className="w-full px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      value={editPaid}
                      onChange={(event) => setEditPaid(Number(event.target.value))}
                      aria-label="Telah terbayar"
                      className="w-full px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    />
                  </div>
                  <select
                    value={editStatus}
                    onChange={(event) =>
                      setEditStatus(event.target.value as BudgetItem["paymentStatus"])
                    }
                    aria-label="Status pembayaran"
                    className="w-full px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                  >
                    <option value="lunas">Lunas</option>
                    <option value="dp">DP</option>
                    <option value="belum_bayar">Belum Bayar</option>
                  </select>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-[#ded3c5] text-[#3a281c] text-xs font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-[#789d6e] text-white text-xs font-semibold"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              );
            }

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-[#f0e6d8] bg-[#fdfaf7] space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#3a281c]">{item.title}</p>
                    <p className="text-[10.5px] text-[#6f5a49] mt-0.5">
                      {item.vendorName}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                      item.paymentStatus === "lunas"
                        ? "bg-green-100 text-green-700"
                        : item.paymentStatus === "dp"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700",
                    )}
                  >
                    {statusMeta[item.paymentStatus].label}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded-md bg-[#f3e7dc] text-[#78614f] font-semibold">
                    {item.category}
                  </span>
                  {item.notes && (
                    <span className="text-[#6f5a49] truncate">{item.notes}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-white border border-[#ede4d8]">
                    <p className="text-[9.5px] uppercase tracking-wider text-[#6f5a49]">
                      Estimasi
                    </p>
                    <p className="text-[11px] font-mono font-bold text-[#3a281c]">
                      {formatRupiah(item.estimatedBudget)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-[#ede4d8]">
                    <p className="text-[9.5px] uppercase tracking-wider text-[#6f5a49]">
                      Terbayar
                    </p>
                    <p className="text-[11px] font-mono font-bold text-[#789d6e]">
                      {formatRupiah(item.actualPaid)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#ede4d8] text-[#6f5a49] text-[11px] font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-[11px] font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

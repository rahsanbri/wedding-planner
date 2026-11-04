"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download
} from "lucide-react";
import { Guest } from "@/data/supportingData";
import { cn, createId } from "@/lib/utils";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import { guestCategoryBreakdown, guestSummary } from "@/lib/selectors";
import { guestsToCsv } from "@/lib/csv";
import { downloadFile } from "@/lib/download";

interface GuestsPageProps {
  onBack: () => void;
  initialShowAddForm?: boolean;
}

type GuestSortField = "name" | "category" | "tableNumber" | "invitationCount" | "rsvpStatus";
type SortOrder = "asc" | "desc";

export function GuestsPage({ onBack, initialShowAddForm = false }: GuestsPageProps) {
  const { data, setGuests } = useWeddingData();
  const guests = data.guests;
  const [filterRsvp, setFilterRsvp] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(initialShowAddForm);

  // Sorting
  const [sortField, setSortField] = useState<GuestSortField>("category");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Add State
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Guest["category"]>("VIP");
  const [newCount, setNewCount] = useState<number>(2);
  const [newTable, setNewTable] = useState("Table-01");
  const [newRsvp, setNewRsvp] = useState<Guest["rsvpStatus"]>("hadir");
  const [newAttendance, setNewAttendance] = useState<Guest["attendanceEvent"]>("Semua Acara");
  const [newPhone, setNewPhone] = useState("");

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<Guest["category"]>("VIP");
  const [editTable, setEditTable] = useState("");
  const [editCount, setEditCount] = useState<number>(2);
  const [editRsvp, setEditRsvp] = useState<Guest["rsvpStatus"]>("hadir");

  // Calculations
  const {
    totalEntries,
    totalInvitations,
    confirmed: totalConfirmed,
    declined: totalDeclined,
    pending: totalPending,
    percentConfirmed,
  } = guestSummary(guests);
  const categoryTotals = guestCategoryBreakdown(guests);
  const percentOfTotal = (value: number) =>
    totalInvitations > 0 ? Math.round((value / totalInvitations) * 100) : 0;

  const handleExportCsv = () => {
    downloadFile("tamu-wedding.csv", guestsToCsv(guests), "text/csv;charset=utf-8");
  };

  // Sort Handler
  const handleSort = (field: GuestSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newGuest: Guest = {
      id: createId("guest"),
      name: newName.trim(),
      category: newCategory,
      invitationCount: Number(newCount || 1),
      tableNumber: newTable.trim() || "Unassigned",
      rsvpStatus: newRsvp,
      attendanceEvent: newAttendance,
      phone: newPhone.trim() || "-",
    };

    setGuests((previous) => [newGuest, ...previous]);
    setNewName("");
    setNewPhone("");
    setShowAddForm(false);
  };

  const handleStartEdit = (g: Guest) => {
    setEditingId(g.id);
    setEditName(g.name);
    setEditCategory(g.category);
    setEditTable(g.tableNumber);
    setEditCount(g.invitationCount);
    setEditRsvp(g.rsvpStatus);
  };

  const handleSaveEdit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    setGuests((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              name: editName.trim() || g.name,
              category: editCategory,
              tableNumber: editTable.trim() || g.tableNumber,
              invitationCount: Number(editCount),
              rsvpStatus: editRsvp,
            }
          : g
      )
    );
    setEditingId(null);
  };

  const handleDeleteGuest = (id: string) => {
    if (confirm("Hapus data tamu ini?")) {
      setGuests((prev) => prev.filter((g) => g.id !== id));
    }
  };

  // Filter & Search & Sort
  const filteredAndSortedGuests = [...guests]
    .filter((g) => {
      const matchRsvp = filterRsvp === "all" || g.rsvpStatus === filterRsvp;
      const matchSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRsvp && matchSearch;
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

  const renderSortIcon = (field: GuestSortField) => {
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
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#ede4d8] gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#805030] hover:text-[#3a281c] bg-[#ffffff] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-[#ede4d8] shadow-2xs hover:bg-[#faf5ef] transition-colors w-fit cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Kembali</span>
          <span className="hidden sm:inline">ke Dashboard</span>
        </button>

        <div className="text-xs text-[#6f5a49] shrink-0">
          <span className="hidden sm:inline">Total Tamu Hadir: </span>
          <strong className="text-[#789d6e] font-bold bg-green-50/80 px-2 py-0.5 rounded-md border border-green-200 text-[11px] sm:text-xs">
            {totalConfirmed} Pax Hadir
          </strong>
        </div>
      </div>

      {/* KPI Cards Row (2x2 on mobile, 4-col on tablet/desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <div className="soft-card p-2.5 sm:p-4.5 bg-gradient-to-br from-[#ffffff] to-[#fbf7f2]">
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">Total Undangan</span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c98858] shrink-0" />
          </div>
          <h2 className="text-base sm:text-2xl font-serif font-bold text-[#3a281c]">{totalEntries} Entri</h2>
          <p className="text-[9.5px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">{totalInvitations} Pax Kursi</p>
        </div>

        <div className="soft-card p-2.5 sm:p-4.5 bg-gradient-to-br from-[#ffffff] to-[#fbf7f2]">
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">Konfirmasi Hadir</span>
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#789d6e] shrink-0" />
          </div>
          <h2 className="text-base sm:text-2xl font-serif font-bold text-[#789d6e]">{totalConfirmed} Pax</h2>
          <p className="text-[9.5px] sm:text-[11px] text-[#789d6e] font-semibold mt-0.5 sm:mt-1 truncate">{percentConfirmed}% RSVP</p>
        </div>

        <div className="soft-card p-2.5 sm:p-4.5 bg-gradient-to-br from-[#ffffff] to-[#fbf7f2]">
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">Berhalangan</span>
            <UserX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" />
          </div>
          <h2 className="text-base sm:text-2xl font-serif font-bold text-red-700">{totalDeclined} Pax</h2>
          <p className="text-[9.5px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">Tidak hadir</p>
        </div>

        <div className="soft-card p-2.5 sm:p-4.5 bg-gradient-to-br from-[#ffffff] to-[#fbf7f2]">
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">Menunggu</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
          </div>
          <h2 className="text-base sm:text-2xl font-serif font-bold text-amber-700">{totalPending} Pax</h2>
          <p className="text-[9.5px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">Follow-up H-14</p>
        </div>
      </div>

      {/* Analytics Card */}
      <div className="soft-card p-3 sm:p-6 space-y-3 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0e6d8] pb-3">
          <div>
            <h3 className="text-base font-serif font-bold text-[#3a281c]">
              Analitik Tamu
            </h3>
            <p className="text-xs text-[#6f5a49] mt-0.5">
              Sebaran pax per kategori dan komposisi konfirmasi.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#f3e7dc] text-[#78614f] font-semibold border border-[#ede1d5]">
            {totalEntries} entri • {totalInvitations} pax
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49]">
              Sebaran Pax per Kategori
            </p>
            {categoryTotals.map((category) => {
              const percent =
                category.pax > 0
                  ? Math.round((category.confirmed / category.pax) * 100)
                  : 0;

              return (
                <div key={category.category} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-semibold text-[#3a281c]">
                      {category.category}
                    </span>
                    <span className="text-[#6f5a49]">
                      {category.confirmed} / {category.pax} pax
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#f1e7da] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#789d6e] rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#6f5a49]">
                    {category.entries} entri • {percent}% konfirmasi
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49]">
              Komposisi RSVP
            </p>
            <div className="h-3 rounded-full overflow-hidden flex bg-[#f1e7da]">
              <div
                className="bg-[#789d6e]"
                style={{ width: `${percentConfirmed}%` }}
              />
              <div
                className="bg-[#e5c378]"
                style={{ width: `${percentOfTotal(totalPending)}%` }}
              />
              <div
                className="bg-[#e11d48]"
                style={{ width: `${percentOfTotal(totalDeclined)}%` }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50/60 border border-green-100 text-green-800">
                <span className="text-xs font-bold">Hadir</span>
                <span className="text-xs font-bold">
                  {totalConfirmed} pax • {percentConfirmed}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-amber-800">
                <span className="text-xs font-bold">Menunggu</span>
                <span className="text-xs font-bold">
                  {totalPending} pax • {percentOfTotal(totalPending)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/60 border border-red-100 text-red-800">
                <span className="text-xs font-bold">Tidak Hadir</span>
                <span className="text-xs font-bold">
                  {totalDeclined} pax • {percentOfTotal(totalDeclined)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="soft-card p-3 sm:p-6 space-y-3 sm:space-y-4">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-[#f0e6d8] pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#3a281c]">
              Daftar Tamu Undangan & Seating Chart Meja
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filterRsvp}
              onChange={(e) => setFilterRsvp(e.target.value)}
              aria-label="Filter status RSVP"
              className="px-3 py-1.5 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs font-semibold text-[#3a281c]"
            >
              <option value="all">Semua RSVP</option>
              <option value="hadir">Hadir</option>
              <option value="menunggu">Menunggu</option>
              <option value="tidak_hadir">Tidak Hadir</option>
            </select>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6f5a49] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, meja, VIP..."
                aria-label="Cari tamu"
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] w-52"
              />
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#ffffff] border border-[#ede4d8] text-[#6f5a49] text-xs font-semibold hover:text-[#3a281c] hover:bg-[#faf5ef] shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#c98858] text-[#ffffff] text-xs font-semibold hover:brightness-105 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Tamu</span>
            </button>
          </div>
        </div>

        {/* Form Tambah Tamu */}
        {showAddForm && (
          <form onSubmit={handleAddGuest} className="p-4 rounded-xl bg-[#fdfaf7] border border-[#ede4d8] space-y-3">
            <h4 className="text-xs font-bold text-[#3a281c]">Tambah Tamu Undangan Baru</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nama Tamu & Gelar / Partner"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs sm:col-span-2"
                required
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Guest["category"])}
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              >
                <option value="VIP">VIP</option>
                <option value="Keluarga Inti">Keluarga Inti</option>
                <option value="Sahabat & Teman">Sahabat & Teman</option>
                <option value="Rekan Kerja">Rekan Kerja</option>
              </select>
              <input
                type="text"
                value={newTable}
                onChange={(e) => setNewTable(e.target.value)}
                placeholder="Nomor Meja (cth: VIP-01)"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="number"
                value={newCount}
                onChange={(e) => setNewCount(Number(e.target.value))}
                placeholder="Jumlah Kursi / Pax"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
                required
              />
              <select
                value={newRsvp}
                onChange={(e) => setNewRsvp(e.target.value as Guest["rsvpStatus"])}
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              >
                <option value="hadir">Status: Hadir</option>
                <option value="tidak_hadir">Status: Tidak Hadir</option>
                <option value="menunggu">Status: Menunggu</option>
              </select>
              <select
                value={newAttendance}
                onChange={(e) => setNewAttendance(e.target.value as Guest["attendanceEvent"])}
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              >
                <option value="Semua Acara">Semua Acara</option>
                <option value="Hanya Gereja">Hanya Gereja</option>
                <option value="Hanya Resepsi">Hanya Resepsi</option>
                <option value="Midodareni">Midodareni</option>
              </select>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Nomor WhatsApp"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              />
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
                Simpan Tamu
              </button>
            </div>
          </form>
        )}

        {/* Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#ede4d8] text-[#6f5a49] text-[10.5px] uppercase font-bold tracking-wider select-none">
                <th onClick={() => handleSort("name")} className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center">
                    <span>Nama Tamu Undangan</span>
                    {renderSortIcon("name")}
                  </div>
                </th>
                <th onClick={() => handleSort("category")} className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center">
                    <span>Kategori</span>
                    {renderSortIcon("category")}
                  </div>
                </th>
                <th onClick={() => handleSort("tableNumber")} className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center">
                    <span>Meja / Seating</span>
                    {renderSortIcon("tableNumber")}
                  </div>
                </th>
                <th onClick={() => handleSort("invitationCount")} className="py-3 px-3 text-center cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center justify-center">
                    <span>Pax Kursi</span>
                    {renderSortIcon("invitationCount")}
                  </div>
                </th>
                <th onClick={() => handleSort("rsvpStatus")} className="py-3 px-3 text-center cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center justify-center">
                    <span>RSVP Status</span>
                    {renderSortIcon("rsvpStatus")}
                  </div>
                </th>
                <th className="py-3 px-3">Rangkaian Acara</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1e7da]">
              {filteredAndSortedGuests.map((guest) => {
                const isEditing = editingId === guest.id;

                if (isEditing) {
                  return (
                    <tr key={guest.id} className="bg-[#fef9f5]">
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as Guest["category"])}
                          className="px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                        >
                          <option value="VIP">VIP</option>
                          <option value="Keluarga Inti">Keluarga Inti</option>
                          <option value="Sahabat & Teman">Sahabat & Teman</option>
                          <option value="Rekan Kerja">Rekan Kerja</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editTable}
                          onChange={(e) => setEditTable(e.target.value)}
                          className="w-24 px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={editCount}
                          onChange={(e) => setEditCount(Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-white border border-[#c98858] rounded text-xs text-center"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <select
                          value={editRsvp}
                          onChange={(e) => setEditRsvp(e.target.value as Guest["rsvpStatus"])}
                          className="px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                        >
                          <option value="hadir">Hadir</option>
                          <option value="tidak_hadir">Tidak Hadir</option>
                          <option value="menunggu">Menunggu</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-[#7a6452]">{guest.attendanceEvent}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => handleSaveEdit(guest.id, e)}
                            className="p-1 rounded bg-[#789d6e] text-white hover:brightness-105"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 rounded bg-[#ded3c5] text-[#3a281c]">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={guest.id} className="hover:bg-[#faf5ef] transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#3a281c]">{guest.name}</p>
                      {guest.notes && <p className="text-[10px] text-[#6f5a49] mt-0.5">{guest.notes}</p>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#f3e7dc] text-[#78614f] text-[10px] font-semibold">
                        {guest.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#ffffff] border border-[#ede4d8] text-[#3a281c] font-mono font-bold text-[10.5px]">
                        {guest.tableNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-[#3a281c]">
                      {guest.invitationCount} Pax
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn(
                        "text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        guest.rsvpStatus === "hadir" ? "bg-green-100 text-green-700" :
                        guest.rsvpStatus === "menunggu" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {guest.rsvpStatus === "hadir" ? "Hadir" : guest.rsvpStatus === "menunggu" ? "Menunggu" : "Tidak Hadir"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#554437] font-medium">{guest.attendanceEvent}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStartEdit(guest)}
                          className="p-1 rounded bg-[#ffffff] border border-[#ede4d8] text-[#7a6452] hover:text-[#3a281c]"
                          title="Edit Tamu"
                          aria-label={`Edit ${guest.name}`}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                          title="Hapus Tamu"
                          aria-label={`Hapus ${guest.name}`}
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
          {filteredAndSortedGuests.map((guest) => {
            const isEditing = editingId === guest.id;

            if (isEditing) {
              return (
                <form
                  key={guest.id}
                  onSubmit={(event) => handleSaveEdit(guest.id, event)}
                  className="p-4 rounded-2xl border border-[#c98858]/40 bg-[#fef9f5] space-y-2.5"
                >
                  <input
                    type="text"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    aria-label="Nama tamu"
                    className="w-full px-2.5 py-1.5 bg-white border border-[#c98858] rounded-lg text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editCategory}
                      onChange={(event) =>
                        setEditCategory(event.target.value as Guest["category"])
                      }
                      aria-label="Kategori tamu"
                      className="px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    >
                      <option value="VIP">VIP</option>
                      <option value="Keluarga Inti">Keluarga Inti</option>
                      <option value="Sahabat & Teman">Sahabat & Teman</option>
                      <option value="Rekan Kerja">Rekan Kerja</option>
                    </select>
                    <input
                      type="text"
                      value={editTable}
                      onChange={(event) => setEditTable(event.target.value)}
                      aria-label="Nomor meja"
                      className="px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={editCount}
                      onChange={(event) => setEditCount(Number(event.target.value))}
                      aria-label="Jumlah pax"
                      className="px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    />
                    <select
                      value={editRsvp}
                      onChange={(event) =>
                        setEditRsvp(event.target.value as Guest["rsvpStatus"])
                      }
                      aria-label="Status RSVP"
                      className="px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak_hadir">Tidak Hadir</option>
                      <option value="menunggu">Menunggu</option>
                    </select>
                  </div>
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
                key={guest.id}
                className="p-4 rounded-2xl border border-[#f0e6d8] bg-[#fdfaf7] space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#3a281c]">{guest.name}</p>
                    <p className="text-[10.5px] text-[#6f5a49] mt-0.5">
                      {guest.notes ?? guest.attendanceEvent}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                      guest.rsvpStatus === "hadir"
                        ? "bg-green-100 text-green-700"
                        : guest.rsvpStatus === "menunggu"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700",
                    )}
                  >
                    {guest.rsvpStatus === "hadir"
                      ? "Hadir"
                      : guest.rsvpStatus === "menunggu"
                        ? "Menunggu"
                        : "Tidak Hadir"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded-md bg-[#f3e7dc] text-[#78614f] font-semibold">
                    {guest.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#ede4d8] text-[#3a281c] font-mono font-bold">
                    {guest.tableNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#ede4d8] text-[#3a281c] font-bold">
                    {guest.invitationCount} Pax
                  </span>
                  <span className="text-[#6f5a49]">{guest.attendanceEvent}</span>
                </div>

                {guest.phone && (
                  <p className="text-[10.5px] font-mono text-[#c98858]">
                    {guest.phone}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(guest)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#ede4d8] text-[#6f5a49] text-[11px] font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGuest(guest.id)}
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

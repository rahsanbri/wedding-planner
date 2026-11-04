"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Vendor } from "@/data/supportingData";
import { cn, createId } from "@/lib/utils";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import { formatRupiah } from "@/lib/selectors";

interface VendorsPageProps {
  onBack: () => void;
  initialShowAddForm?: boolean;
}

type VendorSortField = "name" | "category" | "contactPerson" | "totalContract" | "paymentProgress";
type SortOrder = "asc" | "desc";

export function VendorsPage({ onBack, initialShowAddForm = false }: VendorsPageProps) {
  const { data, setVendors } = useWeddingData();
  const vendors = data.vendors;
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(initialShowAddForm);

  // Sorting
  const [sortField, setSortField] = useState<VendorSortField>("category");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Add State
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Vendor["category"]>("Dekorasi");
  const [newPic, setNewPic] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newContract, setNewContract] = useState<number | "">("");
  const [newProgress, setNewProgress] = useState<number>(50);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPic, setEditPic] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editContract, setEditContract] = useState<number>(0);
  const [editProgress, setEditProgress] = useState<number>(0);

  const totalContractAll = vendors.reduce((acc, curr) => acc + curr.totalContract, 0);
  const signedCount = vendors.filter((vendor) => vendor.contractStatus === "signed").length;
  const signedPercent =
    vendors.length > 0 ? Math.round((signedCount / vendors.length) * 100) : 0;

  const handleSort = (field: VendorSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newVendor: Vendor = {
      id: createId("vendor"),
      name: newName.trim(),
      category: newCategory,
      contactPerson: newPic.trim() || "PIC Vendor",
      phone: newPhone.trim() || "-",
      email: newEmail.trim() || "-",
      contractStatus: "signed",
      paymentProgress: Number(newProgress || 0),
      totalContract: Number(newContract || 0),
    };

    setVendors((previous) => [newVendor, ...previous]);
    setNewName("");
    setNewPic("");
    setNewPhone("");
    setNewEmail("");
    setNewContract("");
    setShowAddForm(false);
  };

  const handleStartEdit = (v: Vendor) => {
    setEditingId(v.id);
    setEditName(v.name);
    setEditPic(v.contactPerson);
    setEditPhone(v.phone);
    setEditContract(v.totalContract);
    setEditProgress(v.paymentProgress);
  };

  const handleSaveEdit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              name: editName.trim() || v.name,
              contactPerson: editPic.trim() || v.contactPerson,
              phone: editPhone.trim() || v.phone,
              totalContract: Number(editContract),
              paymentProgress: Number(editProgress),
            }
          : v
      )
    );
    setEditingId(null);
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm("Hapus data vendor ini?")) {
      setVendors((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const filteredAndSortedVendors = [...vendors]
    .filter((v) => {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.contactPerson.toLowerCase().includes(q)
      );
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

  const renderSortIcon = (field: VendorSortField) => {
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
          <span className="hidden sm:inline">Total Rekanan: </span>
          <strong className="text-[#3a281c] font-bold bg-[#faece0] px-2 py-0.5 rounded-md border border-[#ecd9c8] text-[11px] sm:text-xs">
            {vendors.length} Vendor
          </strong>
        </div>
      </div>

      {/* KPI Cards (3-col compact on mobile) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="soft-card p-2.5 sm:p-5 bg-gradient-to-br from-[#ffffff] to-[#fbf7f2] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">Total Mitra</span>
          <h2 className="text-sm sm:text-2xl font-serif font-bold text-[#3a281c] mt-0.5 sm:mt-1 truncate">{vendors.length} Mitra</h2>
          <p className="text-[9px] sm:text-[11px] text-[#789d6e] font-semibold mt-0.5 sm:mt-1 truncate">
            {signedPercent}% Terverifikasi
          </p>
        </div>

        <div className="soft-card p-2.5 sm:p-5 bg-gradient-to-br from-[#ffffff] to-[#fbf7f2] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">Nilai Kontrak</span>
          <h2 className="text-sm sm:text-2xl font-serif font-bold text-[#3a281c] mt-0.5 sm:mt-1 truncate">{formatRupiah(totalContractAll)}</h2>
          <p className="text-[9px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">Akumulasi Vendor</p>
        </div>

        <div className="soft-card p-2.5 sm:p-5 bg-gradient-to-br from-[#ffffff] to-[#fbf7f2] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">Pelunasan</span>
          <h2 className="text-sm sm:text-2xl font-serif font-bold text-[#789d6e] mt-0.5 sm:mt-1 truncate">
            {Math.round(vendors.reduce((acc, c) => acc + c.paymentProgress, 0) / (vendors.length || 1))}%
          </h2>
          <p className="text-[9px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">Progres DP/Termin</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="soft-card p-3 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-[#f0e6d8] pb-3 sm:pb-4">
          <h3 className="text-sm sm:text-base font-serif font-bold text-[#3a281c]">
            Database & Kontak Vendor Pernikahan
          </h3>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6f5a49] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari vendor, kategori, PIC..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] w-52"
              />
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#c98858] text-[#ffffff] text-xs font-semibold hover:brightness-105 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Vendor</span>
            </button>
          </div>
        </div>

        {/* Form Tambah Vendor */}
        {showAddForm && (
          <form onSubmit={handleAddVendor} className="p-4 rounded-xl bg-[#fdfaf7] border border-[#ede4d8] space-y-3">
            <h4 className="text-xs font-bold text-[#3a281c]">Tambah Vendor Baru</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nama Perusahaan / Vendor"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs sm:col-span-2"
                required
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Vendor["category"])}
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              >
                <option value="Venue">Venue</option>
                <option value="Dekorasi">Dekorasi</option>
                <option value="Katering">Katering</option>
                <option value="Dokumentasi">Dokumentasi</option>
                <option value="Busana & MUA">Busana & MUA</option>
                <option value="Entertainment & Music">Entertainment & Music</option>
                <option value="Wedding Organizer">Wedding Organizer</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                value={newPic}
                onChange={(e) => setNewPic(e.target.value)}
                placeholder="Nama PIC"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
                required
              />
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Nomor WhatsApp"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
                required
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email Vendor"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              />
              <input
                type="number"
                value={newContract}
                onChange={(e) => setNewContract(e.target.value ? Number(e.target.value) : "")}
                placeholder="Nilai Kontrak (Rp)"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
                required
              />
              <input
                type="number"
                value={newProgress}
                onChange={(e) => setNewProgress(Number(e.target.value))}
                placeholder="% DP Terbayar"
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
                Simpan Vendor
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
                    <span>Nama Vendor</span>
                    {renderSortIcon("name")}
                  </div>
                </th>
                <th onClick={() => handleSort("category")} className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center">
                    <span>Kategori</span>
                    {renderSortIcon("category")}
                  </div>
                </th>
                <th onClick={() => handleSort("contactPerson")} className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center">
                    <span>PIC & Kontak Darurat</span>
                    {renderSortIcon("contactPerson")}
                  </div>
                </th>
                <th onClick={() => handleSort("totalContract")} className="py-3 px-3 text-right cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center justify-end">
                    <span>Nilai Kontrak</span>
                    {renderSortIcon("totalContract")}
                  </div>
                </th>
                <th onClick={() => handleSort("paymentProgress")} className="py-3 px-3 text-center cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center justify-center">
                    <span>Progress Pembayaran</span>
                    {renderSortIcon("paymentProgress")}
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1e7da]">
              {filteredAndSortedVendors.map((vendor) => {
                const isEditing = editingId === vendor.id;

                if (isEditing) {
                  return (
                    <tr key={vendor.id} className="bg-[#fef9f5]">
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                        />
                      </td>
                      <td className="py-3 px-3 text-[#7a6452]">{vendor.category}</td>
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editPic}
                            onChange={(e) => setEditPic(e.target.value)}
                            placeholder="PIC"
                            className="w-full px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                          />
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="No Telp"
                            className="w-full px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          value={editContract}
                          onChange={(e) => setEditContract(Number(e.target.value))}
                          className="w-28 px-2 py-1 bg-white border border-[#c98858] rounded text-xs text-right"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={editProgress}
                          onChange={(e) => setEditProgress(Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-white border border-[#c98858] rounded text-xs text-center"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => handleSaveEdit(vendor.id, e)}
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
                  <tr key={vendor.id} className="hover:bg-[#faf5ef] transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#3a281c]">{vendor.name}</p>
                      <p className="text-[10px] text-[#6f5a49] mt-0.5">{vendor.email}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#f3e7dc] text-[#78614f] text-[10px] font-semibold">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-[#3a281c]">{vendor.contactPerson}</p>
                      <p className="text-[10.5px] text-[#c98858] font-mono mt-0.5">{vendor.phone}</p>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#3a281c]">
                      {formatRupiah(vendor.totalContract)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono font-bold text-[11px] text-[#789d6e]">
                          {vendor.paymentProgress}%
                        </span>
                        <div className="w-20 bg-[#f1e7da] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              vendor.paymentProgress === 100 ? "bg-[#789d6e]" : "bg-[#c98858]"
                            )}
                            style={{ width: `${vendor.paymentProgress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStartEdit(vendor)}
                          className="p-1 rounded bg-[#ffffff] border border-[#ede4d8] text-[#7a6452] hover:text-[#3a281c]"
                          title="Edit Vendor"
                          aria-label={`Edit ${vendor.name}`}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id)}
                          className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                          title="Hapus Vendor"
                          aria-label={`Hapus ${vendor.name}`}
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
          {filteredAndSortedVendors.map((vendor) => {
            const isEditing = editingId === vendor.id;

            if (isEditing) {
              return (
                <form
                  key={vendor.id}
                  onSubmit={(event) => handleSaveEdit(vendor.id, event)}
                  className="p-4 rounded-2xl border border-[#c98858]/40 bg-[#fef9f5] space-y-2.5"
                >
                  <input
                    type="text"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    aria-label="Nama vendor"
                    className="w-full px-2.5 py-1.5 bg-white border border-[#c98858] rounded-lg text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editPic}
                      onChange={(event) => setEditPic(event.target.value)}
                      aria-label="Nama PIC vendor"
                      className="px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(event) => setEditPhone(event.target.value)}
                      aria-label="Telepon vendor"
                      className="px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={editContract}
                      onChange={(event) => setEditContract(Number(event.target.value))}
                      aria-label="Nilai kontrak"
                      className="px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      value={editProgress}
                      onChange={(event) => setEditProgress(Number(event.target.value))}
                      aria-label="Persentase pembayaran"
                      className="px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    />
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
                key={vendor.id}
                className="p-4 rounded-2xl border border-[#f0e6d8] bg-[#fdfaf7] space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#3a281c]">{vendor.name}</p>
                    <p className="text-[10.5px] text-[#6f5a49] mt-0.5">
                      {vendor.email}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#f3e7dc] text-[#78614f] shrink-0">
                    {vendor.category}
                  </span>
                </div>

                <div className="text-[10.5px]">
                  <p className="font-semibold text-[#3a281c]">{vendor.contactPerson}</p>
                  <p className="font-mono text-[#c98858]">{vendor.phone}</p>
                </div>

                <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white border border-[#ede4d8]">
                  <div>
                    <p className="text-[9.5px] uppercase tracking-wider text-[#6f5a49]">
                      Nilai Kontrak
                    </p>
                    <p className="text-[11px] font-mono font-bold text-[#3a281c]">
                      {formatRupiah(vendor.totalContract)}
                    </p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-[11px] font-bold text-[#789d6e]">
                      {vendor.paymentProgress}%
                    </p>
                    <div className="w-20 bg-[#f1e7da] rounded-full h-1.5 overflow-hidden mt-1">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          vendor.paymentProgress === 100
                            ? "bg-[#789d6e]"
                            : "bg-[#c98858]",
                        )}
                        style={{ width: `${vendor.paymentProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(vendor)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#ede4d8] text-[#6f5a49] text-[11px] font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteVendor(vendor.id)}
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

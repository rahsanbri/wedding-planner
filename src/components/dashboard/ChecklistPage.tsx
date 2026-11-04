"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  List,
  LayoutGrid
} from "lucide-react";
import { MasterChecklistItem } from "@/data/checklistAndMoodboardData";
import { cn, createId } from "@/lib/utils";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import { checklistSummary, groupChecklistByPhase } from "@/lib/selectors";

interface ChecklistPageProps {
  onBack: () => void;
  initialShowAddForm?: boolean;
}

type ChecklistSortField = "title" | "phase" | "pillar" | "dueDate" | "priority" | "completed";
type SortOrder = "asc" | "desc";

const kanbanPhases: {
  id: MasterChecklistItem["phase"];
  label: string;
  short: string;
}[] = [
  { id: "H-180 s/d H-120", label: "H-180 s/d H-120", short: "Fondasi Awal" },
  { id: "H-90 s/d H-60", label: "H-90 s/d H-60", short: "Konsep & Vendor" },
  { id: "H-30 s/d H-14", label: "H-30 s/d H-14", short: "Detailing" },
  { id: "H-7 s/d Hari-H", label: "H-7 s/d Hari-H", short: "Eksekusi Akhir" },
];

export function ChecklistPage({ onBack, initialShowAddForm = false }: ChecklistPageProps) {
  const { data, setChecklist } = useWeddingData();
  const items = data.checklist;
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(initialShowAddForm);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverPhase, setDragOverPhase] = useState<
    MasterChecklistItem["phase"] | null
  >(null);

  // Sorting
  const [sortField, setSortField] = useState<ChecklistSortField>("phase");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Add Item State
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState<MasterChecklistItem["phase"]>("H-90 s/d H-60");
  const [newPillar, setNewPillar] = useState<MasterChecklistItem["pillar"]>("Resepsi");
  const [newPic, setNewPic] = useState("Lead WO");
  const [newPriority, setNewPriority] = useState<MasterChecklistItem["priority"]>("high");
  const [newDueDate, setNewDueDate] = useState("Oktober 2026");

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPic, setEditPic] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  // Calculations
  const {
    total: totalTasks,
    completed: completedTasks,
    percent: progressPercent,
  } = checklistSummary(items);

  const handleToggle = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleSort = (field: ChecklistSortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: MasterChecklistItem = {
      id: createId("mc"),
      title: newTitle.trim(),
      phase: newPhase,
      pillar: newPillar,
      pic: newPic.trim() || "Lead Planner",
      completed: false,
      priority: newPriority,
      dueDate: newDueDate.trim() || "Menyesuaikan",
    };

    setChecklist((previous) => [newItem, ...previous]);
    setNewTitle("");
    setShowAddForm(false);
  };

  const handleStartEdit = (item: MasterChecklistItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditPic(item.pic);
    setEditDueDate(item.dueDate);
  };

  const handleSaveEdit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: editTitle.trim() || item.title,
              pic: editPic.trim() || item.pic,
              dueDate: editDueDate.trim() || item.dueDate,
            }
          : item
      )
    );
    setEditingId(null);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Hapus item checklist ini?")) {
      setChecklist((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredAndSortedItems = [...items]
    .filter((item) => {
      const matchPhase = selectedPhase === "all" || item.phase === selectedPhase;
      const matchPillar = selectedPillar === "all" || item.pillar === selectedPillar;
      return matchPhase && matchPillar;
    })
    .sort((a, b) => {
      const valA: string | boolean = a[sortField];
      const valB: string | boolean = b[sortField];

      if (typeof valA === "boolean") {
        return sortOrder === "asc" ? (valA === valB ? 0 : valA ? -1 : 1) : (valA === valB ? 0 : valA ? 1 : -1);
      }
      if (typeof valA === "string") {
        const compareRes = valA.localeCompare(valB as string);
        return sortOrder === "asc" ? compareRes : -compareRes;
      }
      return 0;
    });

  const groupedItems = groupChecklistByPhase(filteredAndSortedItems);

  const handleMovePhase = (id: string, phase: MasterChecklistItem["phase"]) => {
    setChecklist((previous) =>
      previous.map((item) => (item.id === id ? { ...item, phase } : item)),
    );
  };

  const renderSortIcon = (field: ChecklistSortField) => {
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
      {/* Header */}
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
          <span className="hidden sm:inline">Selesai: </span>
          <strong className="text-[#789d6e] font-bold bg-green-50/80 px-2 py-0.5 rounded-md border border-green-200 text-[11px] sm:text-xs">
            {completedTasks}/{totalTasks} ({progressPercent}%)
          </strong>
        </div>
      </div>

      {/* Progress Card */}
      <div className="soft-card p-3.5 sm:p-6 bg-gradient-to-r from-[#faece1] via-[#f8e4d6] to-[#f4dccb] border border-[#ecd5c3]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#7a4825]">
              Master Checklist Seluruh Persiapan
            </span>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#3a281c] mt-0.5">
              Timeline Eksekusi Pernikahan
            </h2>
            <p className="text-[11px] sm:text-xs text-[#7a6452] mt-0.5 hidden sm:block">
              Memantau to-do list dari masa H-180 hingga saat gladi resik dan malam resepsi.
            </p>
          </div>

          <div className="bg-[#ffffff]/90 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#ecd9c8] text-center min-w-[130px] sm:min-w-[150px] self-start sm:self-auto flex sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-0 w-full sm:w-auto">
            <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-[#6f5a49]">Kesiapan</span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-[#3a281c] sm:mt-0.5">{progressPercent}%</p>
            <div className="w-24 sm:w-full bg-[#f1e7da] rounded-full h-1.5 overflow-hidden sm:mt-1.5">
              <div className="bg-[#789d6e] h-full rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Checklist Card */}
      <div className="soft-card p-3 sm:p-6 space-y-3 sm:space-y-4">
        {/* Filter and Add */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3 border-b border-[#f0e6d8] pb-3 sm:pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs font-semibold text-[#3a281c]"
            >
              <option value="all">Semua Fase Waktu</option>
              <option value="H-180 s/d H-120">Fase H-180 s/d H-120</option>
              <option value="H-90 s/d H-60">Fase H-90 s/d H-60</option>
              <option value="H-30 s/d H-14">Fase H-30 s/d H-14</option>
              <option value="H-7 s/d Hari-H">Fase H-7 s/d Hari-H</option>
            </select>

            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs font-semibold text-[#3a281c]"
            >
              <option value="all">Semua Pilar Acara</option>
              <option value="Gereja">Gereja</option>
              <option value="Pre-Wedding">Pre-Wedding</option>
              <option value="Midodareni">Midodareni</option>
              <option value="Resepsi">Resepsi</option>
              <option value="Umum / Finansial">Umum / Finansial</option>
            </select>

            <div className="flex items-center gap-1 bg-[#f3e7dc] p-1 rounded-xl border border-[#ede1d5] text-xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                aria-pressed={viewMode === "table"}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer",
                  viewMode === "table"
                    ? "bg-[#c98858] text-[#ffffff] font-bold shadow-2xs"
                    : "text-[#7a6452]",
                )}
              >
                <List className="w-3.5 h-3.5" />
                Tabel
              </button>
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                aria-pressed={viewMode === "kanban"}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer",
                  viewMode === "kanban"
                    ? "bg-[#c98858] text-[#ffffff] font-bold shadow-2xs"
                    : "text-[#7a6452]",
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Kanban
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#c98858] text-[#ffffff] text-xs font-semibold hover:brightness-105 shadow-2xs cursor-pointer w-fit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item Checklist</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="p-4 rounded-xl bg-[#fdfaf7] border border-[#ede4d8] space-y-3">
            <h4 className="text-xs font-bold text-[#3a281c]">Tambah Tugas Checklist Baru</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Deskripsi Tugas (contoh: Briefing MC & Organis)"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs sm:col-span-2"
                required
              />
              <select
                value={newPhase}
                onChange={(e) => setNewPhase(e.target.value as MasterChecklistItem["phase"])}
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              >
                <option value="H-180 s/d H-120">Fase H-180 s/d H-120</option>
                <option value="H-90 s/d H-60">Fase H-90 s/d H-60</option>
                <option value="H-30 s/d H-14">Fase H-30 s/d H-14</option>
                <option value="H-7 s/d Hari-H">Fase H-7 s/d Hari-H</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <select
                value={newPillar}
                onChange={(e) => setNewPillar(e.target.value as MasterChecklistItem["pillar"])}
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              >
                <option value="Gereja">Gereja</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Midodareni">Midodareni</option>
                <option value="Resepsi">Resepsi</option>
                <option value="Umum / Finansial">Umum / Finansial</option>
              </select>
              <input
                type="text"
                value={newPic}
                onChange={(e) => setNewPic(e.target.value)}
                placeholder="Penanggung Jawab (PIC)"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              />
              <input
                type="text"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                placeholder="Target Selesai (Bulan / Hari)"
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as MasterChecklistItem["priority"])}
                className="px-3 py-2 rounded-lg bg-white border border-[#ede4d8] text-xs"
              >
                <option value="high">Prioritas: Tinggi</option>
                <option value="medium">Prioritas: Sedang</option>
                <option value="low">Prioritas: Rendah</option>
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
                Simpan Checklist
              </button>
            </div>
          </form>
        )}

        {/* Table List */}
        {viewMode === "table" && (
          <>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#ede4d8] text-[#6f5a49] text-[10.5px] uppercase font-bold tracking-wider select-none">
                <th onClick={() => handleSort("completed")} className="py-3 px-3 text-center cursor-pointer hover:text-[#3a281c] w-12">
                  <div className="flex items-center justify-center">
                    <span>Status</span>
                  </div>
                </th>
                <th onClick={() => handleSort("title")} className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center">
                    <span>Deskripsi Tugas</span>
                    {renderSortIcon("title")}
                  </div>
                </th>
                <th onClick={() => handleSort("phase")} className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center">
                    <span>Fase Waktu</span>
                    {renderSortIcon("phase")}
                  </div>
                </th>
                <th onClick={() => handleSort("pillar")} className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center">
                    <span>Pilar Acara</span>
                    {renderSortIcon("pillar")}
                  </div>
                </th>
                <th className="py-3 px-3">PIC</th>
                <th onClick={() => handleSort("dueDate")} className="py-3 px-3 cursor-pointer hover:text-[#3a281c] group">
                  <div className="flex items-center">
                    <span>Batas Waktu</span>
                    {renderSortIcon("dueDate")}
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1e7da]">
              {filteredAndSortedItems.map((item) => {
                const isEditing = editingId === item.id;

                if (isEditing) {
                  return (
                    <tr key={item.id} className="bg-[#fef9f5]">
                      <td className="py-3 px-3 text-center">
                        <CheckCircle2 className="w-4 h-4 text-[#789d6e] mx-auto" />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                        />
                      </td>
                      <td className="py-3 px-3 text-[#7a6452]">{item.phase}</td>
                      <td className="py-3 px-3 text-[#7a6452]">{item.pillar}</td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editPic}
                          onChange={(e) => setEditPic(e.target.value)}
                          className="w-28 px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="w-28 px-2 py-1 bg-white border border-[#c98858] rounded text-xs"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => handleSaveEdit(item.id, e)}
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
                  <tr
                    key={item.id}
                    onClick={() => handleToggle(item.id)}
                    className={cn(
                      "hover:bg-[#faf5ef] transition-colors cursor-pointer select-none",
                      item.completed && "bg-[#faf6f1]/60"
                    )}
                  >
                    <td className="py-3 px-3 text-center">
                      <button
                        className="text-[#c98858]"
                        aria-label={
                          item.completed
                            ? `Tandai ${item.title} belum selesai`
                            : `Tandai ${item.title} selesai`
                        }
                        aria-pressed={item.completed}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#789d6e] fill-[#789d6e]/15 mx-auto" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#c98858] mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <p className={cn(
                        "font-bold text-[#3a281c] text-xs",
                        item.completed && "line-through text-[#6f5a49]"
                      )}>
                        {item.title}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#f3e7dc] text-[#78614f] text-[10px] font-semibold whitespace-nowrap">
                        {item.phase}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#ffffff] border border-[#ede4d8] text-[#3a281c] font-semibold text-[10.5px]">
                        {item.pillar}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#554437] font-medium">{item.pic}</td>
                    <td className="py-3 px-3 text-[#7a6452] font-medium">{item.dueDate}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleStartEdit(item, e)}
                          className="p-1 rounded bg-[#ffffff] border border-[#ede4d8] text-[#7a6452] hover:text-[#3a281c]"
                          title="Edit Item"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                          title="Hapus Item"
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
          {filteredAndSortedItems.map((item) => {
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
                    aria-label="Judul checklist"
                    className="w-full px-2.5 py-1.5 bg-white border border-[#c98858] rounded-lg text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editPic}
                      onChange={(event) => setEditPic(event.target.value)}
                      aria-label="PIC checklist"
                      className="px-2.5 py-1.5 bg-white border border-[#ede4d8] rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      value={editDueDate}
                      onChange={(event) => setEditDueDate(event.target.value)}
                      aria-label="Batas waktu checklist"
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
                key={item.id}
                className={cn(
                  "p-4 rounded-2xl border border-[#f0e6d8] bg-[#fdfaf7] space-y-2.5",
                  item.completed && "opacity-80",
                )}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    aria-label={
                      item.completed
                        ? `Tandai ${item.title} belum selesai`
                        : `Tandai ${item.title} selesai`
                    }
                    aria-pressed={item.completed}
                    className="shrink-0 mt-0.5"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#789d6e] fill-[#789d6e]/15" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#c98858]" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-xs font-bold text-[#3a281c]",
                        item.completed && "line-through text-[#6f5a49]",
                      )}
                    >
                      {item.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-[#f3e7dc] text-[#78614f] font-semibold">
                        {item.phase}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-[#ede4d8] text-[#3a281c] font-semibold">
                        {item.pillar}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-[#ede4d8] text-[#3a281c] font-semibold">
                        {item.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-[10.5px] text-[#6f5a49]">
                  <span>PIC: <strong className="text-[#3a281c]">{item.pic}</strong></span>
                  <span>{item.dueDate}</span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={(event) => handleStartEdit(item, event)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#ede4d8] text-[#6f5a49] text-[11px] font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(event) => handleDeleteItem(item.id, event)}
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
          </>
        )}

        {viewMode === "kanban" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10.5px] text-[#6f5a49]">
              <LayoutGrid className="w-3.5 h-3.5 text-[#c98858]" />
              Tarik kartu antar kolom, atau gunakan dropdown fase di tiap kartu.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {kanbanPhases.map((phase) => {
                const phaseItems = groupedItems[phase.id];
                const done = phaseItems.filter((item) => item.completed).length;

                return (
                  <div
                    key={phase.id}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setDragOverPhase(phase.id);
                    }}
                    onDragLeave={() => {
                      setDragOverPhase((current) =>
                        current === phase.id ? null : current,
                      );
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const id =
                        event.dataTransfer.getData("text/plain") || draggingId;
                      if (id) handleMovePhase(id, phase.id);
                      setDraggingId(null);
                      setDragOverPhase(null);
                    }}
                    className={cn(
                      "rounded-2xl border p-3 space-y-2.5 transition-colors",
                      dragOverPhase === phase.id
                        ? "border-[#c98858] bg-[#faece0]/60"
                        : "border-[#ede4d8] bg-[#fdfaf7]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-bold text-[#3a281c]">
                          {phase.short}
                        </p>
                        <p className="text-[9.5px] text-[#6f5a49]">
                          {phase.label}
                        </p>
                      </div>
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#ede4d8] text-[#6f5a49] shrink-0">
                        {done}/{phaseItems.length}
                      </span>
                    </div>

                    <div className="space-y-2 min-h-[90px]">
                      {phaseItems.length === 0 ? (
                        <p className="text-[10.5px] text-[#6f5a49] text-center py-5">
                          Tidak ada item
                        </p>
                      ) : (
                        phaseItems.map((item) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.setData("text/plain", item.id);
                              event.dataTransfer.effectAllowed = "move";
                              setDraggingId(item.id);
                            }}
                            onDragEnd={() => {
                              setDraggingId(null);
                              setDragOverPhase(null);
                            }}
                            className={cn(
                              "rounded-xl border border-[#f0e6d8] bg-white p-2.5 space-y-1.5 cursor-grab active:cursor-grabbing",
                              draggingId === item.id && "opacity-50",
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggle(item.id)}
                                aria-label={
                                  item.completed
                                    ? `Tandai ${item.title} belum selesai`
                                    : `Tandai ${item.title} selesai`
                                }
                                aria-pressed={item.completed}
                                className="shrink-0 mt-0.5"
                              >
                                {item.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#789d6e] fill-[#789d6e]/15" />
                                ) : (
                                  <Circle className="w-4 h-4 text-[#c98858]" />
                                )}
                              </button>
                              <p
                                className={cn(
                                  "text-[11px] font-semibold text-[#3a281c]",
                                  item.completed &&
                                    "line-through text-[#6f5a49]",
                                )}
                              >
                                {item.title}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-1 text-[9px]">
                              <span className="px-1.5 py-0.5 rounded bg-[#f3e7dc] text-[#78614f] font-semibold">
                                {item.pillar}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-white border border-[#ede4d8] text-[#3a281c] font-semibold">
                                {item.priority}
                              </span>
                            </div>

                            <p className="text-[9.5px] text-[#6f5a49]">
                              PIC: {item.pic} • {item.dueDate}
                            </p>

                            <select
                              value={item.phase}
                              onChange={(event) =>
                                handleMovePhase(
                                  item.id,
                                  event.target.value as MasterChecklistItem["phase"],
                                )
                              }
                              aria-label={`Pindah fase ${item.title}`}
                              className="w-full px-2 py-1 rounded-lg bg-[#fbf7f2] border border-[#ede4d8] text-[10px] text-[#3a281c]"
                            >
                              {kanbanPhases.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

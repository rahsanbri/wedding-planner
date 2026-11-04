"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Layers, 
  Church, 
  Camera, 
  Flower2, 
  Heart, 
  ChevronRight,
  CircleDot,
  Plus,
  Trash2,
  Edit3,
  Check,
  X
} from "lucide-react";
import { TimelineMilestone } from "@/data/timelineRoadmapData";
import { cn, createId } from "@/lib/utils";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import { formatWeddingDate } from "@/lib/selectors";

interface TimelinePageProps {
  onBack: () => void;
  initialShowAddForm?: boolean;
}

type TimelineTab = "master" | "gereja" | "prewedding" | "midodareni" | "resepsi";

export function TimelinePage({ onBack, initialShowAddForm = false }: TimelinePageProps) {
  const { data, setTimeline } = useWeddingData();
  const [activeTab, setActiveTab] = useState<TimelineTab>("master");
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("tm18");

  const milestoneList = data.timeline;

  // State untuk Form Tambah Milestone
  const [showAddForm, setShowAddForm] = useState(initialShowAddForm);
  const [newTitle, setNewTitle] = useState("");
  const [newPhaseId, setNewPhaseId] = useState<TimelineMilestone["phaseId"]>("h-1m");
  const [newPillar, setNewPillar] = useState<TimelineMilestone["pillar"]>("Resepsi");
  const [newDate, setNewDate] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newPic, setNewPic] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newActions, setNewActions] = useState("");

  // State untuk Edit Milestone
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editPic, setEditPic] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState<TimelineMilestone["status"]>("upcoming");

  // Filter items based on tab
  const tabFilteredMilestones = milestoneList.filter((item) => {
    if (activeTab === "master") return true;
    if (activeTab === "gereja") return item.pillar === "Gereja";
    if (activeTab === "prewedding") return item.pillar === "Pre-Wedding";
    if (activeTab === "midodareni") return item.pillar === "Midodareni";
    if (activeTab === "resepsi") return item.pillar === "Resepsi";
    return true;
  });

  // Apply phase filter if selected
  const displayMilestones = tabFilteredMilestones.filter((item) => {
    if (selectedPhaseFilter === "all") return true;
    return item.phaseId === selectedPhaseFilter;
  });

  // Pillar metadata
  const pillarDetails = {
    master: {
      name: "Master Timeline",
      desc: "Roadmap terpadu seluruh fase dari H-6 Bulan sampai Hari-H pernikahan 16 Mei 2027",
      icon: Layers,
      badge: "Master Overview",
      color: "#c98858",
    },
    gereja: {
      name: "Timeline Gereja",
      desc: "Tahapan sakramen, kanonik, gladi liturgi, hingga pengucapan janji nikah 16 Mei 2027",
      icon: Church,
      badge: "Sakramen Kudus",
      color: "#d49957",
    },
    prewedding: {
      name: "Timeline Pre-Wedding",
      desc: "Roadmap moodboard, pemotretan Bromo, editing, hingga cetak galeri resepsi",
      icon: Camera,
      badge: "Visual & Konten",
      color: "#558252",
    },
    midodareni: {
      name: "Timeline Midodareni",
      desc: "Persiapan adat Jawa, seserahan, tarub, hingga malam catur wedha 15 Mei 2027",
      icon: Flower2,
      badge: "Malam Adat Jawa",
      color: "#b85e6f",
    },
    resepsi: {
      name: "Timeline Resepsi",
      desc: "Koordinasi ballroom, 14 vendor, seating VIP, hingga puncak grand reception 16 Mei 2027",
      icon: Heart,
      badge: "Pesta Hari-H",
      color: "#9ea873",
    },
  };

  const currentPillar = pillarDetails[activeTab];
  const CurrentIcon = currentPillar.icon;

  const phaseList = [
    { id: "h-6m", name: "H - 6 Bulan", timeframe: "Nov - Des 2026", color: "bg-[#faece0] text-[#b57a41]" },
    { id: "h-3m", name: "H - 3 Bulan", timeframe: "Jan - Feb 2027", color: "bg-[#edf4ec] text-[#3e683b]" },
    { id: "h-1m", name: "H - 1 Bulan", timeframe: "April 2027", color: "bg-[#faedf0] text-[#913b4c]" },
    { id: "h-1w", name: "H - 1 Minggu", timeframe: "9 - 14 Mei 2027", color: "bg-[#f3f6ea] text-[#55632f]" },
    { id: "h-day", name: "Hari - H", timeframe: "15 - 16 Mei 2027", color: "bg-[#fbeee4] text-[#805030]" },
  ];

  // Handlers CRUD Timeline
  const handleDeleteMilestone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Hapus agenda timeline ini?")) {
      setTimeline((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleStartEdit = (m: TimelineMilestone, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(m.id);
    setEditTitle(m.title);
    setEditDate(m.dateFormatted);
    setEditLocation(m.location);
    setEditPic(m.pic);
    setEditDesc(m.description);
    setEditStatus(m.status);
  };

  const handleSaveEdit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    setTimeline((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              title: editTitle.trim() || m.title,
              dateFormatted: editDate.trim() || m.dateFormatted,
              location: editLocation.trim() || m.location,
              pic: editPic.trim() || m.pic,
              description: editDesc.trim() || m.description,
              status: editStatus,
            }
          : m
      )
    );
    setEditingId(null);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate.trim()) return;

    const matchedPhase = phaseList.find((p) => p.id === newPhaseId);
    const actionsArray = newActions
      .split("\n")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const newMilestone: TimelineMilestone = {
      id: createId("tm"),
      phaseId: newPhaseId,
      phaseName: matchedPhase?.name || "Fase Kustom",
      timeframe: matchedPhase?.timeframe || "2027",
      title: newTitle.trim(),
      pillar: newPillar,
      dateFormatted: newDate.trim(),
      description: newDesc.trim() || "Rencana agenda persiapan.",
      location: newLocation.trim() || "Area Acara",
      pic: newPic.trim() || "Lead WO",
      status: "upcoming",
      keyActions: actionsArray.length > 0 ? actionsArray : ["Koordinasi pelaksanaan agenda"],
    };

    setTimeline([newMilestone, ...milestoneList]);
    setNewTitle("");
    setNewDate("");
    setNewLocation("");
    setNewPic("");
    setNewDesc("");
    setNewActions("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-3.5 sm:space-y-6 pb-8 sm:pb-12 w-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pb-3 sm:pb-4 border-b border-[#ede4d8]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#805030] hover:text-[#3a281c] bg-[#ffffff] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-[#ede4d8] shadow-2xs hover:bg-[#faf5ef] transition-colors w-fit cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Kembali</span>
          <span className="hidden sm:inline">ke Dashboard</span>
        </button>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-[#f3e7dc] text-[#78614f] font-semibold border border-[#ede1d5] truncate">
            Target: <strong className="text-[#3a281c]">{formatWeddingDate(data.settings.targetDate)}</strong>
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#c98858] text-[#ffffff] text-xs font-semibold hover:brightness-105 shadow-2xs cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">Tambah Agenda</span>
            <span className="xs:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="soft-card p-3.5 sm:p-6 md:p-8 bg-gradient-to-r from-[#faece1] via-[#f8e4d6] to-[#f4dccb] border border-[#ecd5c3] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div className="space-y-1.5 sm:space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-[#f1dac7] text-[#7a4825] border border-[#e2c5ad]">
                {currentPillar.badge}
              </span>
              <span className="text-[11px] sm:text-xs text-[#6f5a49]">Roadmap 16 Mei 2027</span>
            </div>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-[#3a281c] flex items-center gap-2">
              <CurrentIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c98858] shrink-0" />
              <span>{currentPillar.name}</span>
            </h1>
            <p className="text-[11px] sm:text-sm text-[#7a6452] leading-relaxed hidden sm:block">
              {currentPillar.desc}
            </p>
          </div>

          {/* Quick Progress Phase Indicator */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {phaseList.map((ph) => {
              const countInPhase = tabFilteredMilestones.filter((m) => m.phaseId === ph.id).length;
              return (
                <div key={ph.id} className="bg-[#ffffff]/90 p-3 rounded-2xl border border-[#ede1d4] min-w-[105px] text-center shadow-2xs">
                  <span className={cn("text-[9.5px] font-bold px-2 py-0.5 rounded-full", ph.color)}>
                    {ph.name}
                  </span>
                  <p className="text-sm font-serif font-bold text-[#3a281c] mt-1.5">{countInPhase} Agenda</p>
                  <span className="text-[9.5px] text-[#6f5a49] block truncate">{ph.timeframe}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Tambah Milestone Baru */}
      {showAddForm && (
        <form onSubmit={handleAddMilestone} className="soft-card p-5 bg-[#ffffff] border border-[#c98858]/30 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-2">
            <h4 className="text-xs font-bold text-[#3a281c]">Tambah Agenda Timeline Baru</h4>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-[#6f5a49] hover:text-[#3a281c]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Judul Agenda / Milestone"
              className="px-3 py-2 rounded-lg bg-[#fbf7f2] border border-[#ede4d8] text-xs sm:col-span-2"
              required
            />
            <select
              value={newPillar}
              onChange={(e) => setNewPillar(e.target.value as TimelineMilestone["pillar"])}
              className="px-3 py-2 rounded-lg bg-[#fbf7f2] border border-[#ede4d8] text-xs"
            >
              <option value="Gereja">Gereja</option>
              <option value="Pre-Wedding">Pre-Wedding</option>
              <option value="Midodareni">Midodareni</option>
              <option value="Resepsi">Resepsi</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <select
              value={newPhaseId}
              onChange={(e) => setNewPhaseId(e.target.value as TimelineMilestone["phaseId"])}
              className="px-3 py-2 rounded-lg bg-[#fbf7f2] border border-[#ede4d8] text-xs"
            >
              <option value="h-6m">Fase H - 6 Bulan (Nov - Des 2026)</option>
              <option value="h-3m">Fase H - 3 Bulan (Jan - Feb 2027)</option>
              <option value="h-1m">Fase H - 1 Bulan (April 2027)</option>
              <option value="h-1w">Fase H - 1 Minggu (9 - 14 Mei 2027)</option>
              <option value="h-day">Fase Hari - H (15 - 16 Mei 2027)</option>
            </select>
            <input
              type="text"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              placeholder="Tanggal & Jam (cth: 10 April 2027 • 10.00 WIB)"
              className="px-3 py-2 rounded-lg bg-[#fbf7f2] border border-[#ede4d8] text-xs"
              required
            />
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Lokasi Acara"
              className="px-3 py-2 rounded-lg bg-[#fbf7f2] border border-[#ede4d8] text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              value={newPic}
              onChange={(e) => setNewPic(e.target.value)}
              placeholder="Penanggung Jawab (PIC)"
              className="px-3 py-2 rounded-lg bg-[#fbf7f2] border border-[#ede4d8] text-xs"
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Deskripsi singkat kegiatan"
              className="px-3 py-2 rounded-lg bg-[#fbf7f2] border border-[#ede4d8] text-xs"
            />
          </div>
          <div>
            <textarea
              rows={2}
              value={newActions}
              onChange={(e) => setNewActions(e.target.value)}
              placeholder="Tindakan Inti / Checklist poin (pisahkan dengan baris baru)"
              className="w-full px-3 py-2 rounded-lg bg-[#fbf7f2] border border-[#ede4d8] text-xs"
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
              Simpan Agenda
            </button>
          </div>
        </form>
      )}

      {/* 5 TIMELINE TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 select-none">
        {/* Tab 1: Master Timeline */}
        <button
          onClick={() => {
            setActiveTab("master");
            setSelectedPhaseFilter("all");
          }}
          className={cn(
            "p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border",
            activeTab === "master"
              ? "bg-[#3a281c] text-[#faf7f2] border-[#3a281c] shadow-md ring-2 ring-[#c98858]/40"
              : "bg-[#ffffff] text-[#554437] border-[#f1e7da] hover:bg-[#faf5ef]"
          )}
        >
          <Layers className={cn("w-5 h-5 mb-1.5", activeTab === "master" ? "text-[#e5c378]" : "text-[#c98858]")} />
          <span className="text-xs font-bold leading-tight">Master Timeline</span>
          <span className={cn("text-[10px] mt-0.5", activeTab === "master" ? "text-[#d6d3cb]" : "text-[#6f5a49]")}>
            Semua 4 Acara
          </span>
        </button>

        {/* Tab 2: Gereja */}
        <button
          onClick={() => {
            setActiveTab("gereja");
            setSelectedPhaseFilter("all");
          }}
          className={cn(
            "p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border",
            activeTab === "gereja"
              ? "bg-[#3a281c] text-[#faf7f2] border-[#3a281c] shadow-md ring-2 ring-[#c98858]/40"
              : "bg-[#ffffff] text-[#554437] border-[#f1e7da] hover:bg-[#faf5ef]"
          )}
        >
          <Church className={cn("w-5 h-5 mb-1.5", activeTab === "gereja" ? "text-[#e5c378]" : "text-[#d49957]")} />
          <span className="text-xs font-bold leading-tight">Gereja</span>
          <span className={cn("text-[10px] mt-0.5", activeTab === "gereja" ? "text-[#d6d3cb]" : "text-[#6f5a49]")}>
            16 Mei 2027 09.00
          </span>
        </button>

        {/* Tab 3: Pre-Wedding */}
        <button
          onClick={() => {
            setActiveTab("prewedding");
            setSelectedPhaseFilter("all");
          }}
          className={cn(
            "p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border",
            activeTab === "prewedding"
              ? "bg-[#3a281c] text-[#faf7f2] border-[#3a281c] shadow-md ring-2 ring-[#c98858]/40"
              : "bg-[#ffffff] text-[#554437] border-[#f1e7da] hover:bg-[#faf5ef]"
          )}
        >
          <Camera className={cn("w-5 h-5 mb-1.5", activeTab === "prewedding" ? "text-[#e5c378]" : "text-[#558252]")} />
          <span className="text-xs font-bold leading-tight">Pre-Wedding</span>
          <span className={cn("text-[10px] mt-0.5", activeTab === "prewedding" ? "text-[#d6d3cb]" : "text-[#6f5a49]")}>
            Bromo & Studio
          </span>
        </button>

        {/* Tab 4: Midodareni */}
        <button
          onClick={() => {
            setActiveTab("midodareni");
            setSelectedPhaseFilter("all");
          }}
          className={cn(
            "p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border",
            activeTab === "midodareni"
              ? "bg-[#3a281c] text-[#faf7f2] border-[#3a281c] shadow-md ring-2 ring-[#c98858]/40"
              : "bg-[#ffffff] text-[#554437] border-[#f1e7da] hover:bg-[#faf5ef]"
          )}
        >
          <Flower2 className={cn("w-5 h-5 mb-1.5", activeTab === "midodareni" ? "text-[#e5c378]" : "text-[#b85e6f]")} />
          <span className="text-xs font-bold leading-tight">Midodareni</span>
          <span className={cn("text-[10px] mt-0.5", activeTab === "midodareni" ? "text-[#d6d3cb]" : "text-[#6f5a49]")}>
            15 Mei 2027 18.30
          </span>
        </button>

        {/* Tab 5: Resepsi */}
        <button
          onClick={() => {
            setActiveTab("resepsi");
            setSelectedPhaseFilter("all");
          }}
          className={cn(
            "p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border col-span-2 sm:col-span-1",
            activeTab === "resepsi"
              ? "bg-[#3a281c] text-[#faf7f2] border-[#3a281c] shadow-md ring-2 ring-[#c98858]/40"
              : "bg-[#ffffff] text-[#554437] border-[#f1e7da] hover:bg-[#faf5ef]"
          )}
        >
          <Heart className={cn("w-5 h-5 mb-1.5", activeTab === "resepsi" ? "text-[#e5c378]" : "text-[#9ea873]")} />
          <span className="text-xs font-bold leading-tight">Resepsi</span>
          <span className={cn("text-[10px] mt-0.5", activeTab === "resepsi" ? "text-[#d6d3cb]" : "text-[#6f5a49]")}>
            16 Mei 2027 19.00
          </span>
        </button>
      </div>

      {/* Phase Filter Quick Buttons */}
      <div className="flex items-center gap-1.5 bg-[#f3e7dc] p-1 rounded-2xl border border-[#ede1d5] text-xs w-fit overflow-x-auto">
        <button
          onClick={() => setSelectedPhaseFilter("all")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap",
            selectedPhaseFilter === "all" ? "bg-[#c98858] text-[#ffffff] font-bold shadow-2xs" : "text-[#7a6452]"
          )}
        >
          Semua Fase ({tabFilteredMilestones.length})
        </button>
        {phaseList.map((ph) => {
          const count = tabFilteredMilestones.filter((m) => m.phaseId === ph.id).length;
          return (
            <button
              key={ph.id}
              onClick={() => setSelectedPhaseFilter(ph.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap",
                selectedPhaseFilter === ph.id ? "bg-[#c98858] text-[#ffffff] font-bold shadow-2xs" : "text-[#7a6452]"
              )}
            >
              {ph.name} ({count})
            </button>
          );
        })}
      </div>

      {/* INTERACTIVE TIMELINE ROADMAP WITH EDIT & DELETE */}
      <div className="relative pl-6 md:pl-10 space-y-6 pt-2">
        <div className="absolute left-9 md:left-13 top-4 bottom-8 w-1 bg-gradient-to-b from-[#e5c378] via-[#c98858] to-[#805030] rounded-full" />

        {displayMilestones.map((item) => {
          const isExpanded = expandedId === item.id;
          const isEditing = editingId === item.id;

          const pillarIcon = 
            item.pillar === "Gereja" ? Church :
            item.pillar === "Pre-Wedding" ? Camera :
            item.pillar === "Midodareni" ? Flower2 : Heart;
          const PIcon = pillarIcon;

          return (
            <div key={item.id} className="relative flex items-start gap-4 md:gap-6 group">
              {/* Timeline Node Badge */}
              <div className="relative z-10 shrink-0 mt-1">
                <div className={cn(
                  "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-white shadow-md transition-transform group-hover:scale-110",
                  item.status === "completed" ? "bg-[#789d6e] text-white" :
                  item.status === "in_progress" ? "bg-[#c98858] text-white animate-pulse" :
                  "bg-[#ffffff] text-[#c98858] border-[#c98858]"
                )}>
                  {item.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <CircleDot className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Milestone Content Card */}
              <div 
                onClick={() => !isEditing && setExpandedId(isExpanded ? null : item.id)}
                className={cn(
                  "flex-1 soft-card p-5 md:p-6 transition-all duration-200 cursor-pointer border",
                  isExpanded ? "border-[#c98858] ring-2 ring-[#c98858]/20 shadow-md bg-white" : "hover:border-[#dfc8b4]"
                )}
              >
                {isEditing ? (
                  /* Form Inline Edit */
                  <form onSubmit={(e) => handleSaveEdit(item.id, e)} className="space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between pb-2 border-b border-[#ede4d8]">
                      <h4 className="text-xs font-bold text-[#3a281c]">Edit Agenda Timeline</h4>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="submit"
                          className="px-3 py-1 rounded bg-[#789d6e] text-white text-xs font-semibold hover:brightness-105 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 rounded bg-[#ded3c5] text-[#3a281c] text-xs"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Judul Agenda"
                        className="px-2.5 py-1.5 rounded bg-[#fbf7f2] border border-[#c98858] text-xs font-bold"
                        required
                      />
                      <input
                        type="text"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        placeholder="Tanggal & Waktu"
                        className="px-2.5 py-1.5 rounded bg-[#fbf7f2] border border-[#ede4d8] text-xs"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="Lokasi"
                        className="px-2.5 py-1.5 rounded bg-[#fbf7f2] border border-[#ede4d8] text-xs"
                      />
                      <input
                        type="text"
                        value={editPic}
                        onChange={(e) => setEditPic(e.target.value)}
                        placeholder="PIC"
                        className="px-2.5 py-1.5 rounded bg-[#fbf7f2] border border-[#ede4d8] text-xs"
                      />
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as TimelineMilestone["status"])}
                        className="px-2.5 py-1.5 rounded bg-[#fbf7f2] border border-[#ede4d8] text-xs"
                      >
                        <option value="upcoming">Mendatang</option>
                        <option value="in_progress">Sedang Berjalan</option>
                        <option value="completed">Selesai</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Deskripsi kegiatan"
                      className="w-full px-2.5 py-1.5 rounded bg-[#fbf7f2] border border-[#ede4d8] text-xs"
                    />
                  </form>
                ) : (
                  /* Tampilan Normal Card Milestone */
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#f0e6d8]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#f3e7dc] text-[#78614f]">
                          {item.phaseName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ffffff] border border-[#ede4d8] text-[#3a281c] flex items-center gap-1">
                          <PIcon className="w-3 h-3 text-[#c98858]" />
                          {item.pillar}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="w-3.5 h-3.5 text-[#c98858]" />
                          <span className="font-semibold text-[#805030]">{item.dateFormatted}</span>
                        </div>

                        {/* Tombol Edit & Hapus */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleStartEdit(item, e)}
                            className="p-1 rounded bg-[#ffffff] border border-[#ede4d8] text-[#7a6452] hover:text-[#3a281c]"
                            title="Edit Agenda"
                            aria-label={`Edit ${item.title}`}
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteMilestone(item.id, e)}
                            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                            title="Hapus Agenda"
                            aria-label={`Hapus ${item.title}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-base font-serif font-bold text-[#3a281c] group-hover:text-[#995c32] transition-colors flex items-center justify-between">
                        <span>{item.title}</span>
                        <ChevronRight className={cn(
                          "w-4 h-4 text-[#bdafa2] transition-transform shrink-0",
                          isExpanded && "rotate-90 text-[#c98858]"
                        )} />
                      </h3>
                      <p className="text-xs text-[#7a6452] leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-[#f1e7da] text-[11px] text-[#6f5a49]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#c98858]" />
                        <span className="font-medium text-[#4a382c]">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#c98858]" />
                        <span>PIC: <strong className="text-[#4a382c]">{item.pic}</strong></span>
                      </div>
                      <span className={cn(
                        "ml-auto text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        item.status === "completed" ? "bg-green-100 text-green-700" :
                        item.status === "in_progress" ? "bg-amber-100 text-amber-700" :
                        "bg-stone-100 text-stone-700"
                      )}>
                        {item.status === "completed" ? "Selesai" : item.status === "in_progress" ? "Sedang Berjalan" : "Mendatang"}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-[#f0e6d8] space-y-2 bg-[#fdfaf7] p-3.5 rounded-xl animate-in fade-in duration-200">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#6f5a49]">
                          Daftar Tindakan Utama ({item.keyActions.length} Poin)
                        </p>
                        <div className="space-y-1.5">
                          {item.keyActions.map((act, aIdx) => (
                            <div key={aIdx} className="flex items-start gap-2 text-xs text-[#3a281c]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#789d6e] shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

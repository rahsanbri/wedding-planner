"use client";

import React, { useState, useRef } from "react";
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Check, 
  X,
  CircleDot,
  ChevronRight
} from "lucide-react";
import { EventDetailData, WeddingTask, WeddingDocument } from "@/data/weddingEvents";
import { cn, createId } from "@/lib/utils";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import { eventProgress } from "@/lib/selectors";

interface EventDetailPageProps {
  event: EventDetailData;
  onBack: () => void;
}

type EventDetailTab = "checklist" | "timeline" | "documents";

export function EventDetailPage({ event, onBack }: EventDetailPageProps) {
  const { data, setEventTasks, setEventDocuments } = useWeddingData();
  const [activeTab, setActiveTab] = useState<EventDetailTab>("checklist");
  
  // Tasks State
  const taskList = data.eventTasks[event.id] ?? [];
  const [taskFilter, setTaskFilter] = useState<"all" | "active" | "completed">("all");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Persiapan");
  const [newTaskPic, setNewTaskPic] = useState("Lead Planner");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskCategory, setEditTaskCategory] = useState("");
  const [editTaskPic, setEditTaskPic] = useState("");

  // Sub-Event Timeline Filter
  const subTimelineMilestones = data.timeline.filter((item) => {
    if (event.id === "gereja") return item.pillar === "Gereja";
    if (event.id === "prewedding") return item.pillar === "Pre-Wedding";
    if (event.id === "midodareni") return item.pillar === "Midodareni";
    if (event.id === "resepsi") return item.pillar === "Resepsi";
    return true;
  });

  const [expandedTimelineId, setExpandedTimelineId] = useState<string | null>(
    subTimelineMilestones[0]?.id || null
  );

  // Documents State
  const docList = data.eventDocuments[event.id] ?? [];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Task Handlers ---
  const handleToggleTask = (taskId: string) => {
    setEventTasks(event.id, (previous) =>
      previous.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleStartEditTask = (task: WeddingTask, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskCategory(task.category);
    setEditTaskPic(task.pic);
  };

  const handleSaveEditTask = (taskId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editTaskTitle.trim()) return;
    setEventTasks(event.id, (previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: editTaskTitle.trim(),
              category: editTaskCategory.trim() || task.category,
              pic: editTaskPic.trim() || task.pic,
            }
          : task
      )
    );
    setEditingTaskId(null);
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Hapus to-do item ini?")) {
      setEventTasks(event.id, (previous) =>
        previous.filter((task) => task.id !== taskId)
      );
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: WeddingTask = {
      id: createId("task"),
      title: newTaskTitle.trim(),
      category: newTaskCategory.trim() || "Persiapan",
      completed: false,
      dueDate: "Menyesuaikan",
      pic: newTaskPic.trim() || "Lead Planner",
      priority: "medium",
    };
    setEventTasks(event.id, (previous) => [newTask, ...previous]);
    setNewTaskTitle("");
    setShowAddTask(false);
  };

  // --- Document Handlers ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const newDoc: WeddingDocument = {
      id: createId("doc"),
      name: file.name,
      type: file.type.split("/")[1]?.toUpperCase() || "FILE",
      status: "verified",
      uploadedDate: "Hari ini",
    };
    setEventDocuments(event.id, (previous) => [newDoc, ...previous]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm("Hapus berkas ini?")) {
      setEventDocuments(event.id, (previous) =>
        previous.filter((document) => document.id !== docId)
      );
    }
  };

  // Progress calculations
  const completedCount = taskList.filter((task) => task.completed).length;
  const progressPercent = eventProgress(taskList);

  const filteredTasks = taskList.filter((t) => {
    if (taskFilter === "active") return !t.completed;
    if (taskFilter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="space-y-3.5 sm:space-y-6 pb-8 sm:pb-12 w-full animate-in fade-in duration-300">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-[#ede4d8]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#805030] hover:text-[#3a281c] bg-[#ffffff] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-[#ede4d8] shadow-2xs hover:bg-[#faf5ef] transition-colors w-fit cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Kembali</span>
          <span className="hidden sm:inline">ke Dashboard</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <span className={cn("text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-current/20", event.badgeBg)}>
            {event.category}
          </span>
          <span className="text-[11px] sm:text-xs text-[#6f5a49]">
            Progres: <strong className="text-[#3a281c] font-bold">{progressPercent}%</strong>
          </span>
        </div>
      </div>

      {/* Compact Submenu Overview Card */}
      <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-gradient-to-r from-[#faece1] via-[#f7e4d6] to-[#f4dccb] border border-[#ecd5c3] shadow-2xs relative overflow-hidden">
        <div className="space-y-1 sm:space-y-1.5 relative z-10">
          <h1 className="text-sm sm:text-base font-serif font-bold text-[#3a281c] leading-tight">
            {event.title}
          </h1>
          <p className="text-[11px] sm:text-xs text-[#7a6452] leading-snug line-clamp-1 sm:line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[10px] sm:text-[11px] text-[#4a382c]">
            <div className="inline-flex items-center gap-1 bg-[#ffffff]/90 px-2 py-1 rounded-lg border border-[#ede1d4]">
              <Clock className="w-3 h-3 text-[#c98858] shrink-0" />
              <span className="font-medium">{event.targetDate}</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-[#ffffff]/90 px-2 py-1 rounded-lg border border-[#ede1d4]">
              <MapPin className="w-3 h-3 text-[#c98858] shrink-0" />
              <span className="font-medium">{event.location}</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-[#ffffff]/90 px-2 py-1 rounded-lg border border-[#ede1d4]">
              <User className="w-3 h-3 text-[#c98858] shrink-0" />
              <span className="font-medium">PIC: {event.picName}</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-[#ffffff]/90 px-2 py-1 rounded-lg border border-[#ede1d4]">
              <Phone className="w-3 h-3 text-[#c98858] shrink-0" />
              <span className="font-medium">{event.picPhone}</span>
            </div>
          </div>
        </div>

        {/* Sleek Compact Progress Bar */}
        <div className="mt-2.5 pt-2 border-t border-[#eed9c9]/80 flex items-center justify-between gap-3">
          <div className="flex-1 bg-[#f0e4d7] rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full rounded-full bg-[#c98858] transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-bold text-[#805030] whitespace-nowrap text-[10.5px] sm:text-[11.5px]">
            {completedCount}/{taskList.length} Tugas Selesai ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Tabs Switcher: Checklist | Timeline H-6 Bulan s/d Hari-H | Dokumen */}
      <div className="flex border-b border-[#ede4d8] gap-4">
        <button
          onClick={() => setActiveTab("checklist")}
          className={cn(
            "pb-3 text-xs md:text-sm font-semibold transition-all relative cursor-pointer",
            activeTab === "checklist" ? "text-[#3a281c] font-bold" : "text-[#6f5a49] hover:text-[#3a281c]"
          )}
        >
          <span>Checklist & To-Do List ({taskList.length})</span>
          {activeTab === "checklist" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c98858]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("timeline")}
          className={cn(
            "pb-3 text-xs md:text-sm font-semibold transition-all relative cursor-pointer",
            activeTab === "timeline" ? "text-[#3a281c] font-bold" : "text-[#6f5a49] hover:text-[#3a281c]"
          )}
        >
          <span>Timeline H-6 Bulan s/d Hari-H ({subTimelineMilestones.length})</span>
          {activeTab === "timeline" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c98858]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={cn(
            "pb-3 text-xs md:text-sm font-semibold transition-all relative cursor-pointer",
            activeTab === "documents" ? "text-[#3a281c] font-bold" : "text-[#6f5a49] hover:text-[#3a281c]"
          )}
        >
          <span>Dokumen & Berkas ({docList.length})</span>
          {activeTab === "documents" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c98858]" />
          )}
        </button>
      </div>

      {/* TAB 1: CHECKLIST & TO-DO LIST */}
      {activeTab === "checklist" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-[#f3e7dc] p-1 rounded-xl border border-[#ede1d5] text-xs w-fit">
              <button
                onClick={() => setTaskFilter("all")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer",
                  taskFilter === "all" ? "bg-[#c98858] text-[#ffffff] shadow-2xs font-semibold" : "text-[#7a6452]"
                )}
              >
                Semua ({taskList.length})
              </button>
              <button
                onClick={() => setTaskFilter("active")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer",
                  taskFilter === "active" ? "bg-[#c98858] text-[#ffffff] shadow-2xs font-semibold" : "text-[#7a6452]"
                )}
              >
                Aktif ({taskList.length - completedCount})
              </button>
              <button
                onClick={() => setTaskFilter("completed")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer",
                  taskFilter === "completed" ? "bg-[#c98858] text-[#ffffff] shadow-2xs font-semibold" : "text-[#7a6452]"
                )}
              >
                Selesai ({completedCount})
              </button>
            </div>

            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c98858] text-[#ffffff] text-xs font-semibold shadow-xs hover:brightness-105 transition-all w-fit cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah To-Do Baru</span>
            </button>
          </div>

          {/* Form Tambah Task */}
          {showAddTask && (
            <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-[#ffffff] border border-[#f0e6d8] shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-[#3a281c]">Tambah To-Do List Baru</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Judul to-do / pekerjaan..."
                  aria-label="Judul to-do baru"
                  className="px-3.5 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858] md:col-span-2"
                  autoFocus
                />
                <input
                  type="text"
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  placeholder="Kategori"
                  aria-label="Kategori to-do baru"
                  className="px-3.5 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
                />
              </div>
              <input
                type="text"
                value={newTaskPic}
                onChange={(e) => setNewTaskPic(e.target.value)}
                placeholder="Penanggung jawab (PIC)"
                aria-label="PIC to-do baru"
                className="w-full px-3.5 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-3 py-1.5 text-xs text-[#6f5a49] hover:text-[#3a281c] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#c98858] text-[#ffffff] text-xs font-semibold hover:brightness-105 cursor-pointer"
                >
                  Simpan To-Do
                </button>
              </div>
            </form>
          )}

          {/* List To-Do */}
          <div className="space-y-2.5">
            {filteredTasks.map((task) => {
              const isEditing = editingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => !isEditing && handleToggleTask(task.id)}
                  className={cn(
                    "soft-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer transition-all duration-150 select-none",
                    task.completed ? "bg-[#faf6f1]/60 opacity-80" : "hover:border-[#dfc8b4]"
                  )}
                >
                  {isEditing ? (
                    <form onSubmit={(e) => handleSaveEditTask(task.id, e)} className="flex-1 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTaskTitle}
                          onChange={(e) => setEditTaskTitle(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#fbf7f2] border border-[#c98858] text-xs font-medium text-[#3a281c]"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg bg-[#789d6e] text-white hover:brightness-105"
                          title="Simpan Perubahan"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTaskId(null)}
                          className="p-1.5 rounded-lg bg-[#ded3c5] text-[#3a281c] hover:bg-[#d4c8b8]"
                          title="Batal"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <button
                          className="text-[#c98858] shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTask(task.id);
                          }}
                          aria-label={
                            task.completed
                              ? `Tandai ${task.title} belum selesai`
                              : `Tandai ${task.title} selesai`
                          }
                          aria-pressed={task.completed}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-[#789d6e] fill-[#789d6e]/15" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#c98858]" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            "text-xs md:text-sm font-medium tracking-tight",
                            task.completed ? "line-through text-[#6f5a49]" : "text-[#3a281c]"
                          )}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2.5 mt-1 text-[11px] text-[#6f5a49]">
                            <span className="px-2 py-0.5 rounded bg-[#f3e7dc] text-[#7a6452] font-semibold text-[10px]">
                              {task.category}
                            </span>
                            <span>Target: {task.dueDate}</span>
                            <span>• PIC: {task.pic}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        <button
                          onClick={(e) => handleStartEditTask(task, e)}
                          className="p-1.5 rounded-lg bg-[#f4ece1] text-[#7a6452] hover:text-[#3a281c] hover:bg-[#ede1d3]"
                          title="Edit To-Do"
                          aria-label={`Edit ${task.title}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTask(task.id, e)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          title="Hapus To-Do"
                          aria-label={`Hapus ${task.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TIMELINE ROADMAP H-6 BULAN SAMPAI HARI-H SPESIFIK PILAR */}
      {activeTab === "timeline" && (
        <div className="soft-card p-6 space-y-6">
          <div className="border-b border-[#f0e6d8] pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-bold text-[#3a281c]">
                Timeline Persiapan {event.title}
              </h3>
              <p className="text-xs text-[#6f5a49]">
                Rangkaian roadmap terstruktur mulai dari fase H-6 Bulan sampai eksekusi Hari-H.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#f3e7dc] text-[#78614f] border border-[#ede1d5]">
              {subTimelineMilestones.length} Tahapan Utama
            </span>
          </div>

          {/* Interactive Timeline Track */}
          <div className="relative pl-6 md:pl-10 space-y-5 pt-1">
            <div className="absolute left-8 md:left-12 top-4 bottom-6 w-1 bg-gradient-to-b from-[#e5c378] via-[#c98858] to-[#805030] rounded-full" />

            {subTimelineMilestones.map((item) => {
              const isExpanded = expandedTimelineId === item.id;

              return (
                <div key={item.id} className="relative flex items-start gap-4 md:gap-5 group">
                  <div className="relative z-10 shrink-0 mt-1">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md",
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

                  <div 
                    onClick={() => setExpandedTimelineId(isExpanded ? null : item.id)}
                    className={cn(
                      "flex-1 p-4.5 rounded-2xl border transition-all cursor-pointer bg-[#fdfaf7]",
                      isExpanded ? "border-[#c98858] shadow-sm bg-white ring-2 ring-[#c98858]/20" : "border-[#ede4d8] hover:border-[#dfc8b4]"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#f0e6d8]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#f3e7dc] text-[#78614f]">
                          {item.phaseName}
                        </span>
                        <span className="text-xs font-semibold text-[#805030]">{item.dateFormatted}</span>
                      </div>
                      <ChevronRight className={cn(
                        "w-4 h-4 text-[#bdafa2] transition-transform",
                        isExpanded && "rotate-90 text-[#c98858]"
                      )} />
                    </div>

                    <h4 className="text-sm font-bold text-[#3a281c] mt-2 group-hover:text-[#995c32] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#7a6452] mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-[#f1e7da] text-[11px] text-[#6f5a49]">
                      <span>📍 {item.location}</span>
                      <span>• PIC: <strong className="text-[#3a281c]">{item.pic}</strong></span>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-2.5 border-t border-[#f0e6d8] space-y-1.5 bg-[#fbf7f2] p-3 rounded-xl animate-in fade-in">
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49]">
                          Tindakan Inti
                        </p>
                        {item.keyActions.map((act, aIdx) => (
                          <div key={aIdx} className="flex items-center gap-2 text-xs text-[#3a281c]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#789d6e] shrink-0" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DOKUMEN & BERKAS (UPLOAD & HAPUS) */}
      {activeTab === "documents" && (
        <div className="soft-card p-6 space-y-4">
          <div className="border-b border-[#f0e6d8] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-bold text-[#3a281c]">
                Kelengkapan Berkas & Legalitas
              </h3>
              <p className="text-xs text-[#6f5a49]">Upload berkas PDF/Gambar atau hapus berkas yang tidak diperlukan.</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.docx,.doc,.jpg,.png,.xlsx"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c98858] text-[#ffffff] text-xs font-semibold hover:brightness-105 shadow-2xs cursor-pointer"
              aria-label="Upload berkas acara"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Berkas</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {docList.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-[#fdfaf7] border border-[#ede4d8] flex items-center justify-between gap-3 group hover:border-[#dfc8b4] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#faece0] text-[#b57a41] flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#3a281c] truncate">{doc.name}</h4>
                    <p className="text-[10.5px] text-[#6f5a49] mt-0.5">
                      Format: {doc.type} {doc.uploadedDate ? `• ${doc.uploadedDate}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    "text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    doc.status === "verified" ? "bg-green-100 text-green-700" :
                    doc.status === "pending" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {doc.status}
                  </span>
                  
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                    title="Hapus Berkas"
                    aria-label={`Hapus ${doc.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

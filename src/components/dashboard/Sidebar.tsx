import React, { useMemo } from "react";
import { 
  Church, 
  Camera, 
  Flower2, 
  Heart, 
  BarChart3, 
  CheckSquare, 
  Briefcase, 
  Users, 
  CalendarRange, 
  ChevronRight,
  Settings,
  FileBarChart,
  Sparkles,
  LogOut,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import {
  budgetSummary,
  checklistSummary,
  formatCompactRupiah,
  guestSummary,
} from "@/lib/selectors";
import type { AuthUser } from "@/lib/auth";

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const mainEvents = [
  { id: "gereja", title: "Gereja", icon: Church },
  { id: "prewedding", title: "Pre-Wedding", icon: Camera },
  { id: "midodareni", title: "Midodareni", icon: Flower2 },
  { id: "resepsi", title: "Resepsi Pernikahan", icon: Heart },
];

export const supportingTools = [
  { id: "budget", name: "Budget Tracker", icon: BarChart3 },
  { id: "checklist", name: "Master Checklist", icon: CheckSquare },
  { id: "vendors", name: "Vendor Database", icon: Briefcase },
  { id: "guests", name: "Guest List", icon: Users },
  { id: "rundown", name: "Rundown & Timeline", icon: CalendarRange },
  { id: "report", name: "Laporan & Export", icon: FileBarChart },
];

export function Sidebar({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
  currentUser,
  onLogout,
}: SidebarProps) {
  const { data } = useWeddingData();

  const badges = useMemo(() => {
    const budget = budgetSummary(data.budgetItems);
    const checklist = checklistSummary(data.checklist);
    const guests = guestSummary(data.guests);

    return {
      budget: formatCompactRupiah(budget.totalEstimated),
      checklist: `${checklist.completed}/${checklist.total}`,
      vendors: `${data.vendors.length} Vendor`,
      guests: `${guests.totalInvitations} Pax`,
      rundown: `${data.timeline.length} Agenda`,
      report: "Cetak",
    } as Record<string, string>;
  }, [data]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-[#3a2a20]/40 backdrop-blur-xs z-40 lg:hidden print:hidden"
        />
      )}

      <aside className={cn(
        "fixed lg:static top-0 left-0 bottom-0 z-50 w-64 xl:w-72 bg-[#f8f3ec] border-r border-[#ede4d8] flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 select-none print:hidden",
        isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Brand Header */}
        <div className="relative pt-7 pb-5 px-6 flex flex-col items-center text-center">
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-xl text-[#7a6452] hover:bg-[#ede4d8] cursor-pointer"
            aria-label="Tutup menu navigasi"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Linked Wedding Rings Logo */}
          <div className="w-12 h-10 flex items-center justify-center text-[#c98858] mb-1.5">
            <svg width="44" height="32" viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="21" cy="22" r="14" stroke="#c98858" strokeWidth="2.75" />
              <circle cx="34" cy="18" r="14" stroke="#c98858" strokeWidth="2.75" />
              <path d="M21 7L24 10L21 13L18 10L21 7Z" fill="#c98858" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#3a281c] tracking-tight">
            Our Wedding
          </h1>
          <p className="text-[12px] tracking-widest text-[#995c32] uppercase font-bold mt-1">
            A&M
          </p>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5 custom-scrollbar">
          {/* Dashboard Entry: Hari Bahagia A&M */}
          <div>
            <button
              onClick={() => {
                onSelectView("overview");
                onCloseMobile();
              }}
              className={cn(
                "w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all duration-150 cursor-pointer group border",
                currentView === "overview"
                  ? "bg-[#3a281c] text-[#ffffff] border-[#3a281c] shadow-xs font-bold"
                  : "bg-[#ffffff]/80 hover:bg-[#ffffff] text-[#3a281c] border-[#ede4d8]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                  currentView === "overview" ? "bg-[#c98858] text-white" : "bg-[#f5ece1] text-[#995c32]"
                )}>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-semibold tracking-tight">Hari Bahagia A&M</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform",
                currentView === "overview" ? "text-[#f3d0b3]" : "text-[#bdafa2] group-hover:text-[#6f5a49]"
              )} />
            </button>
          </div>

          {/* Main Events Section */}
          <div>
            <p className="px-3 mb-2 text-[10.5px] font-bold tracking-widest uppercase text-[#6f5a49]">
              Rangkaian Utama
            </p>
            <div className="space-y-1">
              {mainEvents.map((evt) => {
                const Icon = evt.icon;
                const isActive = currentView === evt.id;
                return (
                  <button
                    key={evt.id}
                    onClick={() => {
                      onSelectView(evt.id);
                      onCloseMobile();
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-150 cursor-pointer group",
                      isActive
                        ? "bg-[#f1dfcf] text-[#6b3c1b] font-bold shadow-xs"
                        : "hover:bg-[#f1e6da] text-[#554437]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 flex items-center justify-center",
                        isActive ? "text-[#6b3c1b]" : "text-[#6f5a49]"
                      )}>
                        <Icon className="w-4.5 h-4.5 stroke-[2]" />
                      </div>
                      <span className="text-[13px]">{evt.title}</span>
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform",
                      isActive ? "text-[#6b3c1b]" : "text-[#bdafa2] group-hover:text-[#6f5a49]"
                    )} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Supporting Dashboard Section */}
          <div>
            <p className="px-3 mb-2 text-[10.5px] font-bold tracking-widest uppercase text-[#6f5a49]">
              Supporting Dashboard
            </p>
            <div className="space-y-1">
              {supportingTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = currentView === tool.id;
                const badge = badges[tool.id];
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectView(tool.id);
                      onCloseMobile();
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer group",
                      isActive
                        ? "bg-[#f1dfcf] text-[#6b3c1b] font-bold"
                        : "text-[#554437] hover:bg-[#f1e6da]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#6f5a49] group-hover:text-[#6b3c1b]" />
                      <span className="text-[12.5px]">{tool.name}</span>
                    </div>
                    {badge && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#eee1d1] text-[#78614f]">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quote Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#ffffff]/90 to-[#fdf9f5] border border-[#ede1d3] text-center shadow-xs">
            <div className="flex justify-center mb-1.5 text-[#c98858]">
              <Flower2 className="w-4 h-4" />
            </div>
            <p className="text-[11.5px] italic font-serif text-[#785b46] leading-relaxed">
              &ldquo;Cinta adalah awal, perencanaan adalah kunci.&rdquo;
            </p>
            <div className="text-[#c98858] mt-1 flex justify-center" aria-hidden="true">
              <Heart className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Footer: User Profile */}
        <div className="p-3.5 border-t border-[#ede4d8] bg-[#f8f3ec] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#3a281c] text-[#ffffff] font-bold text-xs flex items-center justify-center shadow-xs tracking-tight shrink-0">
              {currentUser ? currentUser.name.slice(0, 2).toUpperCase() : "A&M"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#3a281c] leading-tight truncate">
                {currentUser ? currentUser.name : "A&M"}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-[#16a34a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse shrink-0" />
                <span className="font-semibold text-[#554437] truncate">
                  {currentUser ? currentUser.role : "Wedding Active"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Keluar dari akun"
                aria-label="Keluar dari akun"
                className="p-1.5 rounded-lg text-[#7a6452] hover:text-[#e11d48] hover:bg-[#fae8e8] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
            <button 
              onClick={() => onSelectView("settings")}
              aria-label="Buka pengaturan"
              aria-current={currentView === "settings" ? "page" : undefined}
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer",
                currentView === "settings"
                  ? "bg-[#efe4d8] text-[#3a281c]"
                  : "text-[#6f5a49] hover:text-[#3a281c] hover:bg-[#efe4d8]"
              )}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

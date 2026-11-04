"use client";

import React, { useMemo, useState } from "react";
import {
  Bell,
  Briefcase,
  CalendarRange,
  CheckSquare,
  Menu,
  Plus,
  Users,
  Wallet,
  LogOut,
} from "lucide-react";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import {
  buildNotifications,
  filterUnreadNotifications,
} from "@/lib/notifications";
import type { NotificationTone } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/auth";

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenSearch?: () => void;
  onNavigate: (view: string) => void;
  onQuickAdd: (view: string) => void;
  isDashboard?: boolean;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

const quickActions = [
  { id: "guests", label: "Tambah Tamu", description: "Guest list & RSVP", icon: Users },
  { id: "budget", label: "Pos Anggaran", description: "Budget tracker", icon: Wallet },
  { id: "vendors", label: "Vendor Baru", description: "Vendor database", icon: Briefcase },
  { id: "checklist", label: "Checklist Baru", description: "Master checklist", icon: CheckSquare },
  { id: "rundown", label: "Agenda Timeline", description: "Rundown & timeline", icon: CalendarRange },
];

const toneStyles: Record<NotificationTone, string> = {
  urgent: "bg-[#e11d48]",
  warning: "bg-amber-500",
  info: "bg-[#789d6e]",
};

export function Topbar({
  onOpenMobileMenu,
  onNavigate,
  onQuickAdd,
  isDashboard = true,
  currentUser,
  onLogout,
}: TopbarProps) {
  const { data, markNotificationRead, markAllNotificationsRead, isCloudConnected, cloudSyncStatus } =
    useWeddingData();
  const notifications = useMemo(() => buildNotifications(data), [data]);
  const unreadNotifications = useMemo(
    () => filterUnreadNotifications(notifications, data.readNotificationIds),
    [notifications, data.readNotificationIds],
  );
  const unreadCount = unreadNotifications.length;
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const closeMenus = () => {
    setNotificationsOpen(false);
    setQuickActionsOpen(false);
  };

  return (
    <header className="relative h-14 sm:h-16 px-3.5 sm:px-6 md:px-10 bg-transparent flex items-center justify-between gap-2 sm:gap-4 select-none w-full print:hidden">
      {(notificationsOpen || quickActionsOpen) && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={closeMenus}
          className="fixed inset-0 z-40 cursor-default"
        />
      )}

      {/* Left side: Mobile Menu Hamburger & Cloud Sync Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl bg-[#ffffff] text-[#7a6452] shadow-xs lg:hidden border border-[#ede4d8] cursor-pointer shrink-0"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Realtime Cloud Sync Status */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors shrink-0",
            isCloudConnected
              ? cloudSyncStatus === "syncing"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-[#f4ece1]/80 text-[#8c7a6d] border-[#ede4d8]"
          )}
          title={
            isCloudConnected
              ? cloudSyncStatus === "syncing"
                ? "Sedang menyinkronkan data dengan Supabase..."
                : "Terkoneksi langsung ke Supabase Realtime (Multi-device)"
              : "Penyimpanan lokal aktif. Masukkan kredensial Supabase untuk sinkronisasi cloud real-time."
          }
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              isCloudConnected
                ? cloudSyncStatus === "syncing"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-emerald-500"
                : "bg-[#a69687]"
            )}
          />
          <span>
            {isCloudConnected
              ? cloudSyncStatus === "syncing"
                ? "Syncing..."
                : "Cloud Live"
              : "Mode Lokal"}
          </span>
        </div>
      </div>

      {/* Right side: notifications, quick actions, and user profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {isDashboard && (
          <>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setQuickActionsOpen(false);
                  setNotificationsOpen((previous) => !previous);
                }}
                aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
                aria-expanded={notificationsOpen}
                aria-haspopup="menu"
                className="relative p-2 sm:p-2.5 rounded-full bg-[#ffffff] text-[#7a6452] shadow-xs border border-[#ede4d8] hover:bg-[#fcf8f4] transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] px-1 rounded-full bg-[#e11d48] text-[#ffffff] text-[9px] sm:text-[9.5px] font-bold flex items-center justify-center ring-2 ring-[#ffffff]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto custom-scrollbar rounded-2xl border border-[#ede4d8] bg-[#ffffff] shadow-xl z-50 p-2">
                  <div className="flex items-start justify-between gap-2 px-2 py-1.5 border-b border-[#f0e6d8]">
                    <div>
                      <p className="text-xs font-bold text-[#3a281c]">Notifikasi</p>
                      <p className="text-[10px] text-[#6f5a49] mt-0.5">
                        {unreadCount} belum dibaca • {notifications.length} item
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          markAllNotificationsRead(
                            notifications.map((notification) => notification.id),
                          )
                        }
                        className="text-[10px] font-bold text-[#805030] hover:text-[#3a281c] underline underline-offset-2 shrink-0 cursor-pointer"
                      >
                        Tandai semua
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="px-2 py-6 text-center text-[11px] text-[#6f5a49]">
                      Semua beres. Tidak ada item yang perlu ditindaklanjuti.
                    </p>
                  ) : (
                    <div className="pt-1">
                      {notifications.map((notification) => {
                        const isUnread = !data.readNotificationIds.includes(
                          notification.id,
                        );

                        return (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() => {
                              markNotificationRead(notification.id);
                              onNavigate(notification.view);
                              closeMenus();
                            }}
                            className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#f8efe5] transition-colors cursor-pointer"
                          >
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                isUnread
                                  ? toneStyles[notification.tone]
                                  : "bg-[#e5ded5]",
                              )}
                            />
                            <span className="min-w-0">
                              <span
                                className={cn(
                                  "block text-[11px] font-bold",
                                  isUnread ? "text-[#3a281c]" : "text-[#6f5a49]",
                                )}
                              >
                                {notification.title}
                              </span>
                              <span className="block text-[10.5px] text-[#6f5a49] leading-snug mt-0.5">
                                {notification.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  setQuickActionsOpen((previous) => !previous);
                }}
                aria-label="Aksi cepat"
                aria-expanded={quickActionsOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-[#c98858] text-[#ffffff] shadow-xs hover:brightness-105 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-xs font-semibold">Aksi Cepat</span>
              </button>

              {quickActionsOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#ede4d8] bg-[#ffffff] shadow-xl z-50 p-2">
                  <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6f5a49]">
                    Tambah Cepat
                  </p>
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => {
                          onQuickAdd(action.id);
                          closeMenus();
                        }}
                        className="w-full text-left flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#f8efe5] transition-colors cursor-pointer"
                      >
                        <span className="w-8 h-8 rounded-lg bg-[#faece0] text-[#b57a41] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[11px] font-bold text-[#3a281c]">
                            {action.label}
                          </span>
                          <span className="block text-[10px] text-[#6f5a49]">
                            {action.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* User Profile Pill & Logout */}
        {currentUser && (
          <div className="flex items-center gap-1.5 sm:gap-2 pl-2 pr-1.5 py-1 rounded-full bg-[#ffffff] border border-[#ede4d8] shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-[#faece0] text-[#a06839] flex items-center justify-center text-[10.5px] font-bold shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col text-left pr-0.5 leading-tight">
              <span className="text-xs font-semibold text-[#3a281c] max-w-[100px] truncate">
                {currentUser.name}
              </span>
              <span className="text-[9.5px] text-[#a06839] font-medium truncate max-w-[100px]">
                {currentUser.role}
              </span>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Keluar dari sesi ini"
                aria-label="Keluar"
                className="p-1 rounded-full text-[#8c7a6d] hover:text-[#e11d48] hover:bg-[#fff1f2] transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

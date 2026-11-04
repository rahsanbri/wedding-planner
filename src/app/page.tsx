"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { EventCardsGrid } from "@/components/dashboard/EventCardsGrid";
import { SupportingDashboard } from "@/components/dashboard/SupportingDashboard";
import { DetailDrawer } from "@/components/dashboard/DetailDrawer";
import { EventDetailPage } from "@/components/dashboard/EventDetailPage";
import { BudgetPage } from "@/components/dashboard/BudgetPage";
import { GuestsPage } from "@/components/dashboard/GuestsPage";
import { VendorsPage } from "@/components/dashboard/VendorsPage";
import { ChecklistPage } from "@/components/dashboard/ChecklistPage";
import { TimelinePage } from "@/components/dashboard/TimelinePage";
import { SettingsPage } from "@/components/dashboard/SettingsPage";
import { ReportPage } from "@/components/dashboard/ReportPage";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { eventsDatabase } from "@/data/weddingEvents";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import { getStoredAuth, saveAuth, clearAuth } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";
import { WeddingAuthGate } from "@/components/auth/WeddingAuthGate";

const supportingViews = [
  "budget",
  "guests",
  "vendors",
  "checklist",
  "rundown",
  "settings",
  "report",
];

export default function WeddingMasterDashboard() {
  const { data } = useWeddingData();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredAuth());
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [currentView, setCurrentView] = useState("overview");
  const [selectedDrawerEventId, setSelectedDrawerEventId] = useState<string | null>(null);
  const [activeEventDetailId, setActiveEventDetailId] = useState<string | null>(null);
  const [activeSupportingView, setActiveSupportingView] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickAddView, setQuickAddView] = useState<string | null>(null);
  const [quickAddNonce, setQuickAddNonce] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsAuthChecked(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user: AuthUser) => {
    saveAuth(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenEventDetail = (eventId: string) => {
    if (eventsDatabase[eventId]) {
      setActiveSupportingView(null);
      setActiveEventDetailId(eventId);
      setCurrentView(eventId);
      setQuickAddView(null);
    }
  };

  const handleSelectSidebarView = (view: string) => {
    setQuickAddView(null);
    setCurrentView(view);

    if (eventsDatabase[view]) {
      setActiveSupportingView(null);
      setActiveEventDetailId(view);
    } else if (supportingViews.includes(view)) {
      setActiveEventDetailId(null);
      setActiveSupportingView(view);
    } else {
      setActiveEventDetailId(null);
      setActiveSupportingView(null);
    }
  };

  const handleQuickAdd = (view: string) => {
    setActiveEventDetailId(null);
    setActiveSupportingView(view);
    setCurrentView(view);
    setQuickAddView(view);
    setQuickAddNonce((previous) => previous + 1);
  };

  const baseEventData = activeEventDetailId ? eventsDatabase[activeEventDetailId] : null;
  const eventMeta = activeEventDetailId && data.eventMetas ? data.eventMetas[activeEventDetailId] : null;
  const activeEventData = baseEventData
    ? {
        ...baseEventData,
        ...(eventMeta
          ? {
              title: eventMeta.title,
              subtitle: eventMeta.subtitle,
              description: eventMeta.description,
              targetDate: eventMeta.time
                ? `${eventMeta.targetDate} • ${eventMeta.time}`
                : eventMeta.targetDate,
              location: eventMeta.location,
              picName: eventMeta.picName,
              picPhone: eventMeta.picPhone,
            }
          : {}),
      }
    : null;

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-[#fbf7f2] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#faece0] border-t-[#c98858] rounded-full animate-spin mb-4" />
        <p className="text-sm font-serif font-semibold text-[#6f5a49]">Memuat Hari Bahagia A&M...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <WeddingAuthGate
        masterKey={data.settings.accessKey || "AM2027"}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#fbf7f2] print:block print:h-auto print:overflow-visible">
      <Sidebar
        currentView={currentView}
        onSelectView={handleSelectSidebarView}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar print:overflow-visible print:h-auto">
        <Topbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onNavigate={handleSelectSidebarView}
          onQuickAdd={handleQuickAdd}
          isDashboard={!activeSupportingView && !activeEventDetailId && currentView === "overview"}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="px-2.5 sm:px-6 md:px-10 pb-6 sm:pb-8 space-y-3 sm:space-y-5 w-full print:px-0 print:pb-0">
          {activeSupportingView === "report" ? (
            <ReportPage
              onBack={() => {
                setActiveSupportingView(null);
                setCurrentView("overview");
              }}
            />
          ) : activeSupportingView === "settings" ? (
            <SettingsPage
              onBack={() => {
                setActiveSupportingView(null);
                setCurrentView("overview");
              }}
            />
          ) : activeSupportingView === "rundown" ? (
            <TimelinePage
              key={quickAddView === "rundown" ? `rundown-add-${quickAddNonce}` : "rundown"}
              initialShowAddForm={quickAddView === "rundown"}
              onBack={() => {
                setActiveSupportingView(null);
                setCurrentView("overview");
              }}
            />
          ) : activeSupportingView === "budget" ? (
            <BudgetPage
              key={quickAddView === "budget" ? `budget-add-${quickAddNonce}` : "budget"}
              initialShowAddForm={quickAddView === "budget"}
              onBack={() => {
                setActiveSupportingView(null);
                setCurrentView("overview");
              }}
            />
          ) : activeSupportingView === "guests" ? (
            <GuestsPage
              key={quickAddView === "guests" ? `guests-add-${quickAddNonce}` : "guests"}
              initialShowAddForm={quickAddView === "guests"}
              onBack={() => {
                setActiveSupportingView(null);
                setCurrentView("overview");
              }}
            />
          ) : activeSupportingView === "vendors" ? (
            <VendorsPage
              key={quickAddView === "vendors" ? `vendors-add-${quickAddNonce}` : "vendors"}
              initialShowAddForm={quickAddView === "vendors"}
              onBack={() => {
                setActiveSupportingView(null);
                setCurrentView("overview");
              }}
            />
          ) : activeSupportingView === "checklist" ? (
            <ChecklistPage
              key={quickAddView === "checklist" ? `checklist-add-${quickAddNonce}` : "checklist"}
              initialShowAddForm={quickAddView === "checklist"}
              onBack={() => {
                setActiveSupportingView(null);
                setCurrentView("overview");
              }}
            />
          ) : activeEventData ? (
            <EventDetailPage
              event={activeEventData}
              onBack={() => {
                setActiveEventDetailId(null);
                setCurrentView("overview");
              }}
            />
          ) : (
            <>
              <HeroBanner
                onViewGuestDetail={() => {
                  setActiveSupportingView("guests");
                  setCurrentView("guests");
                }}
              />

              <section>
                <EventCardsGrid
                  onSelectEvent={(id) => handleOpenEventDetail(id)}
                  onOpenQuickView={(id) => setSelectedDrawerEventId(id)}
                  selectedEventId={activeEventDetailId || undefined}
                />
              </section>

              <section className="pt-2">
                <SupportingDashboard
                  onDetailClick={(section) => {
                    if (section === "budget") {
                      setActiveSupportingView("budget");
                      setCurrentView("budget");
                    } else if (section === "guests") {
                      setActiveSupportingView("guests");
                      setCurrentView("guests");
                    } else if (section === "rundown") {
                      setActiveSupportingView("rundown");
                      setCurrentView("rundown");
                    } else {
                      setSelectedDrawerEventId(section);
                    }
                  }}
                />
              </section>
            </>
          )}
        </main>
      </div>

      <DetailDrawer
        eventId={selectedDrawerEventId}
        onClose={() => setSelectedDrawerEventId(null)}
        onOpenEvent={(eventId) => {
          setSelectedDrawerEventId(null);
          handleOpenEventDetail(eventId);
        }}
      />

      {searchOpen && (
        <CommandPalette
          onClose={() => setSearchOpen(false)}
          onNavigate={handleSelectSidebarView}
        />
      )}
    </div>
  );
}

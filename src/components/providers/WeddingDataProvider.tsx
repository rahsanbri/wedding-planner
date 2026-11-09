"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { WeddingTask, WeddingDocument } from "@/data/weddingEvents";
import type { BudgetItem } from "@/data/budgetData";
import type { Guest, Vendor } from "@/data/supportingData";
import type { MasterChecklistItem } from "@/data/checklistAndMoodboardData";
import type { TimelineMilestone } from "@/data/timelineRoadmapData";
import {
  createInitialWeddingData,
  createEmptyWeddingData,
  defaultEventMetas,
  mergeWeddingData,
  WEDDING_STORAGE_KEY,
} from "@/lib/weddingStorage";
import type { EventMeta, WeddingData, WeddingSettings } from "@/lib/weddingStorage";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  fetchFullCloudWeddingData,
  cloudSaveGuest,
  cloudDeleteGuest,
  cloudSaveBudgetItem,
  cloudDeleteBudgetItem,
  cloudSaveVendor,
  cloudDeleteVendor,
  cloudSaveChecklistItem,
  cloudDeleteChecklistItem,
  cloudSaveTimelineItem,
  cloudDeleteTimelineItem,
  cloudSaveSettings,
  cloudSaveAppMeta,
  cloudClearAllData,
  cloudSeedDemoData,
  subscribeToWeddingRealtime,
  mapGuestFromDb,
  mapBudgetItemFromDb,
  mapVendorFromDb,
  mapChecklistItemFromDb,
  mapTimelineFromDb,
  mapSettingsFromDb,
  mapAppMetaFromDb,
} from "@/lib/supabaseSync";

type Updater<T> = T | ((previous: T) => T);

export type CloudSyncStatus = "idle" | "syncing" | "synced" | "error";

interface WeddingDataContextValue {
  data: WeddingData;
  isHydrated: boolean;
  isCloudConnected: boolean;
  cloudSyncStatus: CloudSyncStatus;
  setEventTasks: (eventId: string, updater: Updater<WeddingTask[]>) => void;
  setEventDocuments: (eventId: string, updater: Updater<WeddingDocument[]>) => void;
  updateEventMeta: (eventId: string, meta: Partial<EventMeta>) => void;
  setBudgetItems: (updater: Updater<BudgetItem[]>) => void;
  setGuests: (updater: Updater<Guest[]>) => void;
  setVendors: (updater: Updater<Vendor[]>) => void;
  setChecklist: (updater: Updater<MasterChecklistItem[]>) => void;
  setTimeline: (updater: Updater<TimelineMilestone[]>) => void;
  setSettings: (updater: Updater<WeddingSettings>) => void;
  replaceData: (next: WeddingData) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (ids: string[]) => void;
  resetData: (mode?: "empty" | "demo") => Promise<void>;
  syncWithCloud: () => Promise<void>;
}

const WeddingDataContext = createContext<WeddingDataContextValue | null>(null);

function resolveUpdater<T>(current: T, updater: Updater<T>): T {
  if (typeof updater === "function") {
    return (updater as (previous: T) => T)(current);
  }
  return updater;
}

function readStoredData(): unknown {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(WEDDING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Unable to read saved wedding data.", error);
    return null;
  }
}

export function WeddingDataProvider({ children }: { children: ReactNode }) {
  // Initialize state directly with cached/localStorage data to avoid cascading render
  const [data, setData] = useState<WeddingData>(() => {
    const initial = createEmptyWeddingData();
    const stored = readStoredData();
    if (stored !== null) {
      return mergeWeddingData(initial, stored);
    }
    return initial;
  });

  const [isHydrated, setIsHydrated] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>("idle");

  useEffect(() => {
    // Flag hydration completion
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Continuous backup to LocalStorage
  useEffect(() => {
    if (!isHydrated) return;

    try {
      window.localStorage.setItem(WEDDING_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Unable to save wedding data to localStorage.", error);
    }
  }, [data, isHydrated]);

  // Supabase Cloud Sync & Realtime Subscription
  const syncWithCloud = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setIsCloudConnected(false);
      setCloudSyncStatus("idle");
      return;
    }

    try {
      setCloudSyncStatus("syncing");
      setIsCloudConnected(true);
      const cloudData = await fetchFullCloudWeddingData();

      if (cloudData) {
        setData((current) => ({
          ...current,
          guests: cloudData.guests !== null ? cloudData.guests : current.guests,
          budgetItems: cloudData.budget !== null ? cloudData.budget : current.budgetItems,
          vendors: cloudData.vendors !== null ? cloudData.vendors : current.vendors,
          checklist: cloudData.checklist !== null ? cloudData.checklist : current.checklist,
          timeline: cloudData.timeline !== null ? cloudData.timeline : current.timeline,
          settings: cloudData.settings ? { ...current.settings, ...cloudData.settings } : current.settings,
          eventTasks: cloudData.appMeta?.eventTasks || current.eventTasks,
          eventDocuments: cloudData.appMeta?.eventDocuments || current.eventDocuments,
          eventMetas: cloudData.appMeta?.eventMetas || current.eventMetas,
        }));
        setCloudSyncStatus("synced");
      } else {
        setCloudSyncStatus("idle");
      }
    } catch (error) {
      console.error("Cloud synchronization failed:", error);
      setCloudSyncStatus("error");
    }
  }, []);

  // Initial cloud sync and realtime setup on mount
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let isMounted = true;

    async function initCloudSync() {
      try {
        setCloudSyncStatus("syncing");
        setIsCloudConnected(true);
        const cloudData = await fetchFullCloudWeddingData();
        if (!isMounted) return;

        if (cloudData) {
          setData((current) => ({
            ...current,
            guests: cloudData.guests !== null ? cloudData.guests : current.guests,
            budgetItems: cloudData.budget !== null ? cloudData.budget : current.budgetItems,
            vendors: cloudData.vendors !== null ? cloudData.vendors : current.vendors,
            checklist: cloudData.checklist !== null ? cloudData.checklist : current.checklist,
            timeline: cloudData.timeline !== null ? cloudData.timeline : current.timeline,
            settings: cloudData.settings ? { ...current.settings, ...cloudData.settings } : current.settings,
            eventTasks: cloudData.appMeta?.eventTasks || current.eventTasks,
            eventDocuments: cloudData.appMeta?.eventDocuments || current.eventDocuments,
            eventMetas: cloudData.appMeta?.eventMetas || current.eventMetas,
          }));
          setCloudSyncStatus("synced");
        } else {
          setCloudSyncStatus("idle");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Cloud initialization failed:", err);
        setCloudSyncStatus("error");
      }
    }

    void initCloudSync();

    const channel = subscribeToWeddingRealtime((table, eventType, newRow, oldRow) => {
      setCloudSyncStatus("syncing");

      if (table === "guests") {
        setData((prev) => {
          if (eventType === "DELETE") {
            return { ...prev, guests: prev.guests.filter((g) => g.id !== oldRow?.id) };
          }
          const updated = mapGuestFromDb(newRow);
          const exists = prev.guests.some((g) => g.id === updated.id);
          return {
            ...prev,
            guests: exists
              ? prev.guests.map((g) => (g.id === updated.id ? updated : g))
              : [...prev.guests, updated],
          };
        });
      } else if (table === "budget_items") {
        setData((prev) => {
          if (eventType === "DELETE") {
            return { ...prev, budgetItems: prev.budgetItems.filter((b) => b.id !== oldRow?.id) };
          }
          const updated = mapBudgetItemFromDb(newRow);
          const exists = prev.budgetItems.some((b) => b.id === updated.id);
          return {
            ...prev,
            budgetItems: exists
              ? prev.budgetItems.map((b) => (b.id === updated.id ? updated : b))
              : [...prev.budgetItems, updated],
          };
        });
      } else if (table === "vendors") {
        setData((prev) => {
          if (eventType === "DELETE") {
            return { ...prev, vendors: prev.vendors.filter((v) => v.id !== oldRow?.id) };
          }
          const updated = mapVendorFromDb(newRow);
          const exists = prev.vendors.some((v) => v.id === updated.id);
          return {
            ...prev,
            vendors: exists
              ? prev.vendors.map((v) => (v.id === updated.id ? updated : v))
              : [...prev.vendors, updated],
          };
        });
      } else if (table === "checklist_items") {
        setData((prev) => {
          if (eventType === "DELETE") {
            return { ...prev, checklist: prev.checklist.filter((c) => c.id !== oldRow?.id) };
          }
          const updated = mapChecklistItemFromDb(newRow);
          const exists = prev.checklist.some((c) => c.id === updated.id);
          return {
            ...prev,
            checklist: exists
              ? prev.checklist.map((c) => (c.id === updated.id ? updated : c))
              : [...prev.checklist, updated],
          };
        });
      } else if (table === "timeline_milestones") {
        setData((prev) => {
          if (eventType === "DELETE") {
            return { ...prev, timeline: prev.timeline.filter((t) => t.id !== oldRow?.id) };
          }
          const updated = mapTimelineFromDb(newRow);
          const exists = prev.timeline.some((t) => t.id === updated.id);
          return {
            ...prev,
            timeline: exists
              ? prev.timeline.map((t) => (t.id === updated.id ? updated : t))
              : [...prev.timeline, updated],
          };
        });
      } else if (table === "wedding_settings") {
        if (newRow?.id === "app_meta") {
          const appMeta = mapAppMetaFromDb(newRow);
          if (appMeta) {
            setData((prev) => ({
              ...prev,
              eventTasks: appMeta.eventTasks,
              eventDocuments: appMeta.eventDocuments,
              eventMetas: appMeta.eventMetas || prev.eventMetas,
            }));
          }
        } else {
          const updated = mapSettingsFromDb(newRow);
          setData((prev) => ({ ...prev, settings: { ...prev.settings, ...updated } }));
        }
      }

      setTimeout(() => setCloudSyncStatus("synced"), 400);
    });

    return () => {
      isMounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  // Local & Cloud updaters
  const setEventTasks = useCallback(
    (eventId: string, updater: Updater<WeddingTask[]>) => {
      setData((current) => {
        const nextEventTasks = {
          ...current.eventTasks,
          [eventId]: resolveUpdater(current.eventTasks[eventId] ?? [], updater),
        };
        if (isSupabaseConfigured()) {
          void cloudSaveAppMeta({
            eventTasks: nextEventTasks,
            eventDocuments: current.eventDocuments,
            eventMetas: current.eventMetas,
          });
        }
        return {
          ...current,
          eventTasks: nextEventTasks,
        };
      });
    },
    [],
  );

  const setEventDocuments = useCallback(
    (eventId: string, updater: Updater<WeddingDocument[]>) => {
      setData((current) => {
        const nextEventDocuments = {
          ...current.eventDocuments,
          [eventId]: resolveUpdater(current.eventDocuments[eventId] ?? [], updater),
        };
        if (isSupabaseConfigured()) {
          void cloudSaveAppMeta({
            eventTasks: current.eventTasks,
            eventDocuments: nextEventDocuments,
            eventMetas: current.eventMetas,
          });
        }
        return {
          ...current,
          eventDocuments: nextEventDocuments,
        };
      });
    },
    [],
  );

  const updateEventMeta = useCallback(
    (eventId: string, meta: Partial<EventMeta>) => {
      setData((current) => {
        const currentMetas = current.eventMetas || defaultEventMetas;
        const currentMeta = currentMetas[eventId] || defaultEventMetas[eventId] || {
          title: "",
          subtitle: "",
          description: "",
          targetDate: "",
          time: "",
          location: "",
          picName: "",
          picPhone: "",
        };
        const nextEventMetas = {
          ...currentMetas,
          [eventId]: { ...currentMeta, ...meta },
        };
        if (isSupabaseConfigured()) {
          void cloudSaveAppMeta({
            eventTasks: current.eventTasks,
            eventDocuments: current.eventDocuments,
            eventMetas: nextEventMetas,
          });
        }
        return {
          ...current,
          eventMetas: nextEventMetas,
        };
      });
    },
    [],
  );

  const setBudgetItems = useCallback((updater: Updater<BudgetItem[]>) => {
    setData((current) => {
      const nextItems = resolveUpdater(current.budgetItems, updater);
      if (isSupabaseConfigured()) {
        const nextIds = new Set(nextItems.map((b) => b.id));
        current.budgetItems
          .filter((b) => !nextIds.has(b.id))
          .forEach((b) => {
            void cloudDeleteBudgetItem(b.id);
          });
        nextItems.forEach((item) => {
          void cloudSaveBudgetItem(item);
        });
      }
      return { ...current, budgetItems: nextItems };
    });
  }, []);

  const setGuests = useCallback((updater: Updater<Guest[]>) => {
    setData((current) => {
      const nextGuests = resolveUpdater(current.guests, updater);
      if (isSupabaseConfigured()) {
        const nextIds = new Set(nextGuests.map((g) => g.id));
        current.guests
          .filter((g) => !nextIds.has(g.id))
          .forEach((g) => {
            void cloudDeleteGuest(g.id);
          });
        nextGuests.forEach((g) => {
          void cloudSaveGuest(g);
        });
      }
      return { ...current, guests: nextGuests };
    });
  }, []);

  const setVendors = useCallback((updater: Updater<Vendor[]>) => {
    setData((current) => {
      const nextVendors = resolveUpdater(current.vendors, updater);
      if (isSupabaseConfigured()) {
        const nextIds = new Set(nextVendors.map((v) => v.id));
        current.vendors
          .filter((v) => !nextIds.has(v.id))
          .forEach((v) => {
            void cloudDeleteVendor(v.id);
          });
        nextVendors.forEach((v) => {
          void cloudSaveVendor(v);
        });
      }
      return { ...current, vendors: nextVendors };
    });
  }, []);

  const setChecklist = useCallback((updater: Updater<MasterChecklistItem[]>) => {
    setData((current) => {
      const nextChecklist = resolveUpdater(current.checklist, updater);
      if (isSupabaseConfigured()) {
        const nextIds = new Set(nextChecklist.map((c) => c.id));
        current.checklist
          .filter((c) => !nextIds.has(c.id))
          .forEach((c) => {
            void cloudDeleteChecklistItem(c.id);
          });
        nextChecklist.forEach((c) => {
          void cloudSaveChecklistItem(c);
        });
      }
      return { ...current, checklist: nextChecklist };
    });
  }, []);

  const setTimeline = useCallback((updater: Updater<TimelineMilestone[]>) => {
    setData((current) => {
      const nextTimeline = resolveUpdater(current.timeline, updater);
      if (isSupabaseConfigured()) {
        const nextIds = new Set(nextTimeline.map((t) => t.id));
        current.timeline
          .filter((t) => !nextIds.has(t.id))
          .forEach((t) => {
            void cloudDeleteTimelineItem(t.id);
          });
        nextTimeline.forEach((t) => {
          void cloudSaveTimelineItem(t);
        });
      }
      return { ...current, timeline: nextTimeline };
    });
  }, []);

  const setSettings = useCallback((updater: Updater<WeddingSettings>) => {
    setData((current) => {
      const nextSettings = resolveUpdater(current.settings, updater);
      if (isSupabaseConfigured()) {
        void cloudSaveSettings(nextSettings);
      }
      return { ...current, settings: nextSettings };
    });
  }, []);

  const replaceData = useCallback((next: WeddingData) => {
    setData(next);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setData((current) =>
      current.readNotificationIds.includes(id)
        ? current
        : {
            ...current,
            readNotificationIds: [...current.readNotificationIds, id],
          },
    );
  }, []);

  const markAllNotificationsRead = useCallback((ids: string[]) => {
    setData((current) => {
      const merged = new Set([...current.readNotificationIds, ...ids]);
      if (merged.size === current.readNotificationIds.length) return current;

      return { ...current, readNotificationIds: [...merged] };
    });
  }, []);

  const resetData = useCallback(async (mode: "empty" | "demo" = "empty") => {
    const targetData =
      mode === "empty" ? createEmptyWeddingData() : createInitialWeddingData();
    setData(targetData);

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(WEDDING_STORAGE_KEY, JSON.stringify(targetData));
      }
    } catch (e) {
      console.warn("Error saving to localStorage on reset:", e);
    }

    if (isSupabaseConfigured()) {
      setCloudSyncStatus("syncing");
      if (mode === "empty") {
        await cloudClearAllData();
      } else {
        await cloudSeedDemoData(targetData);
      }
      setCloudSyncStatus("synced");
    }
  }, []);

  const value = useMemo<WeddingDataContextValue>(
    () => ({
      data,
      isHydrated,
      isCloudConnected,
      cloudSyncStatus,
      setEventTasks,
      setEventDocuments,
      updateEventMeta,
      setBudgetItems,
      setGuests,
      setVendors,
      setChecklist,
      setTimeline,
      setSettings,
      replaceData,
      markNotificationRead,
      markAllNotificationsRead,
      resetData,
      syncWithCloud,
    }),
    [
      data,
      isHydrated,
      isCloudConnected,
      cloudSyncStatus,
      setEventTasks,
      setEventDocuments,
      updateEventMeta,
      setBudgetItems,
      setGuests,
      setVendors,
      setChecklist,
      setTimeline,
      setSettings,
      replaceData,
      markNotificationRead,
      markAllNotificationsRead,
      resetData,
      syncWithCloud,
    ],
  );

  return (
    <WeddingDataContext.Provider value={value}>{children}</WeddingDataContext.Provider>
  );
}

export function useWeddingData(): WeddingDataContextValue {
  const context = useContext(WeddingDataContext);
  if (!context) {
    throw new Error("useWeddingData must be used inside WeddingDataProvider");
  }
  return context;
}

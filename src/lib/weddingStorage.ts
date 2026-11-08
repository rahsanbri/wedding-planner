import { eventsDatabase } from "../data/weddingEvents";
import type { WeddingTask, WeddingDocument } from "../data/weddingEvents";
import { initialBudgetItems } from "../data/budgetData";
import type { BudgetItem } from "../data/budgetData";
import { initialGuestList, initialVendorList } from "../data/supportingData";
import type { Guest, Vendor } from "../data/supportingData";
import { initialMasterChecklist } from "../data/checklistAndMoodboardData";
import type { MasterChecklistItem } from "../data/checklistAndMoodboardData";
import { timelineDatabase } from "../data/timelineRoadmapData";
import type { TimelineMilestone } from "../data/timelineRoadmapData";

export interface EventMeta {
  title: string;
  subtitle: string;
  description: string;
  targetDate: string;
  time: string;
  location: string;
  picName: string;
  picPhone: string;
}

export const defaultEventMetas: Record<string, EventMeta> = {
  gereja: {
    title: "Gereja (Pemberkatan / Nikah)",
    subtitle: "Pendaftaran Kanonik & Sakramen Pernikahan Suci",
    description: "Seluruh kelengkapan administrasi gereja, penyelidikan kanonik oleh Pastor Paroki, kursus persiapan perkawinan (KPP), serta gladi bersih liturgi dan paduan suara.",
    targetDate: "Minggu, 16 Mei 2027",
    time: "09.00 - 11.00 WIB",
    location: "Gereja Katedral St. Maria Diangkat Ke Surga, Jakarta",
    picName: "Maria & Romo Yosef (Sekretariat Paroki)",
    picPhone: "+62 812-3456-7890",
  },
  prewedding: {
    title: "Pre-Wedding",
    subtitle: "Konsep Visual, Dokumentasi Outdoor & Cetak Galeri",
    description: "Sesi dokumentasi foto & video kreatif pra-nikah dengan tema perpaduan Tradisional Modern dan Romantis Alam Terbuka untuk dipajang di galeri pernikahan Hari-H.",
    targetDate: "Februari 2027",
    time: "Sesi 2 Hari (Outdoor & Studio)",
    location: "Studio Kencana Art & Taman Nasional Bromo Tengger Semeru",
    picName: "Arya (Lead Visual) & Jessica (MUA)",
    picPhone: "+62 813-9876-5432",
  },
  midodareni: {
    title: "Midodareni",
    subtitle: "Malam Adat Jawa Sebelum Hari-H Pernikahan",
    description: "Malam sakral sebelum hari pernikahan menurut adat Jawa gagrak Surakarta/Yogyakarta. Melambangkan turunnya bidadari khayangan yang menyempurnakan paras dan aura mempelai wanita (calon penganten).",
    targetDate: "Sabtu, 15 Mei 2027",
    time: "18.30 - 22.00 WIB",
    location: "Kediaman Mempelai Wanita (Rumah Joglo)",
    picName: "Ibu Condro & Bp. Suryo (Pranata Cara Adat)",
    picPhone: "+62 811-2345-6789",
  },
  resepsi: {
    title: "Resepsi Pernikahan",
    subtitle: "Puncak Perayaan, Pelayanan Tamu & Operasional Vendor",
    description: "Perhelatan akbar resepsi pernikahan malam hari di ballroom. Mengoordinasikan seluruh 14 vendor utama, melayani 450 undangan VIP/keluarga, alur prasmanan katering, serta kelancaran hiburan musik.",
    targetDate: "Minggu, 16 Mei 2027",
    time: "19.00 - 22.00 WIB",
    location: "Grand Ballroom Hotel Mulia Senayan, Jakarta",
    picName: "Daniel & Tim Wedding Organizer (12 Crew)",
    picPhone: "+62 811-9988-7766",
  },
};

export interface WeddingData {
  eventTasks: Record<string, WeddingTask[]>;
  eventDocuments: Record<string, WeddingDocument[]>;
  eventMetas?: Record<string, EventMeta>;
  budgetItems: BudgetItem[];
  guests: Guest[];
  vendors: Vendor[];
  checklist: MasterChecklistItem[];
  timeline: TimelineMilestone[];
  settings: WeddingSettings;
  readNotificationIds: string[];
}

export interface WeddingSettings {
  targetDate: string;
  targetDateLabel: string;
  guestTarget: number;
  accessKey?: string;
}

export const WEDDING_STORAGE_KEY = "wedding-planner-data-v1";

export const weddingSettings: WeddingSettings = {
  targetDate: "2027-05-16T00:00:00+07:00",
  targetDateLabel: "16 Mei 2027",
  guestTarget: 450,
  accessKey: "AM2027",
};

function cloneItems<T>(items: T[]): T[] {
  return items.map((item) => ({ ...item }));
}

export function createInitialWeddingData(): WeddingData {
  const eventTasks: Record<string, WeddingTask[]> = {};
  const eventDocuments: Record<string, WeddingDocument[]> = {};

  for (const [eventId, event] of Object.entries(eventsDatabase)) {
    eventTasks[eventId] = cloneItems(event.tasks);
    eventDocuments[eventId] = cloneItems(event.documents);
  }

  return {
    eventTasks,
    eventDocuments,
    eventMetas: { ...defaultEventMetas },
    budgetItems: cloneItems(initialBudgetItems),
    guests: cloneItems(initialGuestList),
    vendors: cloneItems(initialVendorList),
    checklist: cloneItems(initialMasterChecklist),
    timeline: timelineDatabase.map((milestone) => ({
      ...milestone,
      keyActions: [...milestone.keyActions],
    })),
    settings: { ...weddingSettings },
    readNotificationIds: [],
  };
}

export function createEmptyWeddingData(): WeddingData {
  const eventTasks: Record<string, WeddingTask[]> = {};
  const eventDocuments: Record<string, WeddingDocument[]> = {};

  for (const eventId of Object.keys(eventsDatabase)) {
    eventTasks[eventId] = [];
    eventDocuments[eventId] = [];
  }

  return {
    eventTasks,
    eventDocuments,
    eventMetas: { ...defaultEventMetas },
    budgetItems: [],
    guests: [],
    vendors: [],
    checklist: [],
    timeline: [],
    settings: { ...weddingSettings, guestTarget: 0 },
    readNotificationIds: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function mergeWeddingData(base: WeddingData, stored: unknown): WeddingData {
  if (!isRecord(stored)) return base;

  const next: WeddingData = { ...base };
  let hasUsableField = false;

  if (Array.isArray(stored.budgetItems)) {
    next.budgetItems = stored.budgetItems as BudgetItem[];
    hasUsableField = true;
  }
  if (Array.isArray(stored.guests)) {
    next.guests = stored.guests as Guest[];
    hasUsableField = true;
  }
  if (Array.isArray(stored.vendors)) {
    next.vendors = stored.vendors as Vendor[];
    hasUsableField = true;
  }
  if (Array.isArray(stored.checklist)) {
    next.checklist = stored.checklist as MasterChecklistItem[];
    hasUsableField = true;
  }
  if (Array.isArray(stored.timeline)) {
    next.timeline = stored.timeline as TimelineMilestone[];
    hasUsableField = true;
  }

  if (isRecord(stored.eventTasks)) {
    const eventTasks: Record<string, WeddingTask[]> = { ...base.eventTasks };
    for (const [eventId, tasks] of Object.entries(stored.eventTasks)) {
      if (Array.isArray(tasks)) {
        eventTasks[eventId] = tasks as WeddingTask[];
        hasUsableField = true;
      }
    }
    next.eventTasks = eventTasks;
  }

  if (isRecord(stored.eventDocuments)) {
    const eventDocuments: Record<string, WeddingDocument[]> = { ...base.eventDocuments };
    for (const [eventId, documents] of Object.entries(stored.eventDocuments)) {
      if (Array.isArray(documents)) {
        eventDocuments[eventId] = documents as WeddingDocument[];
        hasUsableField = true;
      }
    }
    next.eventDocuments = eventDocuments;
  }

  if (isRecord(stored.settings)) {
    const storedSettings = stored.settings;
    const nextSettings = { ...base.settings };
    let hasUsableSettings = false;

    if (
      typeof storedSettings.targetDate === "string" &&
      storedSettings.targetDate.length > 0
    ) {
      nextSettings.targetDate = storedSettings.targetDate;
      hasUsableSettings = true;
    }

    if (
      typeof storedSettings.targetDateLabel === "string" &&
      storedSettings.targetDateLabel.length > 0
    ) {
      nextSettings.targetDateLabel = storedSettings.targetDateLabel;
      hasUsableSettings = true;
    }

    if (
      typeof storedSettings.guestTarget === "number" &&
      Number.isFinite(storedSettings.guestTarget) &&
      storedSettings.guestTarget > 0
    ) {
      nextSettings.guestTarget = storedSettings.guestTarget;
      hasUsableSettings = true;
    }

    if (
      typeof storedSettings.accessKey === "string" &&
      storedSettings.accessKey.trim().length > 0
    ) {
      nextSettings.accessKey = storedSettings.accessKey.trim();
      hasUsableSettings = true;
    }

    if (hasUsableSettings) {
      next.settings = nextSettings;
      hasUsableField = true;
    }
  }

  if (Array.isArray(stored.readNotificationIds)) {
    next.readNotificationIds = [
      ...new Set(
        stored.readNotificationIds.filter(
          (id): id is string => typeof id === "string" && id.length > 0,
        ),
      ),
    ];
    hasUsableField = true;
  }

  if (isRecord(stored.eventMetas)) {
    const eventMetas: Record<string, EventMeta> = { ...(base.eventMetas || defaultEventMetas) };
    for (const [id, meta] of Object.entries(stored.eventMetas)) {
      if (isRecord(meta)) {
        eventMetas[id] = { ...(eventMetas[id] || defaultEventMetas[id]), ...(meta as unknown as EventMeta) };
        hasUsableField = true;
      }
    }
    next.eventMetas = eventMetas;
  } else if (!next.eventMetas) {
    next.eventMetas = { ...defaultEventMetas };
  }

  return hasUsableField ? next : base;
}

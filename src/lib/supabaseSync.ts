import { supabase, isSupabaseConfigured } from "./supabase";
import { Guest, Vendor } from "@/data/supportingData";
import { BudgetItem } from "@/data/budgetData";
import { MasterChecklistItem } from "@/data/checklistAndMoodboardData";
import { TimelineMilestone } from "@/data/timelineRoadmapData";
import { WeddingData, WeddingSettings } from "@/lib/weddingStorage";
import { RealtimeChannel } from "@supabase/supabase-js";

// ==========================================
// MAPPERS: DB (snake_case) <-> APP (camelCase)
// ==========================================

export const mapGuestFromDb = (row: Record<string, unknown>): Guest => ({
  id: String(row.id || ""),
  name: String(row.name || ""),
  category: (row.category as Guest["category"]) || "Sahabat & Teman",
  invitationCount: Number(row.invitation_count || 1),
  tableNumber: String(row.table_number || ""),
  rsvpStatus: (row.rsvp_status as Guest["rsvpStatus"]) || "menunggu",
  attendanceEvent: (row.attendance_event as Guest["attendanceEvent"]) || "Semua Acara",
  phone: row.phone ? String(row.phone) : undefined,
  notes: row.notes ? String(row.notes) : undefined,
});

export const mapGuestToDb = (guest: Guest) => ({
  id: guest.id,
  name: guest.name,
  category: guest.category,
  invitation_count: guest.invitationCount,
  table_number: guest.tableNumber,
  rsvp_status: guest.rsvpStatus,
  attendance_event: guest.attendanceEvent,
  phone: guest.phone || null,
  notes: guest.notes || null,
  updated_at: new Date().toISOString(),
});

export const mapBudgetItemFromDb = (row: Record<string, unknown>): BudgetItem => ({
  id: String(row.id || ""),
  category: (row.category as BudgetItem["category"]) || "Lain-lain",
  title: String(row.title || ""),
  vendorName: String(row.vendor_name || ""),
  estimatedBudget: Number(row.estimated_budget || 0),
  actualPaid: Number(row.actual_paid || 0),
  paymentStatus: (row.payment_status as BudgetItem["paymentStatus"]) || "belum_bayar",
  notes: row.notes ? String(row.notes) : undefined,
});

export const mapBudgetItemToDb = (item: BudgetItem) => ({
  id: item.id,
  category: item.category,
  title: item.title,
  vendor_name: item.vendorName,
  estimated_budget: item.estimatedBudget,
  actual_paid: item.actualPaid,
  payment_status: item.paymentStatus,
  notes: item.notes || null,
  updated_at: new Date().toISOString(),
});

export const mapVendorFromDb = (row: Record<string, unknown>): Vendor => ({
  id: String(row.id || ""),
  name: String(row.name || ""),
  category: (row.category as Vendor["category"]) || "Venue",
  contactPerson: String(row.contact_person || ""),
  phone: String(row.phone || ""),
  email: String(row.email || ""),
  contractStatus: (row.contract_status as Vendor["contractStatus"]) || "draft",
  paymentProgress: Number(row.payment_progress || 0),
  totalContract: Number(row.total_contract || 0),
});

export const mapVendorToDb = (vendor: Vendor) => ({
  id: vendor.id,
  name: vendor.name,
  category: vendor.category,
  contact_person: vendor.contactPerson,
  phone: vendor.phone,
  email: vendor.email,
  contract_status: vendor.contractStatus,
  payment_progress: vendor.paymentProgress,
  total_contract: vendor.totalContract,
  updated_at: new Date().toISOString(),
});

export const mapChecklistItemFromDb = (row: Record<string, unknown>): MasterChecklistItem => ({
  id: String(row.id || ""),
  title: String(row.title || ""),
  phase: (row.phase as MasterChecklistItem["phase"]) || "H-180 s/d H-120",
  pillar: (row.pillar as MasterChecklistItem["pillar"]) || "Umum / Finansial",
  pic: String(row.pic || ""),
  completed: Boolean(row.completed),
  priority: (row.priority as MasterChecklistItem["priority"]) || "medium",
  dueDate: String(row.due_date || ""),
});

export const mapChecklistItemToDb = (item: MasterChecklistItem) => ({
  id: item.id,
  title: item.title,
  phase: item.phase,
  pillar: item.pillar,
  pic: item.pic,
  completed: item.completed,
  priority: item.priority,
  due_date: item.dueDate,
  updated_at: new Date().toISOString(),
});

export const mapTimelineFromDb = (row: Record<string, unknown>): TimelineMilestone => ({
  id: String(row.id || ""),
  phaseId: (row.phase_id as TimelineMilestone["phaseId"]) || "h-6m",
  phaseName: String(row.phase_name || ""),
  timeframe: String(row.timeframe || ""),
  title: String(row.title || ""),
  pillar: (row.pillar as TimelineMilestone["pillar"]) || "Master",
  dateFormatted: String(row.date_formatted || ""),
  description: String(row.description || ""),
  location: String(row.location || ""),
  pic: String(row.pic || ""),
  status: (row.status as TimelineMilestone["status"]) || "upcoming",
  keyActions: Array.isArray(row.key_actions) ? (row.key_actions as string[]) : [],
});

export const mapTimelineToDb = (item: TimelineMilestone) => ({
  id: item.id,
  phase_id: item.phaseId,
  phase_name: item.phaseName,
  timeframe: item.timeframe,
  title: item.title,
  pillar: item.pillar,
  date_formatted: item.dateFormatted,
  description: item.description,
  location: item.location,
  pic: item.pic,
  status: item.status,
  key_actions: item.keyActions,
  updated_at: new Date().toISOString(),
});

export const mapSettingsFromDb = (row: Record<string, unknown>): WeddingSettings => ({
  targetDate: String(row.target_date || "2027-05-16T00:00:00+07:00"),
  targetDateLabel: String(row.target_date_label || "16 Mei 2027"),
  guestTarget: Number(row.guest_target || 450),
});

export const mapSettingsToDb = (settings: WeddingSettings) => ({
  id: "primary",
  target_date: settings.targetDate,
  target_date_label: settings.targetDateLabel,
  guest_target: settings.guestTarget,
  updated_at: new Date().toISOString(),
});

// ==========================================
// SUPABASE API CRUD SERVICES
// ==========================================

export async function fetchFullCloudWeddingData() {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const [guestsRes, budgetRes, vendorsRes, checklistRes, timelineRes, settingsRes] =
      await Promise.all([
        supabase.from("guests").select("*").order("name"),
        supabase.from("budget_items").select("*").order("category"),
        supabase.from("vendors").select("*").order("name"),
        supabase.from("checklist_items").select("*").order("id"),
        supabase.from("timeline_milestones").select("*").order("id"),
        supabase.from("wedding_settings").select("*").eq("id", "primary").maybeSingle(),
      ]);

    return {
      guests: guestsRes.data ? (guestsRes.data as Record<string, unknown>[]).map(mapGuestFromDb) : null,
      budget: budgetRes.data ? (budgetRes.data as Record<string, unknown>[]).map(mapBudgetItemFromDb) : null,
      vendors: vendorsRes.data ? (vendorsRes.data as Record<string, unknown>[]).map(mapVendorFromDb) : null,
      checklist: checklistRes.data ? (checklistRes.data as Record<string, unknown>[]).map(mapChecklistItemFromDb) : null,
      timeline: timelineRes.data ? (timelineRes.data as Record<string, unknown>[]).map(mapTimelineFromDb) : null,
      settings: settingsRes.data ? mapSettingsFromDb(settingsRes.data as Record<string, unknown>) : null,
    };
  } catch (error) {
    console.error("Error fetching cloud wedding data:", error);
    return null;
  }
}

export async function cloudSaveGuest(guest: Guest) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("guests").upsert(mapGuestToDb(guest));
}

export async function cloudDeleteGuest(id: string) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("guests").delete().eq("id", id);
}

export async function cloudSaveBudgetItem(item: BudgetItem) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("budget_items").upsert(mapBudgetItemToDb(item));
}

export async function cloudDeleteBudgetItem(id: string) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("budget_items").delete().eq("id", id);
}

export async function cloudSaveVendor(vendor: Vendor) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("vendors").upsert(mapVendorToDb(vendor));
}

export async function cloudDeleteVendor(id: string) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("vendors").delete().eq("id", id);
}

export async function cloudSaveChecklistItem(item: MasterChecklistItem) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("checklist_items").upsert(mapChecklistItemToDb(item));
}

export async function cloudDeleteChecklistItem(id: string) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("checklist_items").delete().eq("id", id);
}

export async function cloudSaveTimelineItem(item: TimelineMilestone) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("timeline_milestones").upsert(mapTimelineToDb(item));
}

export async function cloudDeleteTimelineItem(id: string) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("timeline_milestones").delete().eq("id", id);
}

export async function cloudSaveSettings(settings: WeddingSettings) {
  if (!supabase || !isSupabaseConfigured()) return;
  await supabase.from("wedding_settings").upsert(mapSettingsToDb(settings));
}

export async function cloudClearAllData(): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    await Promise.all([
      supabase.from("guests").delete().neq("id", "___never___"),
      supabase.from("budget_items").delete().neq("id", "___never___"),
      supabase.from("vendors").delete().neq("id", "___never___"),
      supabase.from("checklist_items").delete().neq("id", "___never___"),
      supabase.from("timeline_milestones").delete().neq("id", "___never___"),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to clear cloud data:", error);
    return false;
  }
}

export async function cloudSeedDemoData(demoData: WeddingData): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    await cloudClearAllData();
    await Promise.all([
      supabase.from("guests").upsert(demoData.guests.map(mapGuestToDb)),
      supabase.from("budget_items").upsert(demoData.budgetItems.map(mapBudgetItemToDb)),
      supabase.from("vendors").upsert(demoData.vendors.map(mapVendorToDb)),
      supabase.from("checklist_items").upsert(demoData.checklist.map(mapChecklistItemToDb)),
      supabase.from("timeline_milestones").upsert(demoData.timeline.map(mapTimelineToDb)),
      supabase.from("wedding_settings").upsert(mapSettingsToDb(demoData.settings)),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to seed demo data to cloud:", error);
    return false;
  }
}

// ==========================================
// SUPABASE REALTIME SUBSCRIPTION
// ==========================================

export function subscribeToWeddingRealtime(
  onTableChange: (
    table: string,
    eventType: string,
    newRow: Record<string, unknown>,
    oldRow: Record<string, unknown>
  ) => void
): RealtimeChannel | null {
  if (!supabase || !isSupabaseConfigured()) return null;

  const channel = supabase
    .channel("wedding-cloud-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public" },
      (payload) => {
        onTableChange(
          payload.table,
          payload.eventType,
          (payload.new || {}) as Record<string, unknown>,
          (payload.old || {}) as Record<string, unknown>
        );
      }
    )
    .subscribe();

  return channel;
}

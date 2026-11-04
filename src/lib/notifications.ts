import { eventsDatabase } from "../data/weddingEvents";
import { formatRupiah } from "./selectors";
import type { WeddingData } from "./weddingStorage";

export type NotificationTone = "urgent" | "warning" | "info";

export interface WeddingNotification {
  id: string;
  title: string;
  description: string;
  tone: NotificationTone;
  view: string;
}

const TONE_ORDER: Record<NotificationTone, number> = {
  urgent: 0,
  warning: 1,
  info: 2,
};

export function buildNotifications(
  data: WeddingData,
  limit = 8,
): WeddingNotification[] {
  const notifications: WeddingNotification[] = [];
  for (const item of data.budgetItems) {
    if (item.paymentStatus === "lunas") continue;

    const remaining = Math.max(0, item.estimatedBudget - item.actualPaid);
    notifications.push({
      id: `budget:${item.id}`,
      title:
        item.paymentStatus === "belum_bayar"
          ? "Pelunasan belum dibayar"
          : "Pelunasan tertunda",
      description: `${item.title} • sisa ${formatRupiah(remaining)}`,
      tone: item.paymentStatus === "belum_bayar" ? "urgent" : "warning",
      view: "budget",
    });
  }

  for (const guest of data.guests) {
    if (guest.rsvpStatus !== "menunggu") continue;

    notifications.push({
      id: `guest:${guest.id}`,
      title: "RSVP menunggu konfirmasi",
      description: `${guest.name} • ${guest.invitationCount} pax`,
      tone: "warning",
      view: "guests",
    });
  }

  for (const [eventId, tasks] of Object.entries(data.eventTasks)) {
    const eventTitle = eventsDatabase[eventId]?.title ?? eventId;

    for (const task of tasks) {
      if (task.completed || task.priority !== "high") continue;

      notifications.push({
        id: `task:${eventId}:${task.id}`,
        title: "To-do prioritas tinggi",
        description: `${task.title} • ${eventTitle}`,
        tone: "warning",
        view: eventId,
      });
    }
  }

  for (const item of data.checklist) {
    if (item.completed || item.priority !== "high") continue;

    notifications.push({
      id: `checklist:${item.id}`,
      title: "Checklist prioritas tinggi",
      description: `${item.title} • ${item.pillar}`,
      tone: "warning",
      view: "checklist",
    });
  }

  for (const item of data.timeline) {
    if (item.status !== "in_progress") continue;

    notifications.push({
      id: `timeline:${item.id}`,
      title: "Sedang berjalan",
      description: `${item.title} • ${item.dateFormatted}`,
      tone: "info",
      view: "rundown",
    });
  }

  return notifications
    .sort((a, b) => TONE_ORDER[a.tone] - TONE_ORDER[b.tone])
    .slice(0, limit);
}

export function filterUnreadNotifications(
  notifications: WeddingNotification[],
  readIds: string[],
): WeddingNotification[] {
  const read = new Set(readIds);
  return notifications.filter((notification) => !read.has(notification.id));
}

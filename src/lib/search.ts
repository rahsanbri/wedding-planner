import { eventsDatabase } from "../data/weddingEvents";
import type { WeddingData } from "./weddingStorage";

export type SearchResultKind =
  | "event"
  | "budget"
  | "guest"
  | "vendor"
  | "checklist"
  | "timeline";

export interface SearchResult {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle: string;
  view: string;
}

function matches(haystack: string, tokens: string[]): boolean {
  const text = haystack.toLowerCase();
  return tokens.every((token) => text.includes(token));
}

export function searchWeddingData(
  data: WeddingData,
  query: string,
  limit = 20,
): SearchResult[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];
  const seen = new Set<string>();

  const push = (result: SearchResult, haystack: string) => {
    if (!matches(haystack, tokens)) return;
    if (seen.has(result.id)) return;
    seen.add(result.id);
    results.push(result);
  };

  for (const [eventId, tasks] of Object.entries(data.eventTasks)) {
    const eventTitle = eventsDatabase[eventId]?.title ?? eventId;
    for (const task of tasks) {
      push(
        {
          id: `event:${eventId}:${task.id}`,
          kind: "event",
          title: task.title,
          subtitle: `${eventTitle} • ${task.category}`,
          view: eventId,
        },
        `${task.title} ${task.category} ${task.pic} ${task.notes ?? ""} ${eventTitle}`,
      );
    }
  }

  for (const item of data.budgetItems) {
    push(
      {
        id: `budget:${item.id}`,
        kind: "budget",
        title: item.title,
        subtitle: `${item.category} • ${item.vendorName}`,
        view: "budget",
      },
      `${item.title} ${item.category} ${item.vendorName} ${item.notes ?? ""}`,
    );
  }

  for (const guest of data.guests) {
    push(
      {
        id: `guest:${guest.id}`,
        kind: "guest",
        title: guest.name,
        subtitle: `${guest.category} • ${guest.tableNumber} • ${guest.rsvpStatus}`,
        view: "guests",
      },
      `${guest.name} ${guest.category} ${guest.tableNumber} ${guest.phone ?? ""} ${guest.notes ?? ""}`,
    );
  }

  for (const vendor of data.vendors) {
    push(
      {
        id: `vendor:${vendor.id}`,
        kind: "vendor",
        title: vendor.name,
        subtitle: `${vendor.category} • ${vendor.contactPerson}`,
        view: "vendors",
      },
      `${vendor.name} ${vendor.category} ${vendor.contactPerson} ${vendor.phone} ${vendor.email}`,
    );
  }

  for (const item of data.checklist) {
    push(
      {
        id: `checklist:${item.id}`,
        kind: "checklist",
        title: item.title,
        subtitle: `${item.phase} • ${item.pillar}`,
        view: "checklist",
      },
      `${item.title} ${item.phase} ${item.pillar} ${item.pic}`,
    );
  }

  for (const item of data.timeline) {
    push(
      {
        id: `timeline:${item.id}`,
        kind: "timeline",
        title: item.title,
        subtitle: `${item.dateFormatted} • ${item.pillar}`,
        view: "rundown",
      },
      `${item.title} ${item.description} ${item.location} ${item.pic} ${item.phaseName}`,
    );
  }

  return results.slice(0, limit);
}

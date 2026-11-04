import React from "react";
import { 
  X, 
  Clock, 
  CheckCircle2, 
  FileText,
  ChevronRight
} from "lucide-react";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import { eventProgress } from "@/lib/selectors";

interface DetailDrawerProps {
  eventId: string | null;
  onClose: () => void;
  onOpenEvent?: (eventId: string) => void;
}

const eventDetailsMap: Record<string, {
  title: string;
  category: string;
  progress: number;
  date: string;
  note: string;
  items: string[];
}> = {
  gereja: {
    title: "Gereja (Pemberkatan / Nikah)",
    category: "Administrasi & Sakramen",
    progress: 35,
    date: "Minggu, 16 Mei 2027 • 09.00 WIB • Gereja Katedral",
    note: "Penyelidikan kanonik & kursus persiapan perkawinan dijadwalkan",
    items: [
      "Penyelidikan Kanonik dengan Pastor Paroki",
      "Sertifikat Kursus Persiapan Perkawinan (KPP)",
      "Buku Panduan Misa / Liturgi & Paduan Suara",
      "Pencatatan Sipil & Saksi Nikah Resmi"
    ],
  },
  prewedding: {
    title: "Pre-Wedding",
    category: "Konsep & Dokumentasi Visual",
    progress: 75,
    date: "Sesi Outdoor Bromo & Studio Kencana",
    note: "Moodboard kostum & jadwal fotografer sudah final",
    items: [
      "Fitting Gaun Bridal & Jas Groom",
      "Pengambilan Foto Outdoor Sunrise",
      "Pemilihan 30 Foto Master Retouch",
      "Cetak Canvas Display 60x90cm untuk Resepsi"
    ],
  },
  midodareni: {
    title: "Midodareni",
    category: "Malam Adat Jawa Sebelum Hari H",
    progress: 25,
    date: "Sabtu, 15 Mei 2027 • H-1 Malam • Kediaman Mempelai Wanita",
    note: "Penyusunan sesaji kembar mayang & serah-serahan keluarga",
    items: [
      "Persiapan Kembar Mayang & Tirto Wening",
      "Katering Tradisional & Tumpeng Robyong",
      "Busana Adat Beskap & Kebaya Jumputan",
      "Pranata Cara (MC Adat Jawa) & Gamelan"
    ],
  },
  resepsi: {
    title: "Resepsi Pernikahan",
    category: "Vendor & Operasional Hari H",
    progress: 50,
    date: "Minggu, 16 Mei 2027 • 19.00 WIB • Grand Ballroom Hotel Mulia",
    note: "Pelunasan tahap 2 & konfirmasi 450 undangan",
    items: [
      "Layout Dekorasi & Lighting Pelaminan",
      "Konfirmasi Menu Buffet & Stall Katering",
      "Briefing 14 Vendor & Tim Wedding Organizer",
      "Rundown Gladi Resik Jam 16.00 WIB"
    ],
  },
};

export function DetailDrawer({ eventId, onClose, onOpenEvent }: DetailDrawerProps) {
  const { data } = useWeddingData();

  if (!eventId) return null;

  const baseEvent = eventDetailsMap[eventId] || {
    title: "Modul Rincian",
    category: "Master Project",
    progress: 50,
    date: "16 Mei 2027",
    note: "Informasi detail modul perencanaan.",
    items: ["Task A selesai", "Task B in progress", "Task C dijadwalkan"]
  };

  const meta = data.eventMetas?.[eventId];
  const event = {
    ...baseEvent,
    title: meta?.title || baseEvent.title,
    date: meta ? `${meta.targetDate} • ${meta.time} • ${meta.location}` : baseEvent.date,
    note: meta?.description || baseEvent.note,
  };

  const eventTasks = data.eventTasks[eventId] ?? [];
  const progress = eventTasks.length > 0 ? eventProgress(eventTasks) : event.progress;
  const items =
    eventTasks.length > 0
      ? eventTasks.slice(0, 4).map((task) => task.title)
      : event.items;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#3a281c]/30 backdrop-blur-xs z-50 transition-opacity print:hidden"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#fdfaf7] border-l border-[#ede4d8] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 print:hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ede4d8] flex items-center justify-between bg-[#f8f3ec]">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#c98858]">
              {event.category}
            </span>
            <h3 className="text-base font-serif font-bold text-[#3a281c]">
              {event.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup detail"
            className="p-2 rounded-full bg-[#ffffff] text-[#7a6452] hover:text-[#3a281c] border border-[#ede4d8] shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-xs">
          {/* Progress Card */}
          <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#f0e6d8] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#7a6452] font-medium">Tingkat Kesiapan</span>
              <span className="text-base font-serif font-bold text-[#c98858]">{progress}%</span>
            </div>
            <div className="w-full bg-[#f1e7da] rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-[#c98858] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-[#6f5a49] mt-2">
              Catatan: <strong className="text-[#3a281c]">{event.note}</strong>
            </p>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6f5a49]">
              Jadwal & Agenda
            </h4>
            <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#f0e6d8] space-y-2">
              <div className="flex items-center gap-2 text-[#4a382c]">
                <Clock className="w-3.5 h-3.5 text-[#c98858]" />
                <span className="font-medium">{event.date}</span>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6f5a49]">
              Milestones Terjadwal
            </h4>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-[#ffffff] border border-[#f0e6d8] flex items-center justify-between text-xs hover:border-[#dfc8b4] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#789d6e]" />
                    <span className="text-[#3a281c] font-medium">{item}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#bfaea0]" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => {
              if (eventId && onOpenEvent) onOpenEvent(eventId);
            }}
            className="w-full py-3 rounded-xl bg-[#c98858] text-[#ffffff] font-semibold text-xs shadow-md shadow-[#c98858]/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Buka Detail Lengkap</span>
          </button>
        </div>
      </div>
    </>
  );
}

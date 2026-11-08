"use client";

import React, { useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Church,
  Clock,
  Cloud,
  Database,
  Download,
  Flower2,
  Heart,
  Key,
  MapPin,
  Phone,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldCheck,
  Target,
  Trash2,
  Upload,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import {
  budgetSummary,
  checklistSummary,
  formatRupiah,
  formatWeddingDate,
  guestSummary,
} from "@/lib/selectors";
import { defaultEventMetas, weddingSettings } from "@/lib/weddingStorage";
import type { EventMeta } from "@/lib/weddingStorage";
import { downloadFile } from "@/lib/download";
import { parseImportedWeddingData } from "@/lib/import";
import { cn } from "@/lib/utils";

interface SettingsPageProps {
  onBack: () => void;
}

interface EventMetaEditorProps {
  eventId: string;
  initialMeta: EventMeta;
  onSave: (eventId: string, meta: EventMeta) => void;
  selectedEventId: string;
  onSelectEventId: (id: string) => void;
}

function EventMetaEditor({
  eventId,
  initialMeta,
  onSave,
  selectedEventId,
  onSelectEventId,
}: EventMetaEditorProps) {
  const [form, setForm] = useState<EventMeta>(initialMeta);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(eventId, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <form onSubmit={handleSubmit} className="soft-card p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div className="border-b border-[#f0e6d8] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-serif font-bold text-[#3a281c]">
            Pengaturan 4 Rangkaian Acara Utama
          </h2>
          <p className="text-xs text-[#6f5a49] mt-0.5">
            Sesuaikan judul, PIC, lokasi, tanggal, dan waktu untuk 4 rangkaian acara inti.
          </p>
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f8f3ec] border border-[#ede4d8] overflow-x-auto custom-scrollbar">
          {[
            { id: "gereja", label: "Gereja", icon: Church },
            { id: "prewedding", label: "Pre-Wed", icon: Camera },
            { id: "midodareni", label: "Midodareni", icon: Flower2 },
            { id: "resepsi", label: "Resepsi", icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedEventId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectEventId(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                  isSelected
                    ? "bg-[#c98858] text-[#ffffff] shadow-2xs font-bold"
                    : "text-[#6f5a49] hover:bg-[#ede4d8] hover:text-[#3a281c]"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        <div className="space-y-1.5">
          <label className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f5a49]">
            Judul Acara
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="Contoh: Gereja (Pemberkatan / Nikah)"
            className="w-full px-3.5 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#c98858]" />
            Tanggal Pelaksanaan
          </label>
          <input
            type="text"
            value={form.targetDate}
            onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
            required
            placeholder="Contoh: Minggu, 16 Mei 2027"
            className="w-full px-3.5 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#c98858]" />
            Waktu / Jam Acara
          </label>
          <input
            type="text"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
            placeholder="Contoh: 09.00 WIB"
            className="w-full px-3.5 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#c98858]" />
            Lokasi / Tempat
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
            placeholder="Contoh: Gereja Katedral Jakarta"
            className="w-full px-3.5 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center gap-1">
            <User className="w-3 h-3 text-[#c98858]" />
            Nama PIC / Penanggung Jawab
          </label>
          <input
            type="text"
            value={form.picName}
            onChange={(e) => setForm({ ...form, picName: e.target.value })}
            required
            placeholder="Contoh: Romo Paroki & Keluarga"
            className="w-full px-3.5 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#c98858]" />
            No. Kontak / WhatsApp PIC
          </label>
          <input
            type="text"
            value={form.picPhone}
            onChange={(e) => setForm({ ...form, picPhone: e.target.value })}
            placeholder="Contoh: +62 812-3456-7890"
            className="w-full px-3.5 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6f5a49]">
            Deskripsi & Catatan Singkat
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            placeholder="Deskripsi ringkas rangkaian acara..."
            className="w-full px-3.5 py-2 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-[10.5px] text-[#6f5a49]">
          Perubahan langsung tersimpan dan tampil di kartu dashboard & halaman detail.
        </p>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-[11px] font-semibold text-[#789d6e] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Detail Acara Tersimpan
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c98858] text-[#ffffff] text-xs font-semibold hover:brightness-105 shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Detail Acara
          </button>
        </div>
      </div>
    </form>
  );
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const {
    data,
    setSettings,
    replaceData,
    resetData,
    isCloudConnected,
    cloudSyncStatus,
    syncWithCloud,
    updateEventMeta,
  } = useWeddingData();
  const [syncingManual, setSyncingManual] = useState(false);
  const [targetDateInput, setTargetDateInput] = useState(
    data.settings.targetDate.slice(0, 10),
  );
  const [guestTargetInput, setGuestTargetInput] = useState(
    String(data.settings.guestTarget),
  );
  const [accessKeyInput, setAccessKeyInput] = useState(
    data.settings.accessKey || "AM2027",
  );
  const [saved, setSaved] = useState(false);

  // 4 Main Events Form State
  const [selectedMetaEventId, setSelectedMetaEventId] = useState<string>("gereja");
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const budget = budgetSummary(data.budgetItems);
  const guests = guestSummary(data.guests);
  const checklist = checklistSummary(data.checklist);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const guestTarget = Number(guestTargetInput);
    if (
      !targetDateInput ||
      !Number.isFinite(guestTarget) ||
      guestTarget <= 0
    ) {
      return;
    }

    const targetDate = `${targetDateInput}T00:00:00+07:00`;
    setSettings({
      targetDate,
      targetDateLabel: formatWeddingDate(targetDate),
      guestTarget: Math.round(guestTarget),
      accessKey: accessKeyInput.trim() || "AM2027",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleExport = () => {
    downloadFile(
      "wedding-planner-backup.json",
      JSON.stringify(data, null, 2),
      "application/json",
    );
  };

  const [resetting, setResetting] = useState(false);

  const handleClearData = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin MENGOSONGKAN semua data (daftar tamu, pos anggaran, vendor, dan checklist) baik di perangkat ini maupun di database Supabase Cloud?\n\nDashboard akan bersih dari data dummy dan siap diisi data asli pernikahan Anda.",
      )
    ) {
      return;
    }

    try {
      setResetting(true);
      await resetData("empty");
      setTargetDateInput(weddingSettings.targetDate.slice(0, 10));
      setGuestTargetInput(String(weddingSettings.guestTarget));
      setAccessKeyInput(weddingSettings.accessKey || "AM2027");
      setSaved(false);
      setImportStatus({
        type: "success",
        message:
          "Semua data dummy berhasil dikosongkan! Dashboard kini bersih dan siap diisi data asli pernikahan Anda.",
      });
    } catch (e) {
      console.error(e);
      setImportStatus({
        type: "error",
        message: "Gagal mengosongkan data. Silakan coba kembali.",
      });
    } finally {
      setResetting(false);
    }
  };

  const handleSeedDemoData = async () => {
    if (
      !confirm(
        "Muat ulang data contoh (template dummy)? Data yang ada saat ini akan diganti dengan contoh data demo.",
      )
    ) {
      return;
    }

    try {
      setResetting(true);
      await resetData("demo");
      setTargetDateInput(weddingSettings.targetDate.slice(0, 10));
      setGuestTargetInput(String(weddingSettings.guestTarget));
      setAccessKeyInput(weddingSettings.accessKey || "AM2027");
      setSaved(false);
      setImportStatus({
        type: "success",
        message:
          "Data contoh (template demo) berhasil dimuat kembali ke browser dan Supabase.",
      });
    } catch (e) {
      console.error(e);
      setImportStatus({
        type: "error",
        message: "Gagal memuat data contoh. Silakan coba kembali.",
      });
    } finally {
      setResetting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    let raw: string;
    try {
      raw = await file.text();
    } catch {
      setImportStatus({ type: "error", message: "Gagal membaca file." });
      return;
    }

    const result = parseImportedWeddingData(raw);

    if ("error" in result) {
      setImportStatus({ type: "error", message: result.error });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (
      !confirm(
        "Impor data ini? Data yang tersimpan saat ini akan diganti dengan isi file.",
      )
    ) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    replaceData(result.data);
    setTargetDateInput(result.data.settings.targetDate.slice(0, 10));
    setGuestTargetInput(String(result.data.settings.guestTarget));
    setAccessKeyInput(result.data.settings.accessKey || "AM2027");
    setImportStatus({
      type: "success",
      message: `Data berhasil diimpor: ${result.data.guests.length} tamu, ${result.data.budgetItems.length} pos anggaran, ${result.data.timeline.length} agenda.`,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3.5 sm:space-y-6 pb-8 sm:pb-12 w-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#ede4d8] gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#805030] hover:text-[#3a281c] bg-[#ffffff] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-[#ede4d8] shadow-2xs hover:bg-[#faf5ef] transition-colors w-fit cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Kembali</span>
          <span className="hidden sm:inline">ke Dashboard</span>
        </button>

        <span className="text-[11px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#f3e7dc] text-[#78614f] font-semibold border border-[#ede1d5] shrink-0">
          Pengaturan
        </span>
      </div>

      <div className="soft-card p-3.5 sm:p-6 md:p-8 bg-gradient-to-r from-[#faece1] via-[#f8e4d6] to-[#f4dccb] border border-[#ecd5c3]">
        <div className="max-w-2xl space-y-1 sm:space-y-2">
          <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#7a4825]">
            Preferensi Utama
          </span>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-[#3a281c]">
            Target & Data Pernikahan
          </h1>
          <p className="text-[11px] sm:text-sm text-[#7a6452] leading-relaxed hidden sm:block">
            Tanggal Hari H dan target tamu dipakai di seluruh dashboard. Sinkron otomatis ke multi-perangkat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="soft-card p-2.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[9px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">
              Anggaran
            </span>
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c98858] shrink-0" />
          </div>
          <p className="text-sm sm:text-xl font-serif font-bold text-[#3a281c] truncate">
            {formatRupiah(budget.totalEstimated)}
          </p>
          <p className="text-[9px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">
            {budget.percentPaid}% terbayar
          </p>
        </div>

        <div className="soft-card p-2.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[9px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">
              Target Tamu
            </span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#789d6e] shrink-0" />
          </div>
          <p className="text-sm sm:text-xl font-serif font-bold text-[#3a281c] truncate">
            {guests.confirmed} / {data.settings.guestTarget}
          </p>
          <p className="text-[9px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">
            {guests.totalInvitations} pax
          </p>
        </div>

        <div className="soft-card p-2.5 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[9px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#6f5a49] truncate">
              Kesiapan
            </span>
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#b57a41] shrink-0" />
          </div>
          <p className="text-sm sm:text-xl font-serif font-bold text-[#3a281c] truncate">
            {checklist.percent}%
          </p>
          <p className="text-[9px] sm:text-[11px] text-[#6f5a49] mt-0.5 sm:mt-1 truncate">
            {checklist.completed}/{checklist.total} selesai
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="soft-card p-6 space-y-5">
        <div className="border-b border-[#f0e6d8] pb-3">
          <h2 className="text-base font-serif font-bold text-[#3a281c]">
            Target Utama
          </h2>
          <p className="text-xs text-[#6f5a49] mt-0.5">
            Perubahan langsung memengaruhi countdown dan kartu target tamu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="target-date"
              className="text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#c98858]" />
              Tanggal Hari H
            </label>
            <input
              id="target-date"
              type="date"
              value={targetDateInput}
              onChange={(event) => setTargetDateInput(event.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
            />
            <p className="text-[10.5px] text-[#6f5a49]">
              Saat ini: {formatWeddingDate(data.settings.targetDate)}
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="guest-target"
              className="text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5 text-[#c98858]" />
              Target Tamu (pax)
            </label>
            <input
              id="guest-target"
              type="number"
              min={1}
              value={guestTargetInput}
              onChange={(event) => setGuestTargetInput(event.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
            />
            <p className="text-[10.5px] text-[#6f5a49]">
              Dipakai di hero banner dan status tamu.
            </p>
          </div>

          <div className="space-y-1.5 md:col-span-2 pt-2 border-t border-[#f0e6d8]">
            <label
              htmlFor="access-key"
              className="text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-[#c98858]" />
              Kode Akses Bersama (Wedding Passcode / PIN Key)
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
              <input
                id="access-key"
                type="text"
                value={accessKeyInput}
                onChange={(event) => setAccessKeyInput(event.target.value.toUpperCase())}
                required
                placeholder="Contoh: AM2027"
                className="w-full sm:max-w-xs px-3.5 py-2.5 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs font-mono font-bold tracking-wider text-[#3a281c] focus:outline-hidden focus:border-[#c98858]"
              />
              <span className="text-[11px] text-[#6f5a49]">
                Dibagikan ke Mempelai, Keluarga, & Tim WO untuk mengakses data yang sama.
              </span>
            </div>
            <p className="text-[10px] sm:text-[10.5px] text-[#8c7a6d]">
              Format fleksibel & otomatis dinormalisasi (contoh: <code className="bg-[#f0e6d8] px-1 py-0.5 rounded text-[#3a281c]">am2027</code>, <code className="bg-[#f0e6d8] px-1 py-0.5 rounded text-[#3a281c]">AM2027</code>, atau <code className="bg-[#f0e6d8] px-1 py-0.5 rounded text-[#3a281c]">A&M2027</code>).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-[10.5px] text-[#6f5a49] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#789d6e]" />
            Tersimpan otomatis di localStorage browser ini
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-[11px] font-semibold text-[#789d6e] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Tersimpan
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c98858] text-[#ffffff] text-xs font-semibold hover:brightness-105 shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </form>

      {/* Pengaturan 4 Rangkaian Acara Utama */}
      <EventMetaEditor
        key={selectedMetaEventId}
        eventId={selectedMetaEventId}
        initialMeta={
          (data.eventMetas && data.eventMetas[selectedMetaEventId]) ||
          defaultEventMetas[selectedMetaEventId]
        }
        onSave={updateEventMeta}
        selectedEventId={selectedMetaEventId}
        onSelectEventId={setSelectedMetaEventId}
      />

      {/* Supabase Cloud & Realtime Sync */}
      <div className="soft-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0e6d8] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-serif font-bold text-[#3a281c]">
                Supabase & Sinkronisasi Cloud Real-Time
              </h2>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  isCloudConnected
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {isCloudConnected ? "Terkoneksi Real-Time" : "Mode Penyimpanan Lokal"}
              </span>
            </div>
            <p className="text-xs text-[#6f5a49] mt-0.5">
              Sinkronisasi instan multi-device: perubahan di HP pasangan, keluarga, dan tim WO langsung terbarui otomatis.
            </p>
          </div>

          {isCloudConnected && (
            <button
              type="button"
              disabled={syncingManual || cloudSyncStatus === "syncing"}
              onClick={async () => {
                setSyncingManual(true);
                await syncWithCloud();
                setTimeout(() => setSyncingManual(false), 600);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#faece0] text-[#b57a41] border border-[#ede4d8] hover:bg-[#f3dfcf] text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors shrink-0"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  syncingManual || cloudSyncStatus === "syncing" ? "animate-spin" : ""
                }`}
              />
              <span>Sinkronkan Sekarang</span>
            </button>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-[#fdfaf7] border border-[#ede4d8] text-xs space-y-2.5">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#faece0] text-[#b57a41] flex items-center justify-center shrink-0 mt-0.5">
              <Cloud className="w-4 h-4" />
            </span>
            <div className="space-y-1">
              <p className="font-semibold text-[#3a281c]">
                {isCloudConnected
                  ? "Database Supabase Aktif & Sinkron"
                  : "Cara Menghubungkan ke Supabase (Untuk Akses Bersama di HP/Tablet)"}
              </p>
              <p className="text-[#6f5a49] text-[11px] leading-relaxed">
                {isCloudConnected
                  ? "Aplikasi terkoneksi dengan database Supabase. Setiap tamu yang check-in, perubahan anggaran, atau checklist selesai akan tersinkronisasi langsung ke semua HP/tablet yang membuka website."
                  : "Buat project gratis di Supabase, jalankan file SQL di supabase/schema.sql, lalu tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di environment Vercel Anda."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="soft-card p-6 space-y-4">
        <div className="border-b border-[#f0e6d8] pb-3">
          <h2 className="text-base font-serif font-bold text-[#3a281c]">
            Manajemen Data
          </h2>
          <p className="text-xs text-[#6f5a49] mt-0.5">
            Unduh cadangan JSON atau kembalikan seluruh data ke contoh awal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#fdfaf7] border border-[#ede4d8] hover:border-[#dfc8b4] transition-colors text-left cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-[#faece0] text-[#b57a41] flex items-center justify-center shrink-0">
                <Download className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-xs font-bold text-[#3a281c]">
                  Export Data JSON
                </span>
                <span className="block text-[10.5px] text-[#6f5a49] mt-0.5">
                  Cadangkan semua modul
                </span>
              </span>
            </span>
            <Database className="w-4 h-4 text-[#bdafa2]" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
            aria-label="Pilih file backup JSON"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#fdfaf7] border border-[#ede4d8] hover:border-[#dfc8b4] transition-colors text-left cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-[#f3e7dc] text-[#805030] flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-xs font-bold text-[#3a281c]">
                  Import Data JSON
                </span>
                <span className="block text-[10.5px] text-[#6f5a49] mt-0.5">
                  Pulihkan dari backup
                </span>
              </span>
            </span>
            <Upload className="w-4 h-4 text-[#bdafa2]" />
          </button>

          <button
            type="button"
            disabled={resetting}
            onClick={handleClearData}
            className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 hover:border-amber-300 transition-colors text-left cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-xs font-bold text-amber-900">
                  {resetting ? "Mengosongkan..." : "Kosongkan Data Dummy"}
                </span>
                <span className="block text-[10.5px] text-amber-700/80 mt-0.5">
                  Mulai bersih dari nol (0 data)
                </span>
              </span>
            </span>
            <Trash2 className="w-4 h-4 text-amber-400" />
          </button>

          <button
            type="button"
            disabled={resetting}
            onClick={handleSeedDemoData}
            className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#fdfaf7] border border-[#ede4d8] hover:border-[#dfc8b4] transition-colors text-left cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-[#f0e4d7] text-[#805030] flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </span>
              <span>
                <span className="block text-xs font-bold text-[#3a281c]">
                  Isi Data Contoh (Demo)
                </span>
                <span className="block text-[10.5px] text-[#6f5a49] mt-0.5">
                  Muat template referensi awal
                </span>
              </span>
            </span>
            <RotateCcw className="w-4 h-4 text-[#bdafa2]" />
          </button>
        </div>

        {importStatus && (
          <div
            className={
              importStatus.type === "success"
                ? "flex items-start gap-2 p-3 rounded-xl bg-green-50 border border-green-100 text-[11px] text-green-800"
                : "flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-[11px] text-red-800"
            }
          >
            {importStatus.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-[#fbf7f2] border border-[#f0e6d8] text-[10.5px] text-[#6f5a49] leading-relaxed">
          Data disimpan di browser ini dengan kunci{" "}
          <code className="font-mono text-[#805030]">
            wedding-planner-data-v1
          </code>
          . Menghapus data situs di browser juga akan menghapus perubahan.
        </div>
      </div>
    </div>
  );
}

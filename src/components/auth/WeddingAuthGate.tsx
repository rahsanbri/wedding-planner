"use client";

import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, Sparkles, User, Users, ShieldCheck } from "lucide-react";
import { validatePasscode } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface WeddingAuthGateProps {
  masterKey?: string;
  onLogin: (user: AuthUser) => void;
}

const roleOptions = [
  { id: "Mempelai", label: "Mempelai", icon: "💍" },
  { id: "Keluarga", label: "Keluarga", icon: "👨‍👩‍👧" },
  { id: "Wedding Organizer", label: "Tim WO", icon: "📋" },
  { id: "Panitia", label: "Panitia", icon: "🤝" },
];

export function WeddingAuthGate({ masterKey = "AM2027", onLogin }: WeddingAuthGateProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Mempelai");
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Silakan masukkan nama atau panggilan Anda.");
      return;
    }

    if (!validatePasscode(passcode, masterKey)) {
      setError("Kode akses tidak sesuai. Silakan masukkan kode akses yang diberikan oleh kedua mempelai.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: trimmedName,
        role,
        loggedInAt: Date.now(),
      });
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#fbf7f2] via-[#f7e6d7] to-[#edd3be] relative overflow-hidden select-none">
      {/* Decorative Floral Background Watermark */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-full sm:w-2/3 bg-cover bg-right bg-no-repeat opacity-15 pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url('/hero-floral-right.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#fbf7f2]/90 via-[#fbf7f2]/50 to-transparent pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-md relative z-10 bg-[#ffffff]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#eed7c4] shadow-xl animate-in fade-in zoom-in-95 duration-300">
        {/* Header Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-11 mx-auto flex items-center justify-center text-[#c98858]">
            <svg width="48" height="34" viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="21" cy="22" r="14" stroke="#c98858" strokeWidth="2.75" />
              <circle cx="34" cy="18" r="14" stroke="#c98858" strokeWidth="2.75" />
              <path d="M21 7L24 10L21 13L18 10L21 7Z" fill="#c98858" />
            </svg>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6e5d5] text-[#84502d] text-xs font-semibold border border-[#e5cbb3]">
            <Sparkles className="w-3.5 h-3.5 text-[#c98858]" />
            <span>Hari Bahagia A&M</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3a281c] tracking-tight">
            Our Wedding
          </h1>
          <p className="text-xs text-[#7a6452] leading-relaxed max-w-xs mx-auto">
            Portal Kolaborasi Pengantin, Keluarga & Tim Wedding Organizer
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#c98858]" />
              Nama Anda / Panggilan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Maria / Radit / Devi (WO) / Bp. Suryo"
              required
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858] transition-colors"
            />
          </div>

          {/* Role Selector Pills */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#c98858]" />
              Peran Anda
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {roleOptions.map((opt) => {
                const isSelected = role === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRole(opt.id)}
                    className={cn(
                      "flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer",
                      isSelected
                        ? "bg-[#3a281c] text-[#ffffff] border-[#3a281c] shadow-xs"
                        : "bg-[#fbf7f2] text-[#6f5a49] border-[#ede4d8] hover:bg-[#f6ecdf]"
                    )}
                  >
                    <span>{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Passcode Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6f5a49] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#c98858]" />
                Kode Akses Pernikahan
              </span>
              <span className="text-[10px] lowercase text-[#995c32] font-medium tracking-normal">
                (Kunci Rahasia A&M)
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan kode akses (cth: AM2027)"
                required
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#fbf7f2] border border-[#ede4d8] text-xs text-[#3a281c] focus:outline-hidden focus:border-[#c98858] font-mono tracking-wider transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#998372] hover:text-[#3a281c] cursor-pointer"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#c98858] to-[#b37042] text-[#ffffff] text-xs font-bold tracking-wide hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? "Membuka Dashboard..." : "Masuk ke Dashboard Hari Bahagia"}</span>
          </button>
        </form>

        {/* Footer Security Badge */}
        <div className="mt-6 pt-4 border-t border-[#ede4d8] flex items-center justify-center gap-1.5 text-[10.5px] text-[#7a6452]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
          <span>Sesi tersimpan di perangkat ini & terkoneksi cloud Supabase</span>
        </div>
      </div>
    </div>
  );
}

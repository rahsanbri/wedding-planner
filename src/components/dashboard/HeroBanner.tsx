import React, { useEffect, useState } from "react";
import { Calendar, Users, Wallet } from "lucide-react";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import {
  budgetSummary,
  countdownDays,
  formatRupiah,
  guestSummary,
} from "@/lib/selectors";

interface HeroBannerProps {
  onViewGuestDetail?: () => void;
}

export function HeroBanner({ onViewGuestDetail }: HeroBannerProps) {
  const { data } = useWeddingData();
  const targetDate = data.settings.targetDate;
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDaysLeft(countdownDays(targetDate, new Date()));
    }, 0);
    return () => clearTimeout(timer);
  }, [targetDate]);

  const budget = budgetSummary(data.budgetItems);
  const guests = guestSummary(data.guests);

  return (
    <div className="relative rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 lg:p-9 xl:p-10 lg:min-h-[210px] xl:min-h-[235px] flex flex-col justify-center overflow-hidden bg-gradient-to-r from-[#faece1] via-[#f8e4d6] to-[#f4dccb] border border-[#ecd5c3] shadow-xs select-none">
      {/* Decorative Floral Background on the right side */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-1/2 md:w-2/5 lg:w-1/2 xl:w-2/5 bg-cover bg-right bg-no-repeat opacity-40 lg:opacity-55 pointer-events-none mix-blend-multiply hidden md:block"
        style={{ backgroundImage: `url('/hero-floral-right.jpg')` }}
      />
      {/* Gradient Wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#faece1] via-[#faece1]/85 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-6 lg:gap-8">
        {/* Left Side: Headline & Tag */}
        <div className="space-y-1 sm:space-y-2 lg:space-y-3 max-w-xl xl:max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 lg:px-3.5 lg:py-1.5 rounded-full bg-[#f1dac7] text-[#7a4825] text-[10px] sm:text-xs lg:text-[13px] font-bold tracking-wide border border-[#e2c5ad]">
              Wedding Dashboard
            </span>
            <span className="text-[11px] text-[#8c6543] font-serif italic hidden xs:inline sm:hidden">
              16 Mei 2027
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-serif font-bold text-[#3a281c] leading-tight">
            Our Wedding <span className="font-medium text-[#995c32]">: Hari Bahagia A&M</span>
          </h1>
          <p className="text-[11px] sm:text-sm lg:text-base xl:text-lg text-[#7a6452] leading-relaxed hidden sm:block">
            Mari wujudkan hari istimewa dengan penuh cinta dan persiapan terbaik.
          </p>
        </div>

        {/* Right Side: 3 White Pill / Metric Cards (3-col compact row on mobile, 3-col on tablet/desktop) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 lg:gap-4 xl:gap-5 w-full xl:w-auto shrink-0">
          {/* Card 1: Hitung Mundur */}
          <div className="bg-[#ffffff]/95 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-5 xl:p-5 shadow-xs border border-[#ecd9c8] flex flex-col justify-between lg:min-w-[155px] xl:min-w-[175px]">
            <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] lg:text-xs uppercase font-bold tracking-wider text-[#6f5a49]">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-[#b07d57] shrink-0" />
              <span className="truncate">Hari H</span>
            </div>
            <div className="my-1 sm:my-2 lg:my-2.5">
              <span className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-[#3a281c]">{daysLeft ?? "—"}</span>
              <span className="text-[10px] sm:text-xs lg:text-sm text-[#6f5a49] ml-1">Hari</span>
            </div>
            <p className="text-[9.5px] sm:text-xs lg:text-xs text-[#8c6b4f] truncate hidden xs:block">Menuju Hari H</p>
          </div>

          {/* Card 2: Target Tamu */}
          <div className="bg-[#ffffff]/95 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-5 xl:p-5 shadow-xs border border-[#ecd9c8] flex flex-col justify-between lg:min-w-[155px] xl:min-w-[175px]">
            <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] lg:text-xs uppercase font-bold tracking-wider text-[#6f5a49]">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-[#b07d57] shrink-0" />
              <span className="truncate">Tamu</span>
            </div>
            <div className="my-1 sm:my-2 lg:my-2.5">
              <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-serif font-bold text-[#3a281c]">
                {data.settings.guestTarget}
              </span>
              <span className="text-[10px] sm:text-xs lg:text-sm text-[#6f5a49] ml-1">Pax</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] sm:text-[10.5px] lg:text-xs text-[#789d6e] font-semibold truncate">
                {guests.confirmed} Hadir
              </p>
              {onViewGuestDetail && (
                <button 
                  onClick={onViewGuestDetail}
                  aria-label="Lihat detail tamu"
                  className="text-[10px] sm:text-xs lg:text-xs text-[#b07d57] font-semibold hover:underline hidden sm:inline cursor-pointer"
                >
                  Detail →
                </button>
              )}
            </div>
          </div>

          {/* Card 3: Total Anggaran */}
          <div className="bg-[#ffffff]/95 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-5 xl:p-5 shadow-xs border border-[#ecd9c8] flex flex-col justify-between lg:min-w-[155px] xl:min-w-[175px]">
            <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] lg:text-xs uppercase font-bold tracking-wider text-[#6f5a49]">
              <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-[#b07d57] shrink-0" />
              <span className="truncate">Anggaran</span>
            </div>
            <div className="my-1 sm:my-2 lg:my-2.5">
              <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-serif font-bold text-[#3a281c] truncate block">
                {formatRupiah(budget.totalEstimated)}
              </span>
            </div>
            <div>
              <div className="w-full bg-[#f0e4d7] rounded-full h-1 sm:h-1.5 lg:h-2 overflow-hidden">
                <div
                  className="bg-[#789d6e] h-full rounded-full"
                  style={{ width: `${budget.percentPaid}%` }}
                />
              </div>
              <p className="text-[9px] sm:text-[10px] lg:text-[11px] text-[#789d6e] font-semibold mt-0.5 sm:mt-1 truncate">
                {budget.percentPaid}% Lunas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

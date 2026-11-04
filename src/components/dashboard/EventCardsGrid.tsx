import React from "react";
import { Church, Camera, Flower2, Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeddingData } from "@/components/providers/WeddingDataProvider";
import { eventProgress } from "@/lib/selectors";

interface EventCardsProps {
  onSelectEvent: (id: string) => void;
  onOpenQuickView?: (id: string) => void;
  selectedEventId?: string;
}

export const eventCardData = [
  {
    id: "gereja",
    title: "Gereja",
    icon: Church,
    barColor: "bg-[#d49957]",
    circleBg: "bg-[#faece0] text-[#b57a41]",
  },
  {
    id: "prewedding",
    title: "Pre-Wedding",
    icon: Camera,
    barColor: "bg-[#558252]",
    circleBg: "bg-[#faece0] text-[#b57a41]",
  },
  {
    id: "midodareni",
    title: "Midodareni",
    icon: Flower2,
    barColor: "bg-[#b85e6f]",
    circleBg: "bg-[#faece0] text-[#b57a41]",
  },
  {
    id: "resepsi",
    title: "Resepsi Pernikahan",
    icon: Heart,
    barColor: "bg-[#9ea873]",
    circleBg: "bg-[#faece0] text-[#b57a41]",
  },
];

export function EventCardsGrid({
  onSelectEvent,
  onOpenQuickView,
  selectedEventId,
}: EventCardsProps) {
  const { data } = useWeddingData();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-5">
      {eventCardData.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedEventId === card.id;
        const progress = eventProgress(data.eventTasks[card.id] ?? []);
        const meta = data.eventMetas?.[card.id];
        const displayTitle = meta?.title || card.title;

        return (
          <div
            key={card.id}
            className={cn(
              "soft-card relative w-full p-2.5 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center text-center group select-none transition-shadow hover:shadow-md",
              isSelected && "ring-2 ring-[#c98858] border-transparent"
            )}
          >
            <button
              type="button"
              onClick={() => onSelectEvent(card.id)}
              aria-label={`Buka detail ${displayTitle}`}
              aria-pressed={isSelected}
              className="absolute inset-0 rounded-[1.125rem] cursor-pointer focus-visible:outline-offset-4"
            />

            {onOpenQuickView && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenQuickView(card.id);
                }}
                aria-label={`Ringkasan cepat ${displayTitle}`}
                title={`Ringkasan cepat ${displayTitle}`}
                className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-20 p-1 sm:p-1.5 rounded-full bg-[#ffffff]/90 border border-[#ede4d8] text-[#7a6452] hover:text-[#3a281c] hover:bg-[#ffffff] transition-colors shadow-2xs cursor-pointer"
              >
                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}

            <div className="relative z-10 pointer-events-none flex flex-col items-center w-full">
              <div
                className={cn(
                  "w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-1.5 sm:mb-2.5 md:mb-3.5 transition-transform group-hover:scale-105",
                  card.circleBg
                )}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 stroke-[1.6]" />
              </div>

              <h3 className="text-xs sm:text-sm md:text-[15px] lg:text-base font-serif font-bold text-[#3a281c] group-hover:text-[#995c32] transition-colors mb-1.5 sm:mb-2 md:mb-3 line-clamp-1">
                {displayTitle}
              </h3>

              <div className="w-full mt-auto">
                <div className="flex items-baseline justify-between mb-1 sm:mb-1.5 md:mb-2 px-0.5">
                  <span className="text-xs sm:text-base md:text-xl lg:text-2xl font-serif font-bold text-[#3a281c] leading-none">
                    {progress}%
                  </span>
                  <span className="text-[8.5px] sm:text-[10px] md:text-[11px] text-[#6f5a49] font-medium uppercase tracking-wider">
                    Progress
                  </span>
                </div>

                <div className="w-full bg-[#f1e7da] rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      card.barColor
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

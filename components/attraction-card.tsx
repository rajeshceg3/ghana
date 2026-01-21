"use client"

import { useState, useEffect, memo } from "react"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Attraction, categoryColors } from "@/lib/data"

interface AttractionCardProps {
  attraction: Attraction
  isSelected: boolean
  isHovered: boolean
  onClick: (attraction: Attraction) => void
  onMouseEnter: (id: number) => void
  onMouseLeave: (id: number) => void
}

export const AttractionCard = memo(function AttractionCard({
  attraction,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: AttractionCardProps) {
  const [imageError, setImageError] = useState(false)

  // Reset error state if attraction changes (though keys usually handle this)
  useEffect(() => {
    setImageError(false)
  }, [attraction.image])

  return (
    <button
      type="button"
      className={`group relative isolate rounded-xl transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] w-full text-left
        ${isSelected
          ? "bg-white ring-1 ring-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-10 scale-[1.02]"
          : "bg-white hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:scale-[1.01] hover:z-10"
        }
        ${isHovered && !isSelected ? "ring-1 ring-primary/10" : "ring-1 ring-black/5"}
      `}
      onClick={() => onClick(attraction)}
      onMouseEnter={() => onMouseEnter(attraction.id)}
      onMouseLeave={() => onMouseLeave(attraction.id)}
      aria-current={isSelected ? 'true' : undefined}
    >
      <div className="p-3 flex gap-4">
        {/* Image Container - Slightly larger and cleaner */}
        <div className="w-24 h-24 rounded-lg overflow-hidden relative shrink-0 bg-muted shadow-inner">
          <Image
            src={imageError ? "/placeholder.svg" : (attraction.image || "/placeholder.svg")}
            alt={attraction.name}
            fill
            className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isHovered || isSelected ? 'scale-110' : 'scale-100'}`}
            sizes="(max-width: 768px) 100px, 100px"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 ring-1 ring-black/5 rounded-lg z-10" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between">
              <h3 className={`font-semibold text-base leading-snug tracking-tight transition-colors ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                {attraction.name}
              </h3>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <Badge
                variant="secondary"
                className={`
                  px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border-0 rounded-md
                  ${categoryColors[attraction.category] || "bg-muted text-muted-foreground"}
                `}
              >
                {attraction.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs font-medium text-foreground/80 bg-muted/50 px-1.5 py-0.5 rounded-md">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{attraction.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                <span>{attraction.duration}</span>
              </div>
            </div>

            <div className={`
              w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300
              ${isSelected
                ? "bg-primary/10 text-primary opacity-100"
                : "bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:bg-primary/10 group-hover:text-primary"
              }
            `}>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </button>
  )
})

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, ChevronRight, MapPin } from "lucide-react"
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

export function AttractionCard({
  attraction,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: AttractionCardProps) {
  return (
    <Card
      className={`group cursor-pointer border-transparent transition-all duration-300 ease-out
        ${isSelected
          ? "bg-primary/5 ring-1 ring-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.02]"
          : "bg-white hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:scale-[1.01]"
        }
        ${isHovered && !isSelected ? "ring-1 ring-primary/10" : ""}
      `}
      onClick={() => onClick(attraction)}
      onMouseEnter={() => onMouseEnter(attraction.id)}
      onMouseLeave={() => onMouseLeave(attraction.id)}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault() // Prevent scrolling when pressing Space
          onClick(attraction)
        }
      }}
    >
      <CardContent className="p-3">
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden relative shrink-0 shadow-inner">
            <Image
              src={attraction.image || "/placeholder.svg"}
              alt={attraction.name}
              fill
              className={`object-cover transition-transform duration-700 ${isHovered || isSelected ? 'scale-110' : 'scale-100'}`}
              sizes="80px"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex items-start justify-between mb-1">
                <h3 className={`font-semibold text-sm leading-tight transition-colors ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                  {attraction.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className={`px-1.5 py-0 text-[10px] font-medium border-0 ${categoryColors[attraction.category] || "bg-muted text-muted-foreground"}`}
                >
                  {attraction.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-current" />
                  <span className="text-xs font-medium text-foreground">{attraction.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{attraction.duration}</span>
                </div>
              </div>

              <ChevronRight
                className={`w-4 h-4 text-muted-foreground/50 transition-all duration-300 ${
                  isSelected ? "text-primary translate-x-1 opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                }`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

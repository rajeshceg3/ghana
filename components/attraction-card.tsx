import { Card, CardContent } from "@/components/ui/card"
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
      className={`cursor-pointer transition-all duration-500 ease-out hover:shadow-xl border-0 bg-white/70 backdrop-blur-sm ${
        isSelected
          ? "ring-2 ring-amber-300 shadow-lg transform scale-[1.02]"
          : "hover:bg-white/90"
      } ${isHovered ? "transform scale-[1.01]" : ""}`}
      onClick={() => onClick(attraction)}
      onMouseEnter={() => onMouseEnter(attraction.id)}
      onMouseLeave={() => onMouseLeave(attraction.id)}
      role="button"
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(attraction)
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0 relative">
            <Image
              src={attraction.image || "/placeholder.svg"}
              alt={attraction.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              sizes="64px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-gray-900 text-sm leading-tight">{attraction.name}</h3>
              <ChevronRight
                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                  isSelected ? "rotate-90" : ""
                }`}
              />
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <Badge
                className={`text-xs font-light ${categoryColors[attraction.category]}`}
              >
                {attraction.category}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-amber-400 fill-current" />
                <span className="text-xs text-gray-600 font-light">{attraction.rating}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span className="font-light">{attraction.duration}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

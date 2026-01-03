import { Attraction } from "@/lib/data"
import { AttractionCard } from "@/components/attraction-card"

interface AttractionListProps {
  attractions: Attraction[]
  selectedAttractionId: number | null
  hoveredAttractionId: number | null
  onSelect: (attraction: Attraction) => void
  onHover: (id: number) => void
  onLeave: (id: number) => void
}

export function AttractionList({
  attractions,
  selectedAttractionId,
  hoveredAttractionId,
  onSelect,
  onHover,
  onLeave,
}: AttractionListProps) {
  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Note: Header is now handled in parent for better flexibility, but we can add a spacer if needed */}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
        {attractions.map((attraction) => (
          <div key={attraction.id} className="transform transition-all duration-300">
            <AttractionCard
              attraction={attraction}
              isSelected={selectedAttractionId === attraction.id}
              isHovered={hoveredAttractionId === attraction.id}
              onClick={() => onSelect(attraction)}
              onMouseEnter={() => onHover(attraction.id)}
              onMouseLeave={() => onLeave(attraction.id)}
            />
          </div>
        ))}
        {attractions.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-sm">No attractions found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

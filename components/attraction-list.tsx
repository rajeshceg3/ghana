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
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-amber-100 flex-shrink-0">
        <h2 className="text-lg font-light text-gray-900 mb-2">Featured Attractions</h2>
        <p className="text-sm text-gray-500 font-light">{attractions.length} remarkable destinations</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-3">
          {attractions.map((attraction) => (
            <li key={attraction.id}>
              <AttractionCard
                attraction={attraction}
                isSelected={selectedAttractionId === attraction.id}
                isHovered={hoveredAttractionId === attraction.id}
                onClick={() => onSelect(attraction)}
                onMouseEnter={() => onHover(attraction.id)}
                onMouseLeave={() => onLeave(attraction.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

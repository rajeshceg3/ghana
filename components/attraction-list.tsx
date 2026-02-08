import { memo } from "react"
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

export const AttractionList = memo(function AttractionList({
  attractions,
  selectedAttractionId,
  hoveredAttractionId,
  onSelect,
  onHover,
  onLeave,
}: AttractionListProps) {
  if (!attractions) return null

  return (
    <div className="flex flex-col h-full bg-transparent">
      {attractions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
             <span className="text-xl" role="img" aria-label="Search icon">🔍</span>
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">No places found</h3>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Try adjusting your search to find what you&apos;re looking for.
          </p>
        </div>
      ) : (
        <ul className="flex-1 space-y-3 px-3 py-2 list-none m-0" aria-label="List of attractions">
          {attractions.map((attraction, index) => (
            <li
              key={attraction.id}
              className="animate-fade-in-up opacity-0"
              style={{
                animationDelay: `${index * 30}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <AttractionCard
                attraction={attraction}
                isSelected={selectedAttractionId === attraction.id}
                isHovered={hoveredAttractionId === attraction.id}
                onClick={onSelect}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})

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
      <div className="flex-1 space-y-3 px-3 py-2">
        {attractions.map((attraction, index) => (
          <div
            key={attraction.id}
            style={{
              animationDelay: `${index * 30}ms`,
              opacity: 0,
              animation: 'fadeInUp 0.5s ease-out forwards'
            }}
          >
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
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
               <span className="text-xl">🔍</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">No places found</h3>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Try adjusting your search to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

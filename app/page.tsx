"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { MapPin, Search } from "lucide-react"
import { AttractionCard } from "@/components/attraction-card"
import { AttractionDetails } from "@/components/attraction-details"
import { attractions, Attraction } from "@/lib/data"

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse mb-4 mx-auto"></div>
        <p className="text-gray-600 font-light">Loading map...</p>
      </div>
    </div>
  ),
})

export default function Page() {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredAttractionId, setHoveredAttractionId] = useState<number | null>(null)

  const filteredAttractions = attractions.filter(
    (attraction) =>
      attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attraction.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAttractionSelect = (attraction: Attraction) => {
    setSelectedAttraction(attraction)
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="z-20 bg-white/80 backdrop-blur-xl border-b border-amber-100 flex-shrink-0">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-light text-gray-900">Ghana</h1>
              <p className="text-sm text-gray-500 font-light">Discover extraordinary places</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search attractions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-white/50 border-amber-200 focus:border-amber-300 focus:ring-amber-200"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-96 bg-white/90 backdrop-blur-xl border-r border-amber-100 flex flex-col z-10 h-full">
          <div className="p-6 border-b border-amber-100 flex-shrink-0">
            <h2 className="text-lg font-light text-gray-900 mb-2">Featured Attractions</h2>
            <p className="text-sm text-gray-500 font-light">{filteredAttractions.length} remarkable destinations</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              {filteredAttractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  isSelected={selectedAttraction?.id === attraction.id}
                  isHovered={hoveredAttractionId === attraction.id}
                  onClick={handleAttractionSelect}
                  onMouseEnter={() => setHoveredAttractionId(attraction.id)}
                  onMouseLeave={() => setHoveredAttractionId(null)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative h-full">
          <MapComponent
            attractions={attractions}
            selectedAttraction={selectedAttraction}
            hoveredAttractionId={hoveredAttractionId}
            onAttractionSelect={handleAttractionSelect}
          />

          {/* Attraction Detail Panel */}
          {selectedAttraction && (
            <AttractionDetails
              attraction={selectedAttraction}
              onClose={() => setSelectedAttraction(null)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

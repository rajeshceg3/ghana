"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Menu } from "lucide-react"
import { AttractionList } from "@/components/attraction-list"
import { AttractionDetails } from "@/components/attraction-details"
import { attractions, Attraction } from "@/lib/data"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const filteredAttractions = useMemo(() => attractions.filter(
    (attraction) =>
      attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attraction.category.toLowerCase().includes(searchQuery.toLowerCase()),
  ), [searchQuery])

  const handleAttractionSelect = (attraction: Attraction) => {
    setSelectedAttraction(attraction)
    setIsMobileMenuOpen(false) // Close mobile menu on selection
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="z-20 bg-white/80 backdrop-blur-xl border-b border-amber-100 flex-shrink-0">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-light text-gray-900">Ghana</h1>
              <p className="text-xs md:text-sm text-gray-500 font-light hidden sm:block">Discover extraordinary places</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-white/50 border-amber-200 focus:border-amber-300 focus:ring-amber-200"
              />
            </div>

            {/* Mobile Search & Menu */}
            <div className="md:hidden flex items-center gap-2">
               {/* Mobile Search could be expanded, for now kept simple or hidden behind menu if space is tight.
                   Let's keep it visible but smaller or expandable. */}
               <div className="relative w-40">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-white/50 border-amber-200 focus:border-amber-300 focus:ring-amber-200 text-sm"
                />
              </div>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 border-amber-200 text-amber-900 hover:bg-amber-50">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85%] sm:w-[380px] p-0 pt-10">
                  <AttractionList
                    attractions={filteredAttractions}
                    selectedAttractionId={selectedAttraction?.id || null}
                    hoveredAttractionId={hoveredAttractionId}
                    onSelect={handleAttractionSelect}
                    onHover={setHoveredAttractionId}
                    onLeave={() => setHoveredAttractionId(null)}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-96 bg-white/90 backdrop-blur-xl border-r border-amber-100 flex-col z-10 h-full">
          <AttractionList
            attractions={filteredAttractions}
            selectedAttractionId={selectedAttraction?.id || null}
            hoveredAttractionId={hoveredAttractionId}
            onSelect={handleAttractionSelect}
            onHover={setHoveredAttractionId}
            onLeave={() => setHoveredAttractionId(null)}
          />
        </aside>

        {/* Map */}
        <div className="flex-1 relative h-full w-full">
          <MapComponent
            attractions={filteredAttractions}
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
      </main>
    </div>
  )
}

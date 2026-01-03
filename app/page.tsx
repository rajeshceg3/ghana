"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Menu, Command } from "lucide-react"
import { AttractionList } from "@/components/attraction-list"
import { AttractionDetails } from "@/components/attraction-details"
import { attractions, Attraction } from "@/lib/data"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MapErrorBoundary } from "@/components/map-error-boundary"

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/20 rounded-full animate-pulse mb-4 mx-auto flex items-center justify-center">
          <MapPin className="w-6 h-6 text-primary animate-bounce" />
        </div>
        <p className="text-muted-foreground font-medium text-sm">Loading map...</p>
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
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="z-20 bg-background/80 backdrop-blur-md border-b flex-shrink-0 relative">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center space-x-3 group cursor-default">
            <div className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <MapPin className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">Ghana</h1>
              <p className="text-xs text-muted-foreground font-medium hidden sm:block mt-1">Discover extraordinary places</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Search */}
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-72 bg-muted/40 border-transparent focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/10 rounded-full transition-all duration-300 h-10 shadow-sm"
                aria-label="Search attractions"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden lg:flex items-center gap-1 pointer-events-none">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            {/* Mobile Search & Menu */}
            <div className="md:hidden flex items-center gap-2">
               <div className="relative w-full max-w-[180px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-muted/50 border-transparent rounded-full text-sm focus:bg-background focus:ring-2 focus:ring-primary/20"
                  aria-label="Search attractions mobile"
                />
              </div>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground hover:bg-muted rounded-full" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85%] sm:w-[380px] p-0 pt-0 gap-0 border-r">
                  <div className="p-6 border-b bg-muted/10">
                    <h2 className="text-lg font-semibold tracking-tight">Attractions</h2>
                    <p className="text-sm text-muted-foreground mt-1">Explore {filteredAttractions.length} destinations</p>
                  </div>
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
        <aside className="hidden md:flex w-[400px] bg-card border-r flex-col z-10 h-full shadow-xl shadow-black/5">
          <div className="p-6 border-b flex-shrink-0 bg-background/50 backdrop-blur-sm">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-semibold text-foreground tracking-tight">Featured</h2>
               <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                 {filteredAttractions.length} Places
               </span>
             </div>
             <p className="text-sm text-muted-foreground leading-relaxed">
               Explore the most breathtaking locations across the region.
             </p>
          </div>
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
        <div className="flex-1 relative h-full w-full bg-muted/10">
          <MapErrorBoundary>
            <MapComponent
              attractions={filteredAttractions}
              selectedAttraction={selectedAttraction}
              hoveredAttractionId={hoveredAttractionId}
              onAttractionSelect={handleAttractionSelect}
              onHover={setHoveredAttractionId}
              onLeave={() => setHoveredAttractionId(null)}
            />
          </MapErrorBoundary>

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

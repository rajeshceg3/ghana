"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Menu, X, ArrowRight } from "lucide-react"
import { AttractionList } from "@/components/attraction-list"
import { AttractionDetails } from "@/components/attraction-details"
import { attractions, Attraction } from "@/lib/data"
import { Sheet, SheetContent, SheetTrigger, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MapErrorBoundary } from "@/components/map-error-boundary"
import { Badge } from "@/components/ui/badge"

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 ring-1 ring-black/5">
           <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse flex items-center justify-center">
             <MapPin className="w-4 h-4 text-primary animate-bounce" />
           </div>
        </div>
        <p className="text-muted-foreground font-medium text-sm tracking-wide">Loading map experience...</p>
      </div>
    </div>
  ),
})

export default function Page() {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredAttractionId, setHoveredAttractionId] = useState<number | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Debounce logic for hover to prevent flickering
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleHover = (id: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setHoveredAttractionId(id)
  }

  const handleLeave = (id?: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredAttractionId(null)
    }, 50)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const filteredAttractions = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase()
    return attractions.filter(
      (attraction) =>
        attraction.name.toLowerCase().includes(lowerQuery) ||
        attraction.category.toLowerCase().includes(lowerQuery),
    )
  }, [searchQuery])

  const handleAttractionSelect = (attraction: Attraction) => {
    setSelectedAttraction(attraction)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Header - Glassmorphic & Clean */}
      <header className="z-30 bg-white/80 backdrop-blur-xl border-b border-border/40 flex-shrink-0 relative sticky top-0">
        <div className="flex items-center justify-between px-4 md:px-6 h-[72px]">
          {/* Logo Area */}
          <div className="flex items-center space-x-3.5 group cursor-default select-none">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 ring-1 ring-white/20 transition-transform duration-500 group-hover:rotate-6">
                <MapPin className="w-5 h-5 fill-current" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-foreground leading-none font-display">Ghana<span className="text-primary">.</span></h1>
              <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase mt-0.5">Explore</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Search - Highly Polished */}
            <div className="relative hidden md:block group w-[340px]">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/70 group-focus-within:text-primary transition-colors duration-300" />
              <Input
                ref={searchInputRef}
                placeholder="Find a destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12 w-full bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-full transition-all duration-300 h-11 shadow-sm font-medium text-sm placeholder:text-muted-foreground/60"
                aria-label="Search attractions"
              />
              <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {searchQuery ? (
                  <button
                    onClick={() => {
                        setSearchQuery("")
                        searchInputRef.current?.focus()
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="hidden lg:flex items-center gap-1 pointer-events-none opacity-50">
                    <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search & Menu */}
            <div className="md:hidden flex items-center gap-3">
               <div className="relative w-full max-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-muted/50 border-transparent rounded-full text-sm focus:bg-background focus:ring-2 focus:ring-primary/20 shadow-none font-medium"
                  aria-label="Search attractions mobile"
                />
              </div>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:bg-muted rounded-full" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85%] sm:w-[380px] p-0 pt-0 gap-0 border-r flex flex-col bg-sidebar z-[2000]">
                  <SheetTitle className="sr-only">Attractions Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    List of attractions and destinations
                  </SheetDescription>
                  <div className="p-6 border-b border-sidebar-border bg-sidebar flex-shrink-0">
                    <h2 className="text-lg font-bold tracking-tight text-sidebar-foreground">Attractions</h2>
                    <p className="text-sm text-sidebar-foreground/60 mt-1">Explore {filteredAttractions.length} destinations</p>
                  </div>
                  <AttractionList
                    attractions={filteredAttractions}
                    selectedAttractionId={selectedAttraction?.id || null}
                    hoveredAttractionId={hoveredAttractionId}
                    onSelect={handleAttractionSelect}
                    onHover={handleHover}
                    onLeave={handleLeave}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar - Premium List View */}
        <aside className="hidden md:flex w-[420px] bg-sidebar border-r border-sidebar-border flex-col z-10 h-full shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)]">
          <div className="p-6 pb-4 flex-shrink-0 bg-sidebar/50 backdrop-blur-sm z-10 sticky top-0">
             <div className="flex items-center justify-between mb-2">
               <h2 className="text-lg font-bold text-sidebar-foreground tracking-tight">Featured Places</h2>
               <Badge variant="outline" className="bg-sidebar-accent/50 text-sidebar-primary border-sidebar-primary/20 px-2.5 py-0.5 rounded-full shadow-none font-semibold text-xs">
                 {filteredAttractions.length} Results
               </Badge>
             </div>
             <p className="text-sm text-sidebar-foreground/70 leading-relaxed font-medium">
               Curated selection of the most breathtaking locations.
             </p>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto hover:scrollbar-thumb-muted-foreground/30">
                <div className="p-2 pb-20"> {/* Padding bottom for scroll space */}
                    <AttractionList
                        attractions={filteredAttractions}
                        selectedAttractionId={selectedAttraction?.id || null}
                        hoveredAttractionId={hoveredAttractionId}
                        onSelect={handleAttractionSelect}
                        onHover={handleHover}
                        onLeave={handleLeave}
                    />
                </div>
            </div>
            {/* Fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-sidebar to-transparent pointer-events-none" />
          </div>
        </aside>

        {/* Map Container */}
        <div className="flex-1 relative h-full w-full bg-muted/10 group/map">
          <MapErrorBoundary>
            <MapComponent
              attractions={filteredAttractions}
              selectedAttraction={selectedAttraction}
              hoveredAttractionId={hoveredAttractionId}
              onAttractionSelect={handleAttractionSelect}
              onHover={handleHover}
              onLeave={handleLeave}
            />
          </MapErrorBoundary>

          {/* Floating Action Button for Map (Example: Re-center) - Optional Polish */}
          <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
             {/* Map controls usually go here via Leaflet, but we can add custom overlays */}
          </div>

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

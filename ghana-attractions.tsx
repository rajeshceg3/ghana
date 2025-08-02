"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Star, Clock, Camera, Search, X, ChevronRight } from "lucide-react"

// Ghana attractions data
const attractions = [
  {
    id: 1,
    name: "Cape Coast Castle",
    category: "Historical",
    rating: 4.8,
    duration: "2-3 hours",
    lat: 5.1053,
    lng: -1.2466,
    description:
      "A UNESCO World Heritage site, this 17th-century castle stands as a powerful reminder of the Atlantic slave trade.",
    image: "/cape-coast-castle-ghana.png",
    highlights: ["UNESCO World Heritage", "Historical significance", "Ocean views"],
  },
  {
    id: 2,
    name: "Kakum National Park",
    category: "Nature",
    rating: 4.7,
    duration: "4-5 hours",
    lat: 5.35,
    lng: -1.3833,
    description: "Experience the rainforest canopy on suspended walkways 40 meters above the ground.",
    image: "/placeholder-zq13n.png",
    highlights: ["Canopy walkway", "Rainforest", "Wildlife viewing"],
  },
  {
    id: 3,
    name: "Mole National Park",
    category: "Wildlife",
    rating: 4.6,
    duration: "Full day",
    lat: 9.25,
    lng: -1.85,
    description: "Ghana's largest wildlife refuge, home to elephants, antelopes, and over 300 bird species.",
    image: "/mole-national-park-elephants.png",
    highlights: ["Elephant viewing", "Safari experience", "Bird watching"],
  },
  {
    id: 4,
    name: "Wli Waterfalls",
    category: "Nature",
    rating: 4.5,
    duration: "3-4 hours",
    lat: 7.1167,
    lng: 0.6,
    description: "The highest waterfall in Ghana, cascading from a height of approximately 60 meters.",
    image: "/placeholder-zn15g.png",
    highlights: ["Highest waterfall", "Hiking trail", "Swimming opportunity"],
  },
  {
    id: 5,
    name: "Elmina Castle",
    category: "Historical",
    rating: 4.7,
    duration: "2-3 hours",
    lat: 5.0833,
    lng: -1.35,
    description: "The oldest European building in existence south of the Sahara, built by the Portuguese in 1482.",
    image: "/placeholder-b1790.png",
    highlights: ["Oldest European building", "Portuguese architecture", "Coastal views"],
  },
  {
    id: 6,
    name: "Lake Volta",
    category: "Nature",
    rating: 4.4,
    duration: "Full day",
    lat: 7.5,
    lng: -0.5,
    description: "One of the world's largest artificial lakes, perfect for boat trips and fishing.",
    image: "/placeholder-9l20x.png",
    highlights: ["Largest artificial lake", "Boat trips", "Fishing"],
  },
]

const categoryColors = {
  Historical: "bg-amber-100 text-amber-800 border-amber-200",
  Nature: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Wildlife: "bg-orange-100 text-orange-800 border-orange-200",
}

export default function Component() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedAttraction, setSelectedAttraction] = useState<(typeof attractions)[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [hoveredAttraction, setHoveredAttraction] = useState<number | null>(null)

  const filteredAttractions = attractions.filter(
    (attraction) =>
      attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attraction.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Load JS
      if (!(window as any).L) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.onload = initializeMap
        document.head.appendChild(script)
      } else {
        initializeMap()
      }
    }

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return

      const L = (window as any).L

      // Initialize map centered on Ghana
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([7.9465, -1.0232], 7)

      // Custom tile layer with a more elegant style
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map)

      // Add custom zoom control
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map)

      mapInstanceRef.current = map

      // Add markers for attractions
      attractions.forEach((attraction, index) => {
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `
            <div class="marker-container" style="
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              cursor: pointer;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        })

        const marker = L.marker([attraction.lat, attraction.lng], { icon: customIcon })
          .addTo(map)
          .on("click", () => {
            setSelectedAttraction(attraction)
            map.flyTo([attraction.lat, attraction.lng], 10, {
              animate: true,
              duration: 1.5,
            })
          })

        markersRef.current.push(marker)
      })

      setIsMapLoaded(true)
    }

    loadLeaflet()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const handleAttractionClick = (attraction: (typeof attractions)[0]) => {
    setSelectedAttraction(attraction)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([attraction.lat, attraction.lng], 10, {
        animate: true,
        duration: 1.5,
      })
    }
  }

  const handleMarkerHover = (attractionId: number, isHovering: boolean) => {
    setHoveredAttraction(isHovering ? attractionId : null)

    if (mapInstanceRef.current && markersRef.current[attractionId - 1]) {
      const marker = markersRef.current[attractionId - 1]
      const element = marker.getElement()?.querySelector(".marker-container")

      if (element) {
        if (isHovering) {
          element.style.transform = "scale(1.2)"
          element.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)"
        } else {
          element.style.transform = "scale(1)"
          element.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"
        }
      }
    }
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-xl border-b border-amber-100">
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

      <div className="flex h-full pt-20">
        {/* Sidebar */}
        <div className="w-96 bg-white/90 backdrop-blur-xl border-r border-amber-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-amber-100">
            <h2 className="text-lg font-light text-gray-900 mb-2">Featured Attractions</h2>
            <p className="text-sm text-gray-500 font-light">{filteredAttractions.length} remarkable destinations</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              {filteredAttractions.map((attraction) => (
                <Card
                  key={attraction.id}
                  className={`cursor-pointer transition-all duration-500 ease-out hover:shadow-xl border-0 bg-white/70 backdrop-blur-sm ${
                    selectedAttraction?.id === attraction.id
                      ? "ring-2 ring-amber-300 shadow-lg transform scale-[1.02]"
                      : "hover:bg-white/90"
                  } ${hoveredAttraction === attraction.id ? "transform scale-[1.01]" : ""}`}
                  onClick={() => handleAttractionClick(attraction)}
                  onMouseEnter={() => handleMarkerHover(attraction.id, true)}
                  onMouseLeave={() => handleMarkerHover(attraction.id, false)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0">
                        <img
                          src={attraction.image || "/placeholder.svg"}
                          alt={attraction.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 text-sm leading-tight">{attraction.name}</h3>
                          <ChevronRight
                            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                              selectedAttraction?.id === attraction.id ? "rotate-90" : ""
                            }`}
                          />
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            className={`text-xs font-light ${categoryColors[attraction.category as keyof typeof categoryColors]}`}
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
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />

          {!isMapLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse mb-4 mx-auto"></div>
                <p className="text-gray-600 font-light">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Attraction Detail Panel */}
        {selectedAttraction && (
          <div className="absolute bottom-6 left-6 right-6 z-30 pointer-events-none">
            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl pointer-events-auto transform transition-all duration-700 ease-out animate-in slide-in-from-bottom-4">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-48 h-32 bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
                    <img
                      src={selectedAttraction.image || "/placeholder.svg"}
                      alt={selectedAttraction.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        className={`text-xs font-light ${categoryColors[selectedAttraction.category as keyof typeof categoryColors]}`}
                      >
                        {selectedAttraction.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-light text-gray-900 mb-1">{selectedAttraction.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span className="font-light">{selectedAttraction.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-light">{selectedAttraction.duration}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedAttraction(null)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
                      {selectedAttraction.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedAttraction.highlights.map((highlight, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs font-light bg-amber-50 text-amber-700 border-amber-200"
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <Button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 font-light">
                        <Camera className="w-4 h-4 mr-2" />
                        View Gallery
                      </Button>
                      <Button
                        variant="outline"
                        className="border-amber-200 text-amber-700 hover:bg-amber-50 font-light bg-transparent"
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-container {
          background: linear-gradient(135deg, #fef7ed 0%, #fff7ed 100%) !important;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        
        .leaflet-control-zoom a {
          background: rgba(255,255,255,0.9) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(251, 191, 36, 0.2) !important;
          color: #92400e !important;
          font-weight: 300 !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: rgba(255,255,255,1) !important;
          border-color: rgba(251, 191, 36, 0.3) !important;
        }
      `}</style>
    </div>
  )
}

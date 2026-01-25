"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Attraction } from "@/lib/data"
import { MapMarker } from "./map-marker"

interface MapComponentProps {
  attractions: Attraction[]
  selectedAttraction: Attraction | null
  hoveredAttractionId: number | null
  onAttractionSelect: (attraction: Attraction) => void
  onHover?: (id: number) => void
  onLeave?: () => void
}

function MapController({ selectedAttraction, attractions }: { selectedAttraction: Attraction | null, attractions: Attraction[] }) {
  const map = useMap()

  // Fly to selected attraction
  useEffect(() => {
    if (selectedAttraction) {
      map.flyTo([selectedAttraction.lat, selectedAttraction.lng], 13, {
        animate: true,
        duration: 1.5,
      })
    }
  }, [selectedAttraction, map])

  // Fit bounds when attractions list changes (e.g. search)
  useEffect(() => {
    if (!selectedAttraction) {
      if (attractions.length > 0) {
        const bounds = L.latLngBounds(attractions.map(a => [a.lat, a.lng]))
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: true, duration: 1 })
        }
      } else {
        // Reset to default Ghana view if no results
        map.flyTo([7.9465, -1.0232], 7, { animate: true, duration: 1 })
      }
    }
  }, [attractions, map, selectedAttraction])

  return null
}

function MapResizer() {
  const map = useMap()

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize()
    })

    const container = map.getContainer()
    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [map])

  return null
}

export default function MapComponent({
  attractions,
  selectedAttraction,
  hoveredAttractionId,
  onAttractionSelect,
  onHover,
  onLeave,
}: MapComponentProps) {

  useEffect(() => {
    // Fix for Leaflet's default icon path issues in webpack/Next.js
    // We safely access the prototype by casting to 'any' because strict types
    // don't include internal private methods like _getIconUrl.
    type IconDefaultPrototype = L.Icon.Default & { _getIconUrl?: string };
    const iconDefaultPrototype = L.Icon.Default.prototype as unknown as IconDefaultPrototype;
    if (iconDefaultPrototype._getIconUrl) {
      delete iconDefaultPrototype._getIconUrl
    }

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
      iconUrl: '/images/leaflet/marker-icon.png',
      shadowUrl: '/images/leaflet/marker-shadow.png',
    })
  }, [])

  // Track the last focused marker ID to restore focus after icon recreation
  const lastFocusedMarkerId = useRef<number | null>(null)

  useEffect(() => {
    // Capture focus events to track which marker was last focused
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target && target.id && target.id.startsWith('marker-')) {
        const id = parseInt(target.id.replace('marker-', ''), 10)
        lastFocusedMarkerId.current = id
      } else if (target && !target.closest('.leaflet-container')) {
        // Clear if focus moves outside map
        lastFocusedMarkerId.current = null
      }
    }

    document.addEventListener('focus', handleFocus, true)
    return () => document.removeEventListener('focus', handleFocus, true)
  }, [])

  // Restore focus after render if necessary
  useEffect(() => {
    if (lastFocusedMarkerId.current !== null) {
      requestAnimationFrame(() => {
        const element = document.getElementById(`marker-${lastFocusedMarkerId.current}`)
        if (element && document.activeElement !== element) {
          // Only attempt focus if the element is connected to DOM
          if (element.isConnected) {
            element.focus()
          }
        }
      })
    }
  }, [attractions, hoveredAttractionId, selectedAttraction])

  // Keep a ref to attractions to avoid re-binding event listeners on every search keystroke
  const attractionsRef = useRef(attractions)
  useEffect(() => {
    attractionsRef.current = attractions
  }, [attractions])

  // Global keydown listener for map accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement) {
        const target = document.activeElement as HTMLElement;
        if (target.id && target.id.startsWith('marker-')) {
          e.preventDefault(); // Prevent scroll/default
          const id = parseInt(target.id.replace('marker-', ''), 10);
          const attraction = attractionsRef.current.find(a => a.id === id);
          if (attraction) {
            onAttractionSelect(attraction);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onAttractionSelect]);

  return (
    <>
      <MapContainer
        center={[7.9465, -1.0232]}
        zoom={7}
        zoomControl={false}
        className="w-full h-full custom-map-container"
        aria-label="Map of Ghana Attractions"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        <ZoomControl position="bottomright" />

        <MapController selectedAttraction={selectedAttraction} attractions={attractions} />
        <MapResizer />

        {attractions.map((attraction) => {
           const isSelected = selectedAttraction?.id === attraction.id
           const isHovered = hoveredAttractionId === attraction.id
           return (
             <MapMarker
                key={attraction.id}
                attraction={attraction}
                isSelected={isSelected}
                isHovered={isHovered}
                onSelect={onAttractionSelect}
                onHover={onHover}
                onLeave={onLeave}
             />
          )
        })}
      </MapContainer>
    </>
  )
}

"use client"

import { useEffect, useCallback, useMemo, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Attraction } from "@/lib/data"

interface MapComponentProps {
  attractions: Attraction[]
  selectedAttraction: Attraction | null
  hoveredAttractionId: number | null
  onAttractionSelect: (attraction: Attraction) => void
  onHover?: (id: number) => void
  onLeave?: () => void
}

function MapController({ selectedAttraction }: { selectedAttraction: Attraction | null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedAttraction) {
      map.flyTo([selectedAttraction.lat, selectedAttraction.lng], 13, {
        animate: true,
        duration: 1.5,
      })
    }
  }, [selectedAttraction, map])

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
    const iconDefaultPrototype = L.Icon.Default.prototype as unknown as { _getIconUrl?: string }
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
      const element = document.getElementById(`marker-${lastFocusedMarkerId.current}`)
      if (element && document.activeElement !== element) {
        // Only attempt focus if the element is connected to DOM
        if (element.isConnected) {
            element.focus()
        }
      }
    }
  })

  // Memoize icon creation to avoid unnecessary recreations
  const getCustomIcon = useCallback((isHovered: boolean, isSelected: boolean, title: string, id: number) => {
    // Escape the title to prevent XSS when injecting into HTML string
    const safeTitle = title
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Colors derived from our primary "Indigo/Blue" or "Orange" logic
    // We decided on Primary = Indigo (Stripe-ish) but markers are locations,
    // often red or orange. Let's make them primary color (Indigo) for consistency.
    // Or maybe keep them Orange/Warm for contrast against the map.
    // Let's go with a very clean Indigo to match the new UI.
    const color = isSelected ? '#4338ca' : (isHovered ? '#6366f1' : '#4f46e5'); // Indigo 700, 500, 600

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div id="marker-${id}"
             class="marker-container"
             tabindex="0"
             role="button"
             aria-label="${safeTitle}"
             style="
          width: 44px;
          height: 44px;
          background: ${color};
          border: 4px solid white;
          border-radius: 50% 50% 50% 0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          transform: rotate(-45deg) ${isHovered || isSelected ? 'scale(1.1) translateY(-5px)' : 'scale(1)'};
        ">
           <div style="
             width: 14px;
             height: 14px;
             background: white;
             border-radius: 50%;
             transform: rotate(45deg);
           "></div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44], // Pointing tip at location
      popupAnchor: [0, -44]
    })
  }, [])

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

        <MapController selectedAttraction={selectedAttraction} />
        <MapResizer />

        {attractions.map((attraction) => {
           const isSelected = selectedAttraction?.id === attraction.id
           const isHovered = hoveredAttractionId === attraction.id
           return (
            <Marker
              key={attraction.id}
              position={[attraction.lat, attraction.lng]}
              icon={getCustomIcon(isHovered, isSelected, attraction.name, attraction.id)}
              title={attraction.name}
              eventHandlers={{
                click: () => onAttractionSelect(attraction),
                mouseover: () => onHover?.(attraction.id),
                mouseout: () => onLeave?.(),
                keydown: (e) => {
                  const event = e.originalEvent as KeyboardEvent
                   if (event.key === 'Enter' || event.key === ' ') {
                     // Prevent default to avoid map panning
                     event.preventDefault()
                     onAttractionSelect(attraction)
                   }
                }
              }}
            />
          )
        })}
      </MapContainer>
    </>
  )
}

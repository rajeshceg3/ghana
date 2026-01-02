"use client"

import { useEffect, useCallback, useMemo } from "react"
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Attraction } from "@/lib/data"

interface MapComponentProps {
  attractions: Attraction[]
  selectedAttraction: Attraction | null
  hoveredAttractionId: number | null
  onAttractionSelect: (attraction: Attraction) => void
}

function MapController({ selectedAttraction }: { selectedAttraction: Attraction | null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedAttraction) {
      map.flyTo([selectedAttraction.lat, selectedAttraction.lng], 10, {
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

    // We observe the container of the map
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
}: MapComponentProps) {

  useEffect(() => {
    // Fix for default marker icons in Leaflet with Next.js
    // This needs to be inside useEffect to run only on client side
    // and check if prototype modification is needed.
    // However, since we are using custom icons, the default icon fix might not be strictly necessary
    // for our markers, but good for fallback.

    // We check if the delete has already happened to avoid errors or re-running logic unnecessarily,
    // though the delete operator is safe.

    // Using type assertion to access _getIconUrl which is not in the type definition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    })
  }, [])

  // Memoize icon creation to avoid unnecessary recreations
  const getCustomIcon = useCallback((isHovered: boolean) => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-container" style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: ${isHovered ? '0 8px 24px rgba(0,0,0,0.25)' : '0 4px 12px rgba(0,0,0,0.15)'};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          transform: ${isHovered ? 'scale(1.2)' : 'scale(1)'};
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    })
  }, [])

  // Create memoized icons for normal and hovered states
  const normalIcon = useMemo(() => getCustomIcon(false), [getCustomIcon]);
  const hoveredIcon = useMemo(() => getCustomIcon(true), [getCustomIcon]);

  return (
    <>
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #fef7ed 0%, #fff7ed 100%) !important;
        }
      `}</style>
      <MapContainer
        center={[7.9465, -1.0232]}
        zoom={7}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        <ZoomControl position="bottomright" />

        <MapController selectedAttraction={selectedAttraction} />
        <MapResizer />

        {attractions.map((attraction) => (
          <Marker
            key={attraction.id}
            position={[attraction.lat, attraction.lng]}
            icon={hoveredAttractionId === attraction.id ? hoveredIcon : normalIcon}
            title={attraction.name}
            eventHandlers={{
              click: () => onAttractionSelect(attraction),
            }}
          />
        ))}
      </MapContainer>
    </>
  )
}

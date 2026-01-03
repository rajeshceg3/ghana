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
    // Using type assertion to access _getIconUrl which is not in the type definition
    // eslint-disable-next-line
    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    })
  }, [])

  // Memoize icon creation to avoid unnecessary recreations
  const getCustomIcon = useCallback((isHovered: boolean, isSelected: boolean) => {
    // Colors derived from our primary "Indigo/Blue" or "Orange" logic
    // We decided on Primary = Indigo (Stripe-ish) but markers are locations,
    // often red or orange. Let's make them primary color (Indigo) for consistency.
    // Or maybe keep them Orange/Warm for contrast against the map.
    // Let's go with a very clean Indigo to match the new UI.
    const color = isSelected ? '#4338ca' : (isHovered ? '#6366f1' : '#4f46e5'); // Indigo 700, 500, 600

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-container" style="
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
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-map-container.leaflet-container {
          width: 100%;
          height: 100%;
          background: #f8fafc; /* Slate 50 */
          outline: none;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: white !important;
          color: #1e293b !important;
          border-bottom: 1px solid #e2e8f0 !important;
          transition: background 0.2s;
        }
        .leaflet-control-zoom a:hover {
          background: #f1f5f9 !important;
        }
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(4px);
          padding: 0 8px !important;
          border-top-left-radius: 6px;
          color: #64748b !important;
        }
      `}</style>
      <MapContainer
        center={[7.9465, -1.0232]}
        zoom={7}
        zoomControl={false}
        className="w-full h-full custom-map-container"
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
              icon={getCustomIcon(isHovered, isSelected)}
              title={attraction.name}
              eventHandlers={{
                click: () => onAttractionSelect(attraction),
                mouseover: () => onHover?.(attraction.id),
                mouseout: () => onLeave?.(),
              }}
            />
          )
        })}
      </MapContainer>
    </>
  )
}

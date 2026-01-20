"use client"

import { useMemo } from "react"
import { Marker, Tooltip } from "react-leaflet"
import L from "leaflet"
import { Attraction } from "@/lib/data"

interface MapMarkerProps {
  attraction: Attraction
  isSelected: boolean
  isHovered: boolean
  onSelect: (attraction: Attraction) => void
  onHover?: (id: number) => void
  onLeave?: () => void
}

export function MapMarker({
  attraction,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
}: MapMarkerProps) {

  const icon = useMemo(() => {
    const title = attraction.name;
    const id = attraction.id;

    // Escape the title to prevent XSS when injecting into HTML string
    const safeTitle = title
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Colors derived from our primary "Indigo/Blue"
    const color = isSelected ? '#4338ca' : (isHovered ? '#6366f1' : '#4f46e5'); // Indigo 700, 500, 600

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div id="marker-${id}"
             tabindex="0"
             role="button"
             aria-label="View details for ${safeTitle}"
             class="marker-container focus:outline-none focus:ring-4 focus:ring-primary/40 focus:ring-offset-2"
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
  }, [attraction.name, attraction.id, isSelected, isHovered])

  return (
    <Marker
      position={[attraction.lat, attraction.lng]}
      icon={icon}
      title={attraction.name}
      eventHandlers={{
        click: () => onSelect(attraction),
        mouseover: () => onHover?.(attraction.id),
        mouseout: () => onLeave?.(),
      }}
    >
      <Tooltip
        direction="top"
        offset={[0, -44]}
        opacity={1}
        className="font-sans font-medium text-sm shadow-md border-none px-3 py-1.5 rounded-md text-foreground"
      >
        {attraction.name}
      </Tooltip>
    </Marker>
  )
}

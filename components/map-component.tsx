"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, useMap, useMapEvents, Marker } from "react-leaflet"
import L from "leaflet"
import * as maplibregl from "maplibre-gl"
import "leaflet/dist/leaflet.css"
import { maplibreGL } from "@maplibre/maplibre-gl-leaflet"
import "maplibre-gl/dist/maplibre-gl.css"
import warmMapStyle from "@/vendor/warm-map/style.json"
import { Attraction } from "@/lib/data"
import { MapMarker } from "./map-marker"

// Warm paper basemap (worlds shared module): OpenFreeMap vector tiles,
// custom watercolor-wash style. Free public instance, no API key.
maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs")

function WarmPaperBasemap() {
  const map = useMap()
  useEffect(() => {
    const layer = maplibreGL({ style: warmMapStyle as any })
    layer.addTo(map)
    const element = map.getContainer() as HTMLElement & {_warmMap?: unknown}
    element._warmMap = layer.getMaplibreMap()
    map.attributionControl.addAttribution('<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> <a href="https://www.openmaptiles.org/" target="_blank">&copy; OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>')
    return () => {
      map.removeLayer(layer)
    }
  }, [map])
  return null
}

interface MapComponentProps {
  attractions: Attraction[]
  selectedAttraction: Attraction | null
  hoveredAttractionId: number | null
  onAttractionSelect: (attraction: Attraction) => void
  onHover?: (id: number) => void
  onLeave?: () => void
  command: {kind:string,id:number}
}

function MapController({ selectedAttraction, attractions, command }: { selectedAttraction: Attraction | null, attractions: Attraction[], command:{kind:string,id:number} }) {
  const map = useMap()

  useEffect(()=>{if(command.kind==="in")map.zoomIn(undefined,{animate:false});if(command.kind==="out")map.zoomOut(undefined,{animate:false});if(command.kind==="reset"){const b=L.latLngBounds(attractions.map(a=>[a.lat,a.lng]));if(b.isValid())map.fitBounds(b,{padding:[36,36],maxZoom:13,animate:false})}},[command,map,attractions])

  // Select without camera animation
  useEffect(() => {
    if (selectedAttraction) {
      map.flyTo([selectedAttraction.lat, selectedAttraction.lng], 13, {
        animate: false,
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
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: false, duration: 1 })
        }
      } else {
        // Reset to default Ghana view if no results
        map.flyTo([7.9465, -1.0232], 7, { animate: false, duration: 1 })
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
  command,
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
        maxZoom={18}
        zoomControl={false}
        className="w-full h-full custom-map-container"
        aria-label="Map of Ghana Attractions"
      >
        <WarmPaperBasemap />

        <MapController selectedAttraction={selectedAttraction} attractions={attractions} command={command} />
        <MapResizer />

        <ClusteredPlaces attractions={attractions} selectedAttraction={selectedAttraction} hoveredAttractionId={hoveredAttractionId} onAttractionSelect={onAttractionSelect} onHover={onHover} onLeave={onLeave} />
      </MapContainer>
    </>
  )
}

function ClusteredPlaces({attractions,selectedAttraction,hoveredAttractionId,onAttractionSelect,onHover,onLeave}:Omit<MapComponentProps,"command">) {
 const [,setRevision]=useState(0)
 const map=useMapEvents({zoomend:()=>setRevision(v=>v+1),moveend:()=>setRevision(v=>v+1)})
 const groups:Attraction[][]=[]
 for(const attraction of attractions){
   const p=map.latLngToContainerPoint([attraction.lat,attraction.lng])
   const group=groups.find(g=>g[0].id!==selectedAttraction?.id&&attraction.id!==selectedAttraction?.id&&map.latLngToContainerPoint([g[0].lat,g[0].lng]).distanceTo(p)<48)
   if(group)group.push(attraction);else groups.push([attraction])
 }
 return <>{groups.map(group=>group.length===1 ? <MapMarker key={group[0].id} attraction={group[0]} isSelected={selectedAttraction?.id===group[0].id} isHovered={hoveredAttractionId===group[0].id} onSelect={onAttractionSelect} onHover={onHover} onLeave={onLeave}/> : <ClusterMarker key={group.map(a=>a.id).join("-")} group={group}/>)}</>
}
function ClusterMarker({group}:{group:Attraction[]}) {
 const map=useMap()
 const center=L.latLngBounds(group.map(a=>[a.lat,a.lng])).getCenter()
 const icon=L.divIcon({className:"place-cluster",html:`<button type="button" aria-label="Explore ${group.length} nearby places">${group.length}</button>`,iconSize:[44,44],iconAnchor:[22,22]})
 return <Marker position={center} icon={icon} keyboard={false} eventHandlers={{click:()=>map.fitBounds(L.latLngBounds(group.map(a=>[a.lat,a.lng])),{padding:[60,60],maxZoom:16,animate:false})}}/>
}

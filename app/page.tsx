"use client"
import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { MapPin, Search, X, Plus, Minus, LocateFixed } from "lucide-react"
import { AttractionList } from "@/components/attraction-list"
import { AttractionDetails } from "@/components/attraction-details"
import { attractions, Attraction } from "@/lib/data"
import { Sheet, SheetContent, SheetTrigger, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { MapErrorBoundary } from "@/components/map-error-boundary"
const MapComponent = dynamic(() => import("@/components/map-component"), {ssr:false, loading:() => <div className="map-loading" role="status">Loading Ghana map...</div>})
export default function Page() {
  const [selected, setSelected] = useState<Attraction|null>(null)
  const [query, setQuery] = useState("")
  const [hovered, setHovered] = useState<number|null>(null)
  const [open, setOpen] = useState(false)
  const [command, setCommand] = useState({kind:"reset",id:0})
  const trigger = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const returnTo = useRef<HTMLElement|null>(null)
  const filtered = useMemo(()=>attractions.filter(a => (a.name+" "+a.category).toLowerCase().includes(query.toLowerCase())),[query])
  const select = useCallback((a:Attraction)=>{returnTo.current=document.activeElement as HTMLElement;setOpen(false);setSelected(a)},[])
  const close = useCallback(()=>{setSelected(null); requestAnimationFrame(()=>{const target=returnTo.current; (target?.isConnected ? target : trigger.current)?.focus()})},[])
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setSelected(null);setOpen(true)}};document.addEventListener("keydown",key);return()=>document.removeEventListener("keydown",key)},[])
  const act=(kind:string)=>setCommand(c=>({kind,id:c.id+1}))
  return <div className="ghana-app">
    <header className="ghana-header"><h1><MapPin aria-hidden="true"/>Ghana<span>.</span></h1>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild><button ref={trigger} className="explore-button" aria-label="Explore Ghana" onClick={()=>setSelected(null)}>Explore <Search size={18} aria-hidden="true"/></button></SheetTrigger>
        <SheetContent side="right" className="ghana-explore" onOpenAutoFocus={(e)=>{e.preventDefault();input.current?.focus()}}>
          <div className="explore-heading"><SheetTitle>Explore Ghana</SheetTitle><SheetDescription className="sr-only">Search places or adjust the map.</SheetDescription></div>
          <div className="search-field"><Search size={18} aria-hidden="true"/><input ref={input} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a place or category" aria-label="Search attractions" onKeyDown={e=>{if(e.key==="Enter"&&filtered[0])select(filtered[0])}}/>{query&&<button onClick={()=>{setQuery("");input.current?.focus()}} aria-label="Clear search"><X size={18}/></button>}</div>
          <div className="map-tools" aria-label="Map tools"><button onClick={()=>act("in")} aria-label="Zoom in"><Plus size={18}/></button><button onClick={()=>act("out")} aria-label="Zoom out"><Minus size={18}/></button><button onClick={()=>{setQuery("");setSelected(null);act("reset")}}><LocateFixed size={18}/>Reset map</button></div>
          <div className="explore-results"><AttractionList attractions={filtered} selectedAttractionId={selected?.id||null} hoveredAttractionId={hovered} onSelect={select} onHover={setHovered} onLeave={()=>setHovered(null)}/></div>
        </SheetContent>
      </Sheet>
    </header>
    <main className="ghana-map"><MapErrorBoundary><MapComponent attractions={filtered} selectedAttraction={selected} hoveredAttractionId={hovered} onAttractionSelect={select} onHover={setHovered} onLeave={()=>setHovered(null)} command={command}/></MapErrorBoundary></main>
    {selected&&<AttractionDetails attraction={selected} onClose={close}/>}
  </div>
}

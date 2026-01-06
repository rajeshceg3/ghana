import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, X, ArrowRight, Share2, Info } from "lucide-react"
import Image from "next/image"
import { Attraction, categoryColors } from "@/lib/data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog"

interface AttractionDetailsProps {
  attraction: Attraction
  onClose: () => void
}

export function AttractionDetails({ attraction, onClose }: AttractionDetailsProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-[700px] border-0 shadow-2xl bg-background/95 backdrop-blur-xl rounded-2xl gap-0 ring-1 ring-black/5">
        <DialogHeader className="sr-only">
          <DialogTitle>{attraction.name}</DialogTitle>
          <DialogDescription>Details about {attraction.name}</DialogDescription>
        </DialogHeader>

        {/* Hero Section */}
        <div className="relative w-full h-[320px] bg-muted group">
          <Image
            src={attraction.image || "/placeholder.svg"}
            alt={attraction.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          {/* Enhanced Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Floating Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md z-20 border border-white/20 transition-all duration-300 hover:scale-105"
            onClick={onClose}
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="absolute bottom-0 left-0 p-8 w-full z-10 text-white">
             <div className="flex items-center gap-3 mb-3">
                <Badge className={`border-0 backdrop-blur-md shadow-sm font-semibold px-3 py-1 text-xs tracking-wide uppercase ${categoryColors[attraction.category] || "bg-white/90 text-black"}`}>
                    {attraction.category}
                </Badge>
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold">{attraction.rating}</span>
                </div>
             </div>

             <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2 text-white drop-shadow-md">{attraction.name}</h2>

             <div className="flex items-center gap-4 text-white/90 font-medium text-sm mt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/80" />
                  <span>{attraction.duration}</span>
                </div>
                <div className="w-1 h-1 bg-white/40 rounded-full" />
                <div className="flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-white/80" />
                   <span>Accra, Ghana</span>
                </div>
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 bg-background relative z-10">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                <div className="space-y-6">
                    <div className="prose prose-slate max-w-none">
                        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4" /> About
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed font-normal">
                          {attraction.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Highlights</h3>
                        <div className="flex flex-wrap gap-2">
                          {attraction.highlights.map((highlight) => (
                            <Badge
                              key={highlight}
                              variant="secondary"
                              className="px-3 py-1.5 bg-muted/50 text-foreground hover:bg-muted border border-border/50 text-sm font-medium transition-colors"
                            >
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                    </div>
                </div>

                {/* Actions Panel */}
                <div className="flex flex-col gap-3 p-6 bg-muted/30 rounded-xl border border-border/50 h-fit">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Plan your visit</h3>
                    <p className="text-xs text-muted-foreground mb-4">Get the best route or share with friends.</p>

                    <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 font-semibold transition-all hover:-translate-y-0.5">
                        Get Directions
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button size="lg" variant="outline" className="w-full border-input hover:bg-background hover:text-foreground font-medium transition-all">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Location
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, X, ArrowRight, Share2 } from "lucide-react"
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
      <DialogContent className="p-0 overflow-hidden sm:max-w-[700px] border-0 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] bg-background rounded-2xl gap-0 ring-1 ring-white/10">
        <DialogHeader className="sr-only">
          <DialogTitle>{attraction.name}</DialogTitle>
          <DialogDescription>Details about {attraction.name}</DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-64 sm:h-72 bg-muted">
          <Image
            src={attraction.image || "/placeholder.svg"}
            alt={attraction.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md z-10"
            onClick={onClose}
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
             <Badge className="mb-3 border-0 bg-white/90 text-black backdrop-blur-md hover:bg-white shadow-sm font-medium px-3 py-1">
                {attraction.category}
             </Badge>
             <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2 drop-shadow-sm">{attraction.name}</h2>
             <div className="flex items-center gap-4 text-foreground/80 font-medium text-sm">
                <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-md px-2 py-1 rounded-md shadow-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{attraction.rating}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-md px-2 py-1 rounded-md shadow-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{attraction.duration}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 pt-4 flex flex-col sm:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">About</h3>
            <p className="text-base text-foreground leading-relaxed mb-6 font-normal">
              {attraction.description}
            </p>

            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Highlights</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {attraction.highlights.map((highlight, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 border-0 text-sm font-normal"
                >
                  {highlight}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3 mt-auto">
              <Button size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 font-medium">
                Get Directions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="flex-1 border-input hover:bg-muted font-medium">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

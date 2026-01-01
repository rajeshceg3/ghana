import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, Camera } from "lucide-react"
import Image from "next/image"
import { Attraction, categoryColors } from "@/lib/data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface AttractionDetailsProps {
  attraction: Attraction
  onClose: () => void
}

export function AttractionDetails({ attraction, onClose }: AttractionDetailsProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-[600px] border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{attraction.name}</DialogTitle>
          <DialogDescription>Details about {attraction.name}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-full max-h-[80vh] overflow-y-auto md:overflow-visible">
          <div className="w-full md:w-56 h-48 md:h-auto bg-gradient-to-br from-amber-100 to-orange-100 relative shrink-0">
            <Image
              src={attraction.image || "/placeholder.svg"}
              alt={attraction.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 224px"
            />
            <div className="absolute top-3 left-3">
              <Badge
                className={`text-xs font-light ${categoryColors[attraction.category]}`}
              >
                {attraction.category}
              </Badge>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col">
            <div className="mb-3">
              <h3 className="text-xl font-light text-gray-900 mb-1">{attraction.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="font-light">{attraction.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-light">{attraction.duration}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 font-light leading-relaxed mb-4 flex-1">
              {attraction.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {attraction.highlights.map((highlight, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs font-light bg-amber-50 text-amber-700 border-amber-200"
                >
                  {highlight}
                </Badge>
              ))}
            </div>

            <div className="flex space-x-3 mt-auto">
              <Button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 font-light flex-1 sm:flex-none">
                <Camera className="w-4 h-4 mr-2" />
                View Gallery
              </Button>
              <Button
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50 font-light bg-transparent flex-1 sm:flex-none"
              >
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

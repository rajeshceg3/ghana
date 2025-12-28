import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, X, Camera } from "lucide-react"
import Image from "next/image"
import { Attraction, categoryColors } from "@/lib/data"

interface AttractionDetailsProps {
  attraction: Attraction
  onClose: () => void
}

export function AttractionDetails({ attraction, onClose }: AttractionDetailsProps) {
  return (
    <div className="absolute bottom-6 left-6 right-6 z-[400] pointer-events-none">
      <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl pointer-events-auto transform transition-all duration-700 ease-out animate-in slide-in-from-bottom-4">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-48 h-32 md:h-auto bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
              <Image
                src={attraction.image || "/placeholder.svg"}
                alt={attraction.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 192px"
              />
              <div className="absolute top-3 left-3">
                <Badge
                  className={`text-xs font-light ${categoryColors[attraction.category]}`}
                >
                  {attraction.category}
                </Badge>
              </div>
            </div>

            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
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

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
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

              <div className="flex space-x-3">
                <Button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 font-light">
                  <Camera className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 font-light bg-transparent"
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

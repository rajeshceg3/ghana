export interface Attraction {
  id: number
  name: string
  category: "Historical" | "Nature" | "Wildlife"
  rating: number
  duration: string
  lat: number
  lng: number
  location: string
  description: string
  image: string
  highlights: string[]
}

export const attractions: Attraction[] = [
  {
    id: 1,
    name: "Cape Coast Castle",
    category: "Historical",
    rating: 4.8,
    duration: "2-3 hours",
    lat: 5.1053,
    lng: -1.2466,
    location: "Cape Coast, Central Region",
    description:
      "A UNESCO World Heritage site, this 17th-century castle stands as a powerful reminder of the Atlantic slave trade.",
    image: "/cape-coast-castle-ghana.png",
    highlights: ["UNESCO World Heritage", "Historical significance", "Ocean views"],
  },
  {
    id: 2,
    name: "Kakum National Park",
    category: "Nature",
    rating: 4.7,
    duration: "4-5 hours",
    lat: 5.35,
    lng: -1.3833,
    location: "Cape Coast, Central Region",
    description: "Experience the rainforest canopy on suspended walkways 40 meters above the ground.",
    image: "/placeholder.svg",
    highlights: ["Canopy walkway", "Rainforest", "Wildlife viewing"],
  },
  {
    id: 3,
    name: "Mole National Park",
    category: "Wildlife",
    rating: 4.6,
    duration: "Full day",
    lat: 9.25,
    lng: -1.85,
    location: "Larabanga, Savannah Region",
    description: "Ghana's largest wildlife refuge, home to elephants, antelopes, and over 300 bird species.",
    image: "/mole-national-park-elephants.png",
    highlights: ["Elephant viewing", "Safari experience", "Bird watching"],
  },
  {
    id: 4,
    name: "Wli Waterfalls",
    category: "Nature",
    rating: 4.5,
    duration: "3-4 hours",
    lat: 7.1167,
    lng: 0.6,
    location: "Wli, Volta Region",
    description: "The highest waterfall in Ghana, cascading from a height of approximately 60 meters.",
    image: "/placeholder.svg",
    highlights: ["Highest waterfall", "Hiking trail", "Swimming opportunity"],
  },
  {
    id: 5,
    name: "Elmina Castle",
    category: "Historical",
    rating: 4.7,
    duration: "2-3 hours",
    lat: 5.0833,
    lng: -1.35,
    location: "Elmina, Central Region",
    description: "The oldest European building in existence south of the Sahara, built by the Portuguese in 1482.",
    image: "/placeholder-b1790.png",
    highlights: ["Oldest European building", "Portuguese architecture", "Coastal views"],
  },
  {
    id: 6,
    name: "Lake Volta",
    category: "Nature",
    rating: 4.4,
    duration: "Full day",
    lat: 7.5,
    lng: -0.5,
    location: "Volta Region",
    description: "One of the world's largest artificial lakes, perfect for boat trips and fishing.",
    image: "/placeholder-9l20x.png",
    highlights: ["Largest artificial lake", "Boat trips", "Fishing"],
  },
]

export const categoryColors = {
  Historical: "bg-amber-100 text-amber-800 border-amber-200",
  Nature: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Wildlife: "bg-orange-100 text-orange-800 border-orange-200",
}

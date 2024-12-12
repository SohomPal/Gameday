export interface Review {
  source: string
  rating: string
  quote: string
}

export interface Feature {
  title: string
  description: string
  imageUrl: string
  accentColor: string
}

export interface Game {
  id: string
  title: string
  description: string
  trailerUrl: string
  purchaseUrl: string
  features: Feature[]
  backgroundImage: string
  heroImage: string
  expandingImage: string
  price: string
  releaseDate: string
  reviews: Review[]
  accentColor: 'yellow' | 'red' | 'orange' | 'purple' | 'green' | 'blue' | 'amber'
}


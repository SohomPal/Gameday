export interface Review {
    source: string
    rating: string
    quote: string
  }
  
  export interface Game {
    id: string
    title: string
    description: string
    trailerUrl: string
    purchaseUrl: string
    features: {
      title: string
      description: string
      imageUrl: string
      accentColor: string
    }[]
    heroImage: string
    expandingImage: string
    price: string
    releaseDate: string
    reviews: Review[]
    accentColor: 'yellow' | 'red' | 'orange' | 'purple' | 'green' | 'blue'
  }
  
  
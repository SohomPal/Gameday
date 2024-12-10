import { Game } from '@/types/game'

export async function getDailyGame(): Promise<Game> {
  // This would be replaced with your actual database fetch
  return {
    id: "1",
    title: "Cyberpunk 2077",
    description: "Experience the future of gaming in Night City",
    trailerUrl: "/placeholder/videos/trailer.mp4",
    purchaseUrl: "https://store.steampowered.com/cyberpunk2077",
    features: [
      {
        title: "Open World",
        description: "Explore the vast metropolis of Night City",
        imageUrl: "/placeholder/images/cyberpunk2.jpg",
        accentColor: '#8B5CF6'
      },
      {
        title: "Character Customization",
        description: "Create your unique character",
        imageUrl: "/placeholder/images/cyberpunk.jpeg",
        accentColor: '#8B5CF6'
      },
      {
        title: "Engaging Story",
        description: "Immerse yourself in a rich narrative",
        imageUrl: "/placeholder/images/cyberpunk3.webp",
        accentColor: '#8B5CF6'
      }
    ],
    heroImage: "/placeholder/images/hero-image.jpg",
    expandingImage: "/placeholder/images/cyberpunk_large.jpg",
    price: "$60.00",
    releaseDate: "2020-12-10",
    reviews: [
        {
          source: "IGN",
          rating: "9/10",
          quote: "Cyberpunk 2077 is a stunning and deeply engaging RPG."
        },
        {
          source: "GameSpot",
          rating: "8/10",
          quote: "A fascinating world to explore with great characters and stories."
        }
      ],
      accentColor: 'purple'
  }
}


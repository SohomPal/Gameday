import { getDailyGame } from '@/utils/get-daily-game'
import { NavBar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { ExpandingSection } from '@/components/expanding-section'
import { ReviewsSection } from '@/components/reviews-section'
import { PurchaseSection } from '@/components/purchase-section'
import { Game, Review } from '@/types/game'


export const revalidate = 60 // Revalidate once per minute

async function getGameData(): Promise<Game | null> {
  try {
    return await getDailyGame()
  } catch (error) {
    console.error('Failed to fetch game data:', error)
    return null
  }
}

function getAverageRating(reviews: Review[]): number {
  if (!reviews.length) return 0; // No reviews, return 0.

  // Step 1: Extract the numeric rating (e.g., "8/10" -> 8).
  const ratings = reviews
    .map(review => {
      const [ratingValue] = review.rating.split("/"); // Get the part before "/"
      return parseInt(ratingValue, 10); // Convert to integer
    })
    .filter(rating => !isNaN(rating)); // Ensure valid numbers only

  if (!ratings.length) return 0; // If no valid ratings, return 0.

  // Step 2: Compute the average.
  const sum = ratings.reduce((acc, curr) => acc + curr, 0);
  const average = sum / ratings.length;

  // Step 3: Round to the nearest integer.
  return Math.round(average);
}

export default async function Home() {
  const game = await getGameData()

  if (!game) {
    return (
      <main className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Oops! No Game Available</h1>
          <p className="text-xl">Please check back later for today&apos;s featured game.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-black min-h-screen">
      <NavBar themeColor={game.accentColor} />
      <HeroSection
        videoUrl={game.trailerUrl}
        title={game.title}
        heroImage={game.heroImage}
        themeColor={game.accentColor}
      />
      <FeaturesSection features={game.features} />
      <ExpandingSection imageUrl={game.expandingImage} />
      <ReviewsSection reviews={game.reviews} />
      <PurchaseSection
        price={game.price}
        purchaseUrl={game.purchaseUrl}
        accentColor={game.accentColor}
        title={game.title}
        rating={getAverageRating(game.reviews)/2}
      />
    </main>
  )
}
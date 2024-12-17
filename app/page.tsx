import { getDailyGame } from '@/utils/get-daily-game'
import { NavBar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { ExpandingSection } from '@/components/expanding-section'
import { ReviewsSection } from '@/components/reviews-section'
import { PurchaseSection } from '@/components/purchase-section'
import { Review } from '@/types/game'

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
  const game = await getDailyGame()

  if (!game) {
    return <div>No game available today. Please check back later.</div>
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
      <FeaturesSection features={game.features} backgroundImageUrl={game.backgroundImage}/>
      <ExpandingSection imageUrl={game.expandingImage} />
      <ReviewsSection reviews={game.reviews} />
      <PurchaseSection
        title={game.title}
        price={game.price}
        purchaseUrl={game.purchaseUrl}
        accentColor={game.accentColor}
        rating={getAverageRating(game.reviews)/2}
      />
    </main>
  )
}
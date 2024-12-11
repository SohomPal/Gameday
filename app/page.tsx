import { getDailyGame } from '@/utils/get-daily-game'
import { NavBar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { ExpandingSection } from '@/components/expanding-section'
import { ReviewsSection } from '@/components/reviews-section'
import { PurchaseSection } from '@/components/purchase-section'

export default async function Home() {
  const game = await getDailyGame()

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
      />
    </main>
  )
}


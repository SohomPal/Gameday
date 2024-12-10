import { Review } from '@/types/game'

interface ReviewsSectionProps {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Critics' Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-zinc-900 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-xl">{review.source}</span>
                <span className="text-2xl font-bold text-yellow-400">{review.rating}</span>
              </div>
              <p className="text-gray-300 italic">"{review.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


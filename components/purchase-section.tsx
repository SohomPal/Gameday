'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

interface PurchaseSectionProps {
  price: string
  purchaseUrl: string
  accentColor: string
  title: string
  rating: number
}

export function PurchaseSection({ price, purchaseUrl, accentColor, title, rating }: PurchaseSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [fontSize, setFontSize] = useState(48) // Starting font size

  useEffect(() => {
    const resizeTitle = () => {
      if (titleRef.current) {
        let currentFontSize = fontSize
        titleRef.current.style.fontSize = `${currentFontSize}px`

        while (titleRef.current.scrollWidth > titleRef.current.offsetWidth && currentFontSize > 16) {
          currentFontSize--
          titleRef.current.style.fontSize = `${currentFontSize}px`
        }

        setFontSize(currentFontSize)
      }
    }

    resizeTitle()
    window.addEventListener('resize', resizeTitle)

    return () => window.removeEventListener('resize', resizeTitle)
  }, [title, fontSize])

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-${accentColor}-900 p-4`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl max-w-2xl w-full"
      >
        <motion.h2 
          ref={titleRef}
          className="font-bold text-white mb-4 whitespace-nowrap overflow-hidden"
          style={{ fontSize: `${fontSize}px` }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Get {title} Now
        </motion.h2>
        <motion.div 
          className="flex justify-center items-center space-x-2 mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill={star <= rating ? 'gold' : 'none'}
              stroke="gold"
              strokeWidth="1"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </motion.div>
        <motion.div 
          className="text-5xl md:text-7xl font-bold mb-8 text-white"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {price}
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="space-y-4"
        >
          <Button
            size="lg"
            className={`bg-${accentColor}-500 hover:bg-${accentColor}-600 text-white text-xl px-10 py-6 rounded-full shadow-lg transform transition duration-300 hover:scale-105 w-full sm:w-auto`}
            onClick={() => window.open(purchaseUrl, '_blank')}
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            Purchase Game
          </Button>
          <p className="text-white/70 text-sm">Secure payment • Instant download</p>
        </motion.div>
      </motion.div>
    </div>
  )
}


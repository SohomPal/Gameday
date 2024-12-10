'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface PurchaseSectionProps {
  price: string
  purchaseUrl: string
  accentColor: string
}

export function PurchaseSection({ price, purchaseUrl, accentColor }: PurchaseSectionProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-${accentColor}-900`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
          Get it now for {price}
        </h2>
        <Button
          size="lg"
          className={`bg-${accentColor}-500 text-white hover:bg-${accentColor}-600 text-lg px-8 py-6`}
          onClick={() => window.location.href = purchaseUrl}
        >
          Purchase Game
        </Button>
      </motion.div>
    </div>
  )
}


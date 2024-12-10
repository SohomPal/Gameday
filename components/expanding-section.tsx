'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ExpandingSectionProps {
  imageUrl: string
}

export function ExpandingSection({ imageUrl }: ExpandingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <div ref={sectionRef} className="h-screen relative overflow-hidden">
      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-0"
      >
        <img
          src={imageUrl}
          alt="Game Screenshot"
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  )
}


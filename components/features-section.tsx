'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

function getColorShades(color: string): [string, string] {
  const colorMap: { [key: string]: [string, string] } = {
    yellow: ['#FFF9C4', '#FBC02D'],
    purple: ['#E1BEE7', '#7B1FA2'],
    green: ['#C8E6C9', '#388E3C'],
    blue: ['#BBDEFB', '#1976D2'],
    red: ['#FFCDD2', '#D32F2F'],
    orange: ['#FFE0B2', '#F57C00'],
    pink: ['#F8BBD0', '#C2185B'],
    teal: ['#B2DFDB', '#00796B'],
    indigo: ['#C5CAE9', '#303F9F'],
    cyan: ['#B2EBF2', '#0097A7'],
    amber: ['#FFECB3', '#FFA000'],
  }

  return colorMap[color.toLowerCase()] || ['#E0E0E0', '#757575']
}

interface Feature {
  title: string
  description: string
  imageUrl: string
  accentColor: string
}

interface FeaturesSectionProps {
  features: Feature[]
  backgroundImageUrl?: string
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -50 : 50, 0, index % 2 === 0 ? 50 : -50]
  )

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  const imageX = useSpring(useTransform(mouseX, [0, 300], [-10, 10]), { stiffness: 400, damping: 30 })
  const imageY = useSpring(useTransform(mouseY, [0, 300], [-10, 10]), { stiffness: 400, damping: 30 })

  const [lightShade, darkShade] = getColorShades(feature.accentColor)

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, x }}
      className="min-h-screen flex items-center justify-center py-20 px-4 md:px-20"
    >
      <div className={`w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
        index % 2 === 0 ? '' : 'md:flex-row-reverse'
      }`}>
        <div className={`space-y-4 md:space-y-8 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${lightShade}, ${darkShade})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {feature.title}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 leading-relaxed">
            {feature.description}
          </p>
        </div>
        <motion.div
          style={{ scale }}
          className={`relative w-full aspect-square overflow-hidden rounded-2xl shadow-2xl ${
            index % 2 === 0 ? 'md:order-2' : 'md:order-1'
          }`}
          onMouseMove={handleMouseMove}
        >
          <motion.img
            src={feature.imageUrl}
            alt={feature.title}
            className="w-full h-full object-cover"
            style={{
              x: imageX,
              y: imageY,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export function FeaturesSection({ features, backgroundImageUrl }: FeaturesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={sectionRef} className="relative bg-black text-white overflow-hidden">
      {backgroundImageUrl && (
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            opacity: backgroundOpacity,
          }}
        />
      )}
      <div className="relative z-10">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  )
}


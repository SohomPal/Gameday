'use client'

import { NavBar } from '@/components/navbar'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function AboutPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <main className="bg-gradient-to-b from-black to-purple-900 min-h-screen text-white">
      <NavBar themeColor="purple" />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About GameDay
        </motion.h1>
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.p 
            className="text-xl md:text-2xl text-purple-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to GameDay, your daily portal to the thrilling universe of video games. Our mission is to showcase a new, exciting game every single day, helping you uncover your next gaming obsession.
          </motion.p>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <img 
              src="/placeholder/images/intense.webp" 
              alt="Exciting gaming moment" 
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent"></div>
            <motion.div 
              className="absolute bottom-4 left-4 text-2xl font-bold"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
            >
              Discover New Worlds
            </motion.div>
          </motion.div>

          <div className="space-y-6">
            <motion.div 
              className="bg-purple-800 rounded-lg p-6 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => toggleSection('whatWeDo')}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-pink-300">What We Do</h2>
                <ChevronDown className={`transform transition-transform ${expandedSection === 'whatWeDo' ? 'rotate-180' : ''}`} />
              </div>
              {expandedSection === 'whatWeDo' && (
                <motion.ul 
                  className="list-disc pl-6 space-y-4 text-lg md:text-xl mt-4 text-purple-200"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <li>Curate a diverse selection of games across various genres and platforms</li>
                  <li>Provide in-depth looks at each featured game, including trailers, screenshots, and key features</li>
                  <li>Offer unbiased reviews and ratings from trusted sources</li>
                  <li>Update daily, ensuring you always have something new to explore</li>
                </motion.ul>
              )}
            </motion.div>
          </div>

          <motion.p 
            className="text-xl md:text-2xl text-purple-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Whether you&apos;re a casual gamer looking for your next adventure, or a hardcore enthusiast staying on top of the latest releases, GameDay is your daily dose of gaming excitement.
          </motion.p>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <img 
              src="/placeholder/images/diverse.jpeg" 
              alt="Diverse gaming genres" 
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent"></div>
            <motion.div 
              className="absolute bottom-4 right-4 text-2xl font-bold"
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 100 }}
            >
              Endless Possibilities
            </motion.div>
          </motion.div>

          <motion.p 
            className="text-xl md:text-2xl font-semibold text-pink-300 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            Join us every day to discover, explore, and fall in love with new games. Your next favorite game could be just a day away!
          </motion.p>
        </div>
      </div>
    </main>
  )
}


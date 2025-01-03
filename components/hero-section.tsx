'use client'

import { useRef, useState, useEffect } from 'react'

interface HeroSectionProps {
  videoUrl: string
  title: string
  heroImage: string
  themeColor: string
}

export function HeroSection({ videoUrl, title, heroImage, themeColor }: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isTitleVisible, setIsTitleVisible] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
      setIsTitleVisible(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current && !videoRef.current.muted) {
        videoRef.current.muted = true
        setIsMuted(true)
      }
      setIsTitleVisible(true)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const renderTitle = (title: string) => {
    return title.split('').map((char, index) => {
      if (char === ' ') {
        return <span key={index}>&nbsp;</span>
      }
      return (
        <span 
          key={index} 
          className="relative inline-block"
        >
          <span className="absolute inset-0 text-black" style={{ textShadow: '2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black' }}>
            {char}
          </span>
          <span className={`relative z-10 text-${themeColor}-500`}>
            {char}
          </span>
        </span>
      )
    })
  }

  return (
    <div className="relative h-screen w-full overflow-hidden pt-16" onClick={toggleMute}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={heroImage}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-center transition-opacity duration-300 ${isTitleVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {renderTitle(title)}
          </h1>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useRef, useState, useEffect } from 'react'

interface HeroSectionProps {
  videoUrl: string
  title: string
  heroImage: string
}

export function HeroSection({ videoUrl, title, heroImage }: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const unmute = () => {
    if (videoRef.current && isMuted) {
      videoRef.current.muted = false
      setIsMuted(false)
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 10; // Start 10 seconds in
      videoRef.current.play().catch(error => {
        console.error("Error attempting to play video:", error);
      });
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden pt-16" onClick={unmute}>
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
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

interface NavBarProps {
  themeColor: string
}

export function NavBar({ themeColor }: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleGameDayClick = () => {
    if (pathname === '/') {
      scrollToTop()
    } else {
      router.push('/')
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/50 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={handleGameDayClick}
            className={`text-3xl font-extrabold text-${themeColor}-500`}
          >
            GameDay
          </button>
          <div className="flex items-center space-x-4">
            {pathname !== '/' && (
              <Button 
                onClick={() => router.push('/')}
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Home
              </Button>
            )}
            {pathname === '/' && (
              <Button 
                onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Buy Now
              </Button>
            )}
            <Link href="/about">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}


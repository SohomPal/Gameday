'use client'

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'

export function HeaderTab() {
  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-white text-xl font-bold">GameDay</div>
          <Button 
            onClick={scrollToBottom}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black transition-colors"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </header>
  )
}


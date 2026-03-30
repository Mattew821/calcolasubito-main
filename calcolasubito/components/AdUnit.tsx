'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface AdUnitProps {
  adSlot: string
  format?: 'auto' | 'horizontal' | 'vertical'
}

export default function AdUnit({ adSlot, format = 'auto' }: AdUnitProps) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className="my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4449622526771169"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}

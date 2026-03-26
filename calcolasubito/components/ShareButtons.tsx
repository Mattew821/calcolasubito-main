'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { Share2, Facebook, Linkedin, Twitter } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  description: string
  url?: string
}

const THROTTLE_DELAY = 500 // milliseconds

export function ShareButtons({
  title,
  description,
  url: providedUrl,
}: ShareButtonsProps) {
  const [url, setUrl] = useState(providedUrl || '')
  const [isReady, setIsReady] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const lastShareTimeRef = useRef(0)

  // Get URL from browser after hydration
  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setUrl(window.location.href)
    }
    setIsReady(true)
  }, [url])

  const handleShare = useMemo(
    () => async () => {
      // Throttle: prevent rapid-clicking
      const now = Date.now()
      if (now - lastShareTimeRef.current < THROTTLE_DELAY) {
        return
      }
      lastShareTimeRef.current = now

      if (!navigator.share) {
        return
      }

      try {
        setIsSharing(true)
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (error) {
        // Ignore AbortError (user cancelled share dialog)
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error)
        }
      } finally {
        setIsSharing(false)
      }
    },
    [title, description, url]
  )

  // Don't render if URL is not available
  if (!isReady || !url) {
    return null
  }

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=CalcolaSubito`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  return (
    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
      <span className="text-sm font-medium text-gray-600">Condividi:</span>

      {/* Native share (mobile) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Condividi"
          aria-label="Condividi questa pagina"
        >
          <Share2 className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
        title="Condividi su Facebook"
        aria-label="Condividi su Facebook"
      >
        <Facebook className="w-5 h-5" aria-hidden="true" />
      </a>

      {/* Twitter/X */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
        title="Condividi su Twitter"
        aria-label="Condividi su Twitter"
      >
        <Twitter className="w-5 h-5" aria-hidden="true" />
      </a>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
        title="Condividi su LinkedIn"
        aria-label="Condividi su LinkedIn"
      >
        <Linkedin className="w-5 h-5" aria-hidden="true" />
      </a>
    </div>
  )
}

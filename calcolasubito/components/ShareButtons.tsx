'use client'

import { Share2, Facebook, Linkedin, Twitter } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  description: string
  url?: string
}

export function ShareButtons({
  title,
  description,
  url = typeof window !== 'undefined' ? window.location.href : '',
}: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=CalcolaSubito`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    }
  }

  return (
    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
      <span className="text-sm font-medium text-gray-600">Condividi:</span>

      {/* Native share (mobile) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleShare}
          className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
          title="Condividi"
        >
          <Share2 className="w-5 h-5" />
        </button>
      )}

      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
        title="Condividi su Facebook"
      >
        <Facebook className="w-5 h-5" />
      </a>

      {/* Twitter/X */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
        title="Condividi su Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-gray-600 hover:text-blue-600"
        title="Condividi su LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </a>
    </div>
  )
}

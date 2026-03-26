'use client'

import Link from 'next/link'
import { Calculator } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 hover:text-blue-700">
          <Calculator className="w-6 h-6" />
          <span>CalcolaSubito.it</span>
        </Link>

        {/* Menu Mobile */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors" aria-label="Chi siamo">
            Chi Siamo
          </Link>
          <a href="#calcolatori" className="text-gray-600 hover:text-blue-600 transition-colors">
            Calcolatori
          </a>
          <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
            Privacy
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3">
          <Link href="/" className="block py-2 text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="block py-2 text-gray-600 hover:text-blue-600">
            Chi Siamo
          </Link>
          <a href="#calcolatori" className="block py-2 text-gray-600 hover:text-blue-600">
            Calcolatori
          </a>
          <Link href="/privacy" className="block py-2 text-gray-600 hover:text-blue-600">
            Privacy
          </Link>
        </div>
      )}
    </header>
  )
}

'use client'

import Link from 'next/link'
import { Calculator, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/#calcolatori', label: 'Calcolatori' },
  { href: '/about', label: 'Chi Siamo' },
  { href: '/privacy', label: 'Privacy' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-display font-bold text-lg text-cyan-800"
          aria-label="Vai alla home di CalcolaSubito"
        >
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 transition-transform duration-300 group-hover:scale-105">
            <Calculator className="w-5 h-5" />
          </span>
          <span>CalcolaSubito</span>
        </Link>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="hidden md:flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-600 hover:text-cyan-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

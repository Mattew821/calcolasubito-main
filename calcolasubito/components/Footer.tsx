'use client'

import Link from 'next/link'
import { BASE_URL } from '@/lib/site-config'
import { useAppPreferences } from '@/components/AppPreferencesProvider'

const quickLinks = [
  { href: '/', key: 'home' as const },
  { href: '/#calcolatori', key: 'calculators' as const },
  { href: '/about', key: 'about' as const },
  { href: '/privacy', key: 'privacy' as const },
]

const featuredCalculators = [
  { href: '/rata-mutuo', label: 'Rata Mutuo' },
  { href: '/rata-prestito', label: 'Rata Prestito' },
  { href: '/scorporo-iva', label: 'Scorporo IVA' },
  { href: '/indice-massa-corporea', label: 'BMI' },
  { href: '/fabbisogno-calorico', label: 'Fabbisogno Calorico' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { text } = useAppPreferences()

  return (
    <footer className="mt-14 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-3">{text.common.brandName}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{text.footer.description}</p>
            <p className="mt-3 text-xs text-slate-500">
              {text.footer.activeDomain}: {BASE_URL}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">{text.footer.navigation}</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link text-slate-400 hover:text-cyan-300 transition-colors">
                    {text.header.nav[item.key]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/cookie" className="footer-link text-slate-400 hover:text-cyan-300 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">{text.footer.topCalculators}</h3>
            <ul className="space-y-2 text-sm">
              {featuredCalculators.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link text-slate-400 hover:text-cyan-300 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-slate-500">
          <p>
            © {currentYear} {text.common.brandName}. {text.footer.rightsReserved}
          </p>
          <p>{text.footer.localExecution}</p>
        </div>
      </div>
    </footer>
  )
}

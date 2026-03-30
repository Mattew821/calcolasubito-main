import Link from 'next/link'
import { BASE_URL } from '@/lib/site-config'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/#calcolatori', label: 'Calcolatori' },
  { href: '/about', label: 'Chi Siamo' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookie', label: 'Cookie Policy' },
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

  return (
    <footer className="mt-14 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-3">CalcolaSubito</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Portale italiano di calcolatori online per finanza, fisco, salute, scuola e utilita quotidiane.
            </p>
            <p className="mt-3 text-xs text-slate-500">Dominio attivo: {BASE_URL}</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Navigazione</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-cyan-300 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Calcolatori Top</h3>
            <ul className="space-y-2 text-sm">
              {featuredCalculators.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-cyan-300 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-slate-500">
          <p>© {currentYear} CalcolaSubito. Tutti i diritti riservati.</p>
          <p>I calcoli sono eseguiti localmente nel browser dell&apos;utente.</p>
        </div>
      </div>
    </footer>
  )
}

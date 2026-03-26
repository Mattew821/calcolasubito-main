import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-white mb-3">CalcolaSubito.it</h3>
            <p className="text-sm text-gray-400">
              Suite di calcolatori online gratuiti per l&apos;Italia. Calcola IVA, busta paga, IMU e molto altro.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-3">Link Utili</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-3">Contatti</h3>
            <p className="text-sm text-gray-400 mb-2">
              Hai domande? Contattaci via email per suggerimenti e feedback.
            </p>
            <a
              href="mailto:calcolasubito@gmail.com"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              calcolasubito@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} CalcolaSubito.it. Tutti i diritti riservati.
          </p>
          <p className="text-sm text-gray-400 mt-4 md:mt-0">
            I calcoli sono eseguiti nel tuo browser. Nessun dato viene memorizzato.
          </p>
        </div>
      </div>
    </footer>
  )
}

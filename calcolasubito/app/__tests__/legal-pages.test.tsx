import React from 'react'
import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import PrivacyPolicy from '@/app/privacy/page'
import CookiePolicy from '@/app/cookie/page'
import { LEGAL_LAST_UPDATED_LABEL } from '@/lib/legal'

const MOJIBAKE_PATTERN = /Ã|Â|â€™|â€œ|â€”|â€“/g

describe('legal pages', () => {
  it('renders privacy and cookie page headings', () => {
    render(<PrivacyPolicy />)
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()

    render(<CookiePolicy />)
    expect(screen.getByRole('heading', { level: 1, name: 'Cookie Policy' })).toBeInTheDocument()
  })

  it('shows stable legal last-update label', () => {
    render(<PrivacyPolicy />)
    expect(screen.getByText(LEGAL_LAST_UPDATED_LABEL)).toBeInTheDocument()

    render(<CookiePolicy />)
    expect(screen.getAllByText(LEGAL_LAST_UPDATED_LABEL)).toHaveLength(2)
  })

  it('keeps legal page sources free from mojibake markers', () => {
    const privacySource = readFileSync(resolve(process.cwd(), 'app/privacy/page.tsx'), 'utf8')
    const cookieSource = readFileSync(resolve(process.cwd(), 'app/cookie/page.tsx'), 'utf8')

    expect(privacySource).not.toMatch(MOJIBAKE_PATTERN)
    expect(cookieSource).not.toMatch(MOJIBAKE_PATTERN)
  })
})

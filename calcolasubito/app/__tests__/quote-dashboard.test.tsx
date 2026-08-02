import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import QuoteDashboardPage from '@/components/QuoteDashboard'

jest.mock('@/components/Calculator', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('QuoteDashboard', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('blocks invalid input before calling the API', async () => {
    const fetchSpy = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    })
    ;(globalThis as Record<string, unknown>).fetch = fetchSpy

    render(<QuoteDashboardPage />)

    fireEvent.change(screen.getByLabelText('Base value'), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calcola quote' }))

    await waitFor(() => {
      expect(screen.getByText('Input non valido')).toBeInTheDocument()
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('shows a CMP warning when the response diverges from the contract', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      {
        ok: true,
        status: 200,
        json: async () => ({
          contract_version: 'quote-contract-v1',
          input_echo: {
            base_value: 120,
            multiplier: 1.15,
            risk_factor: 'medium',
          },
          risk_adjustment: 1,
          final_quote: 999,
          sanity_floor: 90,
          sanity_check_passed: true,
          telemetry: {
            calculation_id: 'quote-120:1.15:medium',
            complexity: 'O(1)',
            request_signature: 'quote-120:1.15:medium',
            sanity_floor: 90,
            sanity_check_passed: true,
            created_at: '2026-04-20T17:29:00.000Z',
          },
        }),
      }
    )
    ;(globalThis as Record<string, unknown>).fetch = fetchMock

    render(<QuoteDashboardPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Calcola quote' }))

    await waitFor(() => {
      expect(screen.getByText(/Inconsistenza Dati/)).toBeInTheDocument()
    })
  })
})

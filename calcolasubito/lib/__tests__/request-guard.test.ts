import { evaluateRequestThreat } from '@/lib/security/request-guard'

describe('request guard', () => {
  it('allows a normal read request', () => {
    const result = evaluateRequestThreat({
      method: 'GET',
      pathname: '/percentuali',
      search: '',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    })

    expect(result).toEqual({
      allowed: true,
      reason: 'allowed',
    })
  })

  it('blocks unsupported HTTP methods', () => {
    const result = evaluateRequestThreat({
      method: 'POST',
      pathname: '/percentuali',
      search: '',
      userAgent: 'Mozilla/5.0',
    })

    expect(result.allowed).toBe(false)
    expect(result.statusCode).toBe(405)
    expect(result.reason).toBe('method-not-allowed')
  })

  it('blocks common scanner paths', () => {
    const result = evaluateRequestThreat({
      method: 'GET',
      pathname: '/wp-admin/install.php',
      search: '',
      userAgent: 'Mozilla/5.0',
    })

    expect(result.allowed).toBe(false)
    expect(result.statusCode).toBe(403)
    expect(result.reason).toBe('blocked-path')
  })

  it('blocks suspicious file probes', () => {
    const result = evaluateRequestThreat({
      method: 'GET',
      pathname: '/backup/database.sql',
      search: '',
      userAgent: 'Mozilla/5.0',
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('blocked-file')
  })

  it('blocks path traversal attempts', () => {
    const result = evaluateRequestThreat({
      method: 'GET',
      pathname: '/../../etc/passwd',
      search: '',
      userAgent: 'Mozilla/5.0',
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('path-traversal')
  })

  it('blocks SQL injection style query strings', () => {
    const result = evaluateRequestThreat({
      method: 'GET',
      pathname: '/percentuali',
      search: '?q=%27%20OR%201%3D1--',
      userAgent: 'Mozilla/5.0',
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('malicious-query')
  })

  it('blocks known scanner user agents', () => {
    const result = evaluateRequestThreat({
      method: 'GET',
      pathname: '/percentuali',
      search: '',
      userAgent: 'sqlmap/1.8.12#stable',
    })

    expect(result.allowed).toBe(false)
    expect(result.reason).toBe('malicious-user-agent')
  })

  it('does not block harmless query parameters', () => {
    const result = evaluateRequestThreat({
      method: 'GET',
      pathname: '/percentuali',
      search: '?q=calcolo%20percentuale%2010%25',
      userAgent: 'Mozilla/5.0',
    })

    expect(result).toEqual({
      allowed: true,
      reason: 'allowed',
    })
  })
})

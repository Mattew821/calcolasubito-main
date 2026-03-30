export const ALLOWED_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

const BLOCKED_PATH_PATTERNS: RegExp[] = [
  /^\/(?:wp-admin|wp-login\.php|xmlrpc\.php)(?:\/|$)/i,
  /^\/(?:phpmyadmin|pma|myadmin)(?:\/|$)/i,
  /^\/(?:\.env|\.git|\.svn|\.hg)(?:\/|$)/i,
  /^\/(?:cgi-bin|server-status|actuator|boaform|vendor)(?:\/|$)/i,
]

const BLOCKED_FILE_PATTERNS: RegExp[] = [
  /\.(?:php\d?|aspx?|jsp|cgi|env|ini|bak|sql|ya?ml|config)(?:$|\/)/i,
  /(?:^|\/)\.(?:env|git|svn|hg)(?:$|\/)/i,
]

const MALICIOUS_USER_AGENT_PATTERNS: RegExp[] = [
  /\b(?:sqlmap|nikto|acunetix|nessus|nmap|masscan|wpscan|gobuster|dirbuster|arachni|metasploit|zgrab2?|nuclei)\b/i,
]

const MALICIOUS_QUERY_PATTERNS: RegExp[] = [
  /<script\b/i,
  /\bunion(?:\s+all)?\s+select\b/i,
  /\b(?:or|and)\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,
  /\b(?:sleep|benchmark)\s*\(/i,
  /(?:\.\.\/|%2e%2e%2f|%2e%2e\/|%2f%2e%2e)/i,
]

const PATH_TRAVERSAL_PATTERN = /(?:\.\.|%2e%2e|%00|%252e%252e)/i

export type RequestBlockReason =
  | 'method-not-allowed'
  | 'blocked-path'
  | 'blocked-file'
  | 'path-traversal'
  | 'malicious-query'
  | 'malicious-user-agent'
  | 'allowed'

export interface RequestThreatCheckInput {
  method: string
  pathname: string
  search: string
  userAgent: string
}

export interface RequestThreatCheckResult {
  allowed: boolean
  statusCode?: 403 | 405
  reason: RequestBlockReason
}

function safeDecode(value: string): string {
  let decoded = value
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const candidate = decodeURIComponent(decoded)
      if (candidate === decoded) {
        break
      }
      decoded = candidate
    } catch {
      break
    }
  }
  return decoded
}

function normalizePath(pathname: string): string {
  const raw = pathname || '/'
  const prefixed = raw.startsWith('/') ? raw : `/${raw}`
  return prefixed.toLowerCase()
}

function normalizeSearch(search: string): string {
  const raw = search.startsWith('?') ? search.slice(1) : search
  return raw.replace(/\+/g, ' ').toLowerCase()
}

export function evaluateRequestThreat(input: RequestThreatCheckInput): RequestThreatCheckResult {
  const method = (input.method || 'GET').toUpperCase()
  if (!ALLOWED_METHODS.has(method)) {
    return {
      allowed: false,
      statusCode: 405,
      reason: 'method-not-allowed',
    }
  }

  const normalizedPath = normalizePath(input.pathname)
  const decodedPath = safeDecode(normalizedPath)

  if (PATH_TRAVERSAL_PATTERN.test(normalizedPath) || PATH_TRAVERSAL_PATTERN.test(decodedPath)) {
    return {
      allowed: false,
      statusCode: 403,
      reason: 'path-traversal',
    }
  }

  if (BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(normalizedPath))) {
    return {
      allowed: false,
      statusCode: 403,
      reason: 'blocked-path',
    }
  }

  if (BLOCKED_FILE_PATTERNS.some((pattern) => pattern.test(normalizedPath))) {
    return {
      allowed: false,
      statusCode: 403,
      reason: 'blocked-file',
    }
  }

  const normalizedSearch = normalizeSearch(input.search)
  const decodedSearch = safeDecode(normalizedSearch)
  if (MALICIOUS_QUERY_PATTERNS.some((pattern) => pattern.test(normalizedSearch) || pattern.test(decodedSearch))) {
    return {
      allowed: false,
      statusCode: 403,
      reason: 'malicious-query',
    }
  }

  const userAgent = (input.userAgent || '').toLowerCase()
  if (userAgent && MALICIOUS_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return {
      allowed: false,
      statusCode: 403,
      reason: 'malicious-user-agent',
    }
  }

  return {
    allowed: true,
    reason: 'allowed',
  }
}

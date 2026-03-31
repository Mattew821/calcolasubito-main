import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const DEFAULT_BASE_URL = 'https://calcolasubito.vercel.app'
const KEY_ROUTES = ['/', '/percentuali', '/scorporo-iva', '/cookie', '/privacy', '/sitemap.xml', '/robots.txt']
const SECURITY_PROBES = ['/wp-admin', '/percentuali?q=%27%20OR%201%3D1--']

function runGit(args) {
  return execFileSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
  }).trim()
}

function formatRomeDate(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}`
}

function parseEnvValue(content, key) {
  const match = content.match(new RegExp(`^\\s*${key}\\s*=\\s*(.+)\\s*$`, 'm'))
  if (!match) {
    return null
  }

  const raw = match[1]?.trim() ?? ''
  const unquoted = raw.replace(/^['"]|['"]$/g, '')
  return unquoted || null
}

function getBaseUrl() {
  const envFromProcess = process.env.NEXT_PUBLIC_BASE_URL?.trim()
  if (envFromProcess) {
    return normalizeBaseUrl(envFromProcess)
  }

  for (const envFile of ['.env.local', '.env.example']) {
    const fullPath = resolve(process.cwd(), envFile)
    if (!existsSync(fullPath)) {
      continue
    }

    const content = readFileSync(fullPath, 'utf8')
    const value = parseEnvValue(content, 'NEXT_PUBLIC_BASE_URL')
    if (value) {
      return normalizeBaseUrl(value)
    }
  }

  return DEFAULT_BASE_URL
}

function normalizeBaseUrl(value) {
  const trimmed = value.trim()
  if (!trimmed) {
    return DEFAULT_BASE_URL
  }
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return withProtocol.replace(/\/+$/, '')
}

function joinUrl(baseUrl, path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

async function fetchStatus(url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'calcolasubito-current-updater/1.0' },
    })
    return { status: response.status, headers: response.headers, ok: true }
  } catch (error) {
    return { status: null, headers: null, ok: false, error: error instanceof Error ? error.message : 'fetch error' }
  }
}

function readVercelProjectMeta() {
  const projectFile = resolve(process.cwd(), '.vercel', 'project.json')
  if (!existsSync(projectFile)) {
    return null
  }

  try {
    const raw = readFileSync(projectFile, 'utf8')
    const parsed = JSON.parse(raw)
    const projectId = typeof parsed.projectId === 'string' ? parsed.projectId : null
    const teamId = typeof parsed.orgId === 'string' ? parsed.orgId : null
    return projectId && teamId ? { projectId, teamId } : null
  } catch {
    return null
  }
}

async function fetchVercelDeployment(meta) {
  const token = process.env.VERCEL_TOKEN?.trim()
  if (!token) {
    return { status: 'token-missing' }
  }
  if (!meta) {
    return { status: 'project-meta-missing' }
  }

  const url = new URL('https://api.vercel.com/v6/deployments')
  url.searchParams.set('projectId', meta.projectId)
  url.searchParams.set('target', 'production')
  url.searchParams.set('limit', '1')
  url.searchParams.set('teamId', meta.teamId)

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'user-agent': 'calcolasubito-current-updater/1.0',
      },
    })

    if (response.status === 401 || response.status === 403) {
      return { status: 'auth-required' }
    }
    if (!response.ok) {
      return { status: `http-${response.status}` }
    }

    const payload = await response.json()
    const deployment = Array.isArray(payload.deployments) ? payload.deployments[0] : null
    if (!deployment) {
      return { status: 'no-deployment' }
    }

    return {
      status: 'ok',
      id: deployment.uid ?? 'unknown',
      url: deployment.url ? `https://${deployment.url}` : 'unknown',
      state: deployment.state ?? 'unknown',
      createdAt: typeof deployment.createdAt === 'number' ? formatRomeDate(new Date(deployment.createdAt)) : 'unknown',
      readyState: deployment.readyState ?? 'unknown',
    }
  } catch (error) {
    return { status: error instanceof Error ? `error-${error.message}` : 'error' }
  }
}

function formatStatusLine(label, value) {
  return `  - ${label}: \`${value}\``
}

async function main() {
  const now = new Date()
  const nowRome = formatRomeDate(now)
  const branch = runGit(['rev-parse', '--abbrev-ref', 'HEAD'])
  const pushedCommit = process.env.CURRENT_PUSH_COMMIT?.trim() || runGit(['rev-parse', '--short', 'HEAD'])

  const baseUrl = getBaseUrl()
  const domain = new URL(baseUrl).host

  const mainResponse = await fetchStatus(baseUrl)
  const keyRouteStatuses = []
  for (const route of KEY_ROUTES) {
    const response = await fetchStatus(joinUrl(baseUrl, route))
    keyRouteStatuses.push({ route, status: response.ok ? String(response.status) : `ERR:${response.error}` })
  }

  const securityStatuses = []
  for (const route of SECURITY_PROBES) {
    const response = await fetchStatus(joinUrl(baseUrl, route))
    securityStatuses.push({ route, status: response.ok ? String(response.status) : `ERR:${response.error}` })
  }

  const xVercelId = mainResponse.headers?.get('x-vercel-id') ?? 'n/a'
  const xVercelCache = mainResponse.headers?.get('x-vercel-cache') ?? 'n/a'
  const requestGuardHeader = mainResponse.headers?.get('x-request-guard') ?? 'n/a'

  const vercelMeta = readVercelProjectMeta()
  const deployment = await fetchVercelDeployment(vercelMeta)

  const lines = []
  lines.push('# Current')
  lines.push('')
  lines.push(`- Last Push Date (Europe/Rome): ${nowRome}`)
  lines.push(`- Last Pushed Commit: \`${pushedCommit}\``)
  lines.push(`- Branch: \`${branch}\``)
  lines.push(`- Domain: \`${domain}\``)
  lines.push(`- Last Vercel Current Update (Europe/Rome): ${nowRome}`)
  lines.push('- Vercel Current:')

  if (deployment.status === 'ok') {
    lines.push(formatStatusLine('Connector API status', 'ok'))
    lines.push(formatStatusLine('Deployment ID', deployment.id))
    lines.push(formatStatusLine('Deployment URL', deployment.url))
    lines.push(formatStatusLine('Deployment state', deployment.state))
    lines.push(formatStatusLine('Deployment readyState', deployment.readyState))
    lines.push(`  - Deployment createdAt (Europe/Rome): \`${deployment.createdAt}\``)
  } else {
    lines.push(formatStatusLine('Connector API status', deployment.status))
  }

  lines.push(`  - Public health check: \`${baseUrl}/\` -> \`${mainResponse.ok ? mainResponse.status : `ERR:${mainResponse.error}`}\``)
  lines.push(formatStatusLine('X-Vercel-Id', xVercelId))
  lines.push(formatStatusLine('X-Vercel-Cache', xVercelCache))
  lines.push(formatStatusLine('X-Request-Guard', requestGuardHeader))
  lines.push('  - Security probes:')
  for (const probe of securityStatuses) {
    lines.push(`    - \`${probe.route}\` -> \`${probe.status}\``)
  }
  lines.push('  - Key routes:')
  for (const route of keyRouteStatuses) {
    lines.push(`    - \`${route.route}\` -> \`${route.status}\``)
  }

  lines.push('- Quality Gates Policy:')
  lines.push('  - Local pre-push hook: `npm run verify:full` (required)')
  lines.push('  - CI required checks: `test`, `lint`, `build`, `e2e`')

  lines.push('')

  const nextContent = lines.join('\n')
  const currentFile = resolve(process.cwd(), 'CURRENT.md')
  const prevContent = existsSync(currentFile) ? readFileSync(currentFile, 'utf8') : ''
  if (prevContent !== nextContent) {
    writeFileSync(currentFile, nextContent, 'utf8')
    console.log('[current:update] CURRENT.md updated')
  } else {
    console.log('[current:update] CURRENT.md already up to date')
  }
}

await main()

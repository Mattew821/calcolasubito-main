import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.txt',
  '.yaml',
  '.yml',
  '.env',
  '.html',
  '.css',
])

const BLOCKED_PATH_PATTERNS = [
  {
    regex: /(^|\/)\.env($|\.|\/)/i,
    allow: (filePath) => filePath.endsWith('.env.example'),
    reason: 'Environment file tracked',
  },
  { regex: /(^|\/)\.next(\/|$)/i, reason: 'Next build artifact tracked' },
  { regex: /(^|\/)node_modules(\/|$)/i, reason: 'Dependency directory tracked' },
  { regex: /(^|\/)(out|dist|build)(\/|$)/i, reason: 'Build output tracked' },
  { regex: /(^|\/)\.vercel(\/|$)/i, reason: 'Vercel local folder tracked' },
  { regex: /\.(pem|key|p12|pfx)$/i, reason: 'Private key/certificate tracked' },
  { regex: /service-account.*\.json$/i, reason: 'Service account file tracked' },
  { regex: /\.(db|sqlite|sqlite3)$/i, reason: 'Local database file tracked' },
  { regex: /\.log$/i, reason: 'Log file tracked' },
]

const HIGH_CONFIDENCE_SECRET_PATTERNS = [
  { regex: /sk_live_[A-Za-z0-9]+/g, label: 'Stripe live secret' },
  { regex: /sk_test_[A-Za-z0-9]+/g, label: 'Stripe test secret' },
  { regex: /AKIA[0-9A-Z]{16}/g, label: 'AWS access key id' },
  { regex: /-----BEGIN (?:RSA|EC|OPENSSH) PRIVATE KEY-----/g, label: 'Private key content' },
  { regex: /ghp_[A-Za-z0-9]{20,}/g, label: 'GitHub personal access token' },
  { regex: /AIza[0-9A-Za-z\-_]{20,}/g, label: 'Google API key' },
  { regex: /xox[baprs]-[A-Za-z0-9-]{10,}/g, label: 'Slack token' },
  { regex: /eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/g, label: 'JWT-like token' },
]

function runGitCommand(args) {
  return execFileSync('git', args, { encoding: 'utf8' })
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return TEXT_EXTENSIONS.has(ext)
}

function getTrackedFiles() {
  const raw = runGitCommand(['ls-files', '-z'])
  return raw
    .split('\0')
    .map((item) => item.trim())
    .filter(Boolean)
}

function checkBlockedPaths(files) {
  const findings = []

  for (const filePath of files) {
    for (const rule of BLOCKED_PATH_PATTERNS) {
      if (!rule.regex.test(filePath)) {
        continue
      }
      if (rule.allow && rule.allow(filePath)) {
        continue
      }

      findings.push({
        filePath,
        reason: rule.reason,
      })
      break
    }
  }

  return findings
}

function checkSecretPatterns(files) {
  const findings = []

  for (const filePath of files) {
    if (!isTextFile(filePath)) {
      continue
    }

    const absolutePath = path.resolve(process.cwd(), filePath)
    if (!fs.existsSync(absolutePath)) {
      continue
    }

    const content = fs.readFileSync(absolutePath, 'utf8')
    const lines = content.split(/\r?\n/)

    lines.forEach((line, index) => {
      for (const pattern of HIGH_CONFIDENCE_SECRET_PATTERNS) {
        if (!pattern.regex.test(line)) {
          continue
        }

        findings.push({
          filePath,
          line: index + 1,
          reason: pattern.label,
          snippet: line.trim().slice(0, 220),
        })
      }
    })
  }

  return findings
}

function printFindings(title, findings, formatter) {
  if (findings.length === 0) {
    return
  }

  console.error(`\n[security-scan] ${title}:`)
  for (const finding of findings) {
    console.error(`- ${formatter(finding)}`)
  }
}

function main() {
  const trackedFiles = getTrackedFiles()
  const blockedPathFindings = checkBlockedPaths(trackedFiles)
  const secretFindings = checkSecretPatterns(trackedFiles)

  printFindings(
    'Blocked files detected',
    blockedPathFindings,
    (f) => `${f.filePath} (${f.reason})`
  )

  printFindings(
    'High-confidence secret patterns detected',
    secretFindings,
    (f) => `${f.filePath}:${f.line} (${f.reason}) -> ${f.snippet}`
  )

  const findingsCount = blockedPathFindings.length + secretFindings.length
  if (findingsCount > 0) {
    console.error(`\n[security-scan] FAILED: ${findingsCount} issue(s) found.`)
    process.exit(1)
  }

  console.log('[security-scan] OK: no blocked tracked files and no high-confidence secrets found.')
}

main()

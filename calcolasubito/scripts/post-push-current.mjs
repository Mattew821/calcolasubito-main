import { execFileSync, spawnSync } from 'node:child_process'

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  })

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with status ${result.status}`)
  }
}

function runOutput(command, args) {
  return execFileSync(command, args, {
    encoding: 'utf8',
  }).trim()
}

if (process.env.CURRENT_AUTO_PUSH === '1') {
  process.exit(0)
}

try {
  const branch = runOutput('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
  const commit = runOutput('git', ['rev-parse', '--short', 'HEAD'])

  run('node', ['scripts/update-current.mjs'], {
    env: {
      ...process.env,
      CURRENT_PUSH_COMMIT: commit,
    },
  })

  const hasCurrentChanges = spawnSync('git', ['diff', '--quiet', '--', 'CURRENT.md'], {
  }).status !== 0

  if (!hasCurrentChanges) {
    console.log('[post-push] CURRENT.md unchanged')
    process.exit(0)
  }

  run('git', ['add', 'CURRENT.md'])
  run('git', ['commit', '-m', 'docs(current): auto-update after push'])
  run('git', ['push', 'origin', branch], {
    env: {
      ...process.env,
      CURRENT_AUTO_PUSH: '1',
    },
  })

  console.log('[post-push] CURRENT.md auto-updated and pushed')
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[post-push] warning: ${message}`)
  process.exit(0)
}

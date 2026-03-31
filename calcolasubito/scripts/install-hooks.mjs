import { spawnSync } from 'node:child_process'
import { relative } from 'node:path'

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    const stderr = result.stderr?.trim() ?? ''
    throw new Error(`${command} ${args.join(' ')} failed${stderr ? `: ${stderr}` : ''}`)
  }

  return result.stdout?.trim() ?? ''
}

const repoRoot = run('git', ['rev-parse', '--show-toplevel'])
const relativeProjectPath = relative(repoRoot, process.cwd()).replaceAll('\\', '/')
const hooksPath = relativeProjectPath ? `${relativeProjectPath}/.githooks` : '.githooks'

run('git', ['config', 'core.hooksPath', hooksPath])
console.log(`[hooks] core.hooksPath set to ${hooksPath}`)

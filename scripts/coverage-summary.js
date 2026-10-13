#!/usr/bin/env node
/**
 * Print Vitest coverage average used by CI:
 * (statements + branches + functions + lines) / 4
 *
 * Usage: pnpm test:coverage:summary
 *        node scripts/coverage-summary.js --no-run [--strict] [--json]
 */
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const coverageFile = path.join(root, 'coverage', 'coverage-final.json')

const runCoverage = process.argv.includes('--no-run') === false
if (runCoverage) {
  const result = spawnSync('pnpm', ['exec', 'vitest', '--coverage', '--run'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })
  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

if (!fs.existsSync(coverageFile)) {
  console.error(`Coverage file not found: ${coverageFile}`)
  console.error('Run `pnpm test:coverage` first, or omit --no-run.')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))
const total = {
  statements: { total: 0, covered: 0 },
  branches: { total: 0, covered: 0 },
  functions: { total: 0, covered: 0 },
  lines: { total: 0, covered: 0 }
}

Object.values(data).forEach((fileData) => {
  if (fileData?.s) {
    Object.values(fileData.s).forEach((v) => {
      total.statements.total++
      if (v > 0) total.statements.covered++
    })
  }
  if (fileData?.b) {
    Object.values(fileData.b).forEach((branch) => {
      total.branches.total += branch.length
      total.branches.covered += branch.filter((v) => v > 0).length
    })
  }
  if (fileData?.f) {
    Object.values(fileData.f).forEach((v) => {
      total.functions.total++
      if (v > 0) total.functions.covered++
    })
  }
  if (fileData?.l) {
    Object.values(fileData.l).forEach((v) => {
      total.lines.total++
      if (v > 0) total.lines.covered++
    })
  } else if (fileData?.s) {
    Object.values(fileData.s).forEach((v) => {
      total.lines.total++
      if (v > 0) total.lines.covered++
    })
  }
})

const pct = (covered, all) => (all > 0 ? (covered / all) * 100 : 0)
const statements = pct(total.statements.covered, total.statements.total)
const branches = pct(total.branches.covered, total.branches.total)
const functions = pct(total.functions.covered, total.functions.total)
const lines = pct(total.lines.covered, total.lines.total)
const average = (statements + branches + functions + lines) / 4
const round = (n) => Math.round(n * 100) / 100
const round0 = (n) => Math.round(n)
const summary = {
  average: round(average),
  statements: round(statements),
  branches: round(branches),
  functions: round(functions),
  lines: round(lines),
  rounded: {
    statements: round0(statements),
    branches: round0(branches),
    functions: round0(functions),
    lines: round0(lines)
  },
  meetsGate: average >= 70
}

fs.writeFileSync(
  path.join(root, 'coverage', 'gate-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`
)

console.log('')
console.log('Coverage summary (CI formula)')
console.log('-----------------------------')
console.log(`Statements : ${summary.statements}%`)
console.log(`Branches   : ${summary.branches}%`)
console.log(`Functions  : ${summary.functions}%`)
console.log(`Lines      : ${summary.lines}%`)
console.log(`Average    : ${summary.average}%  (threshold: 70%)`)
console.log('')
console.log(summary.meetsGate ? '✅ Meets 70% gate' : '❌ Below 70% gate')

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(summary))
}

if (process.argv.includes('--strict') && !summary.meetsGate) {
  process.exit(1)
}

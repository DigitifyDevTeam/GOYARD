import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// react/scripts/ -> react/
const reactDir = path.resolve(__dirname, '..')
const repoRoot = path.resolve(reactDir, '..')

const sourceHtaccess = path.join(repoRoot, 'backend', '.htaccess')
const distDir = path.join(reactDir, 'dist')
const targetHtaccess = path.join(distDir, '.htaccess')

if (!fs.existsSync(sourceHtaccess)) {
  throw new Error(`Missing backend htaccess: ${sourceHtaccess}`)
}

fs.mkdirSync(distDir, { recursive: true })
fs.copyFileSync(sourceHtaccess, targetHtaccess)

// /tarification is a legacy alias (301 → /tarif/); remove stale prerender output if present
const staleTarificationDir = path.join(distDir, 'tarification')
if (fs.existsSync(staleTarificationDir)) {
  fs.rmSync(staleTarificationDir, { recursive: true, force: true })
  console.log(`[postbuild] removed stale ${staleTarificationDir}`)
}

console.log(`[postbuild] copied ${sourceHtaccess} -> ${targetHtaccess}`)


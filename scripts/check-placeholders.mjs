import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const projectRoot = new URL('..', import.meta.url).pathname
const docsRoot = join(projectRoot, 'docs')
const markers = ['[待填写]', '[待确认]', '[链接]']
const matches = []
const ignoredDirectories = new Set(['public', 'dist', 'cache', '.temp'])

async function scanFile(path) {
  const lines = (await readFile(path, 'utf8')).split('\n')
  lines.forEach((line, index) => {
    if (markers.some((marker) => line.includes(marker))) {
      matches.push(`${relative(projectRoot, path)}:${index + 1} ${line.trim()}`)
    }
  })
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) await walk(path)
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue
    await scanFile(path)
  }
}

await walk(docsRoot)

if (matches.length) {
  console.error(`发现 ${matches.length} 处未完成标记：\n`)
  console.error(matches.join('\n'))
  process.exitCode = 1
} else {
  console.log('检查通过：没有未完成标记。')
}

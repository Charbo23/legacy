import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join, posix, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const docsRoot = join(projectRoot, 'docs')
const outputDir = join(projectRoot, 'dist')
const outputFile = join(outputDir, 'legacy-handover.md')

const pages = [
  { file: 'project-overview.md', title: '项目地图' },
  { file: 'ehafo-frontend/overview.md', title: '易哈佛前台：项目概况' },
  { file: 'ehafo-frontend/repositories.md', title: '易哈佛前台：仓库与系统关系' },
  { file: 'ehafo-frontend/mp-and-subprojects.md', title: '易哈佛前台：MP 与 subproject' },
  { file: 'ehafo-frontend/ab-testing.md', title: '易哈佛前台：A/B 测试' },
  { file: 'ehafo-frontend/troubleshooting.md', title: '易哈佛前台：问题排查' },
  { file: 'ehafo-frontend/lessons.md', title: '易哈佛前台：测试、验收与项目经验' },
  { file: 'team-agent-config/overview.md', title: 'team-agent-config：项目概况' },
  { file: 'schedule/overview.md', title: '小护排班：项目概况' }
]

const pageIds = new Map(
  pages.map(({ file }) => [file, `page-${file.replace(/\.md$/, '').replaceAll('/', '-')}`])
)

async function findContentPages(directory = docsRoot) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ['.vitepress', 'public'].includes(entry.name)) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await findContentPages(path))
    if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
      files.push(relative(docsRoot, path).replaceAll('\\', '/'))
    }
  }
  return files
}

const unlistedPages = (await findContentPages()).filter((file) => !pageIds.has(file))
if (unlistedPages.length) {
  throw new Error(`以下正式页面未纳入单文件产物：${unlistedPages.join(', ')}`)
}

function slugify(value) {
  return decodeURIComponent(value)
    .replace(/[`*~]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
}

function resolveDocumentTarget(sourceFile, rawTarget) {
  if (/^[a-z]+:/i.test(rawTarget)) return null
  if (rawTarget.startsWith('#')) {
    return `#${pageIds.get(sourceFile)}-${slugify(rawTarget.slice(1))}`
  }

  const [rawPath, rawFragment] = rawTarget.split('#', 2)
  const targetFile = rawPath.startsWith('/')
    ? rawPath.slice(1)
    : posix.normalize(posix.join(posix.dirname(sourceFile), rawPath))
  const normalizedFile = posix.extname(targetFile) ? targetFile : `${targetFile}.md`
  const targetPageId = pageIds.get(normalizedFile)
  if (!targetPageId) {
    throw new Error(`${sourceFile} 包含未纳入单文件产物的站内链接：${rawTarget}`)
  }

  const fragment = rawFragment ? `-${slugify(rawFragment)}` : ''
  return `#${targetPageId}${fragment}`
}

function rewriteInternalLinks(markdown, sourceFile) {
  return markdown.replace(/\]\(([^)]+)\)/g, (match, rawTarget) => {
    const target = resolveDocumentTarget(sourceFile, rawTarget.trim())
    return target ? `](${target})` : match
  })
}

function shiftHeadingsAndAddAnchors(markdown, pageId) {
  let inFence = false
  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence
        return line
      }
      if (inFence) return line

      const heading = line.match(/^(#{1,5})(\s+)(.+?)\s*#*$/)
      if (!heading) return line
      const [, marks, spacing, text] = heading
      return `<a id="${pageId}-${slugify(text)}"></a>\n${`#${marks}${spacing}${text}`}`
    })
    .join('\n')
}

function validateBundle(markdown) {
  const anchors = [...markdown.matchAll(/<a id="([^"]+)"><\/a>/g)].map((match) => match[1])
  const links = [...markdown.matchAll(/\]\((#[^)]+)\)/g)].map((match) => match[1].slice(1))
  const markdownLinks = [...markdown.matchAll(/\]\(([^)]+\.md(?:#[^)]+)?)\)/g)].map((match) => match[1])
  const duplicateAnchors = [...new Set(anchors.filter((anchor, index) => anchors.indexOf(anchor) !== index))]
  const missingAnchors = [...new Set(links.filter((link) => !anchors.includes(link)))]

  const errors = []
  if (duplicateAnchors.length) errors.push(`存在重复锚点：${duplicateAnchors.join(', ')}`)
  if (missingAnchors.length) errors.push(`存在无目标锚点：${missingAnchors.join(', ')}`)
  if (markdownLinks.length) errors.push(`仍有 Markdown 站内链接：${markdownLinks.join(', ')}`)
  if (errors.length) throw new Error(errors.join('\n'))
  return links.length
}

const sections = []
for (const page of pages) {
  const sourcePath = join(docsRoot, page.file)
  const source = await readFile(sourcePath, 'utf8')
  const pageId = pageIds.get(page.file)
  const content = shiftHeadingsAndAddAnchors(rewriteInternalLinks(source, page.file), pageId)
  sections.push(`<!-- source: docs/${page.file} -->\n<a id="${pageId}"></a>\n\n${content.trim()}`)
}

const tableOfContents = pages
  .map(({ file, title }) => `- [${title}](#${pageIds.get(file)})`)
  .join('\n')
const document = `# 项目接手手册

> 独立构建版本。按逻辑项目汇总判断方法、问题排查、验收边界和事实源入口。

## 文档目录

${tableOfContents}

---

${sections.join('\n\n---\n\n')}

`

const internalLinkCount = validateBundle(document)
await mkdir(outputDir, { recursive: true })
await writeFile(outputFile, document)
console.log(`单文件 Markdown 已生成：${relative(projectRoot, outputFile)}（${pages.length} 个页面，${internalLinkCount} 个站内链接）`)

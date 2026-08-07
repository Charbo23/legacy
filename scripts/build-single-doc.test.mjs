import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))

test('单文件产物包含 ehafo-front-lib 页面', async () => {
  const result = spawnSync(process.execPath, ['scripts/build-single-doc.mjs'], {
    cwd: projectRoot,
    encoding: 'utf8'
  })

  assert.equal(result.status, 0, result.stderr)
  const output = await readFile(join(projectRoot, 'dist/legacy-handover.md'), 'utf8')
  assert.match(output, /<!-- source: docs\/ehafo-frontend\/front-lib\.md -->/)
})

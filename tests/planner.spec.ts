import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/Notes/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('starts with a visible planner instead of a blank page', async ({ page }) => {
  await expect(page.getByText('dailume', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Today/ })).toBeVisible()
  await expect(page.getByText('Opening your planner…')).toHaveCount(0)
})

test('creates a task and keeps it after a reload', async ({ page }) => {
  await page.getByRole('button', { name: 'New item' }).click()
  await page.getByPlaceholder('e.g. Finish the assignment').fill('Audit the planner')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Audit the planner', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Audit the planner', { exact: true })).toBeVisible()
})

test('creates a timed event and displays its time', async ({ page }) => {
  await page.getByRole('button', { name: 'New item' }).click()
  await page.getByRole('button', { name: 'Event', exact: true }).click()
  await page.getByPlaceholder('e.g. Meeting with Sarah').fill('Design review')
  await page.getByLabel('Starts').fill('13:15')
  await page.getByLabel('Ends').fill('14:00')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Design review', { exact: true })).toBeVisible()
  await expect(page.getByText('13:15 – 14:00')).toBeVisible()
})

test('creates a note and finds it through search', async ({ page }) => {
  await page.getByRole('button', { name: 'Notes', exact: true }).click()
  await page.getByRole('button', { name: 'New note' }).click()
  await page.getByPlaceholder('Write a thought…').fill('Remember the fabric samples')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Remember the fabric samples', { exact: true })).toBeVisible()
  await page.getByLabel('Search items').fill('fabric')
  await expect(page.getByText('Remember the fabric samples', { exact: true })).toBeVisible()
  await page.getByLabel('Search items').fill('not in this note')
  await expect(page.getByText('Nothing found.')).toBeVisible()
})

test('supports editing and deleting an item', async ({ page }) => {
  await page.getByRole('button', { name: 'New item' }).click()
  await page.getByPlaceholder('e.g. Finish the assignment').fill('Original title')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await page.getByRole('article').filter({ hasText: 'Original title' }).getByRole('button', { name: 'Edit item' }).click()
  const title = page.getByPlaceholder('e.g. Finish the assignment')
  await title.fill('Updated title')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Updated title', { exact: true })).toBeVisible()
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('article').filter({ hasText: 'Updated title' }).getByRole('button', { name: 'Edit item' }).click()
  await page.getByRole('button', { name: 'Delete item' }).click()
  await expect(page.getByText('Updated title', { exact: true })).toHaveCount(0)
})

test('allows planning for a future date and shows it in Upcoming', async ({ page }) => {
  const tomorrow = await page.evaluate(() => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  })
  await page.getByLabel('Choose a day').fill(tomorrow)
  await page.getByRole('button', { name: 'New item' }).click()
  await page.getByPlaceholder('e.g. Finish the assignment').fill('Tomorrow task')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await page.getByRole('button', { name: 'Upcoming', exact: true }).click()
  await expect(page.getByText('Tomorrow task', { exact: true })).toBeVisible()
})

test('fits a narrow 320px viewport without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.reload()
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }))
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport)
})

test('exports a backup file', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export backup' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/^dailume-backup-\d{4}-\d{2}-\d{2}\.json$/)
})

test('restores a valid backup after confirmation', async ({ page }) => {
  const today = await page.evaluate(() => {
    const date = new Date()
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  })
  const backup = {
    app: 'Dailume',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    items: [{
      id: 'backup-item-1',
      date: today,
      title: 'Restored from backup',
      details: 'Verified local restore',
      kind: 'task',
      start: '09:00',
      end: '09:30',
      done: false,
      category: 'Personal',
      createdAt: 1793000000000,
    }],
  }
  page.once('dialog', dialog => dialog.accept())
  await page.locator('input[aria-label="Import backup"]').setInputFiles({
    name: 'dailume-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup)),
  })
  await expect(page.getByText('Restored from backup', { exact: true })).toBeVisible()
})

test('keeps a recovery copy if saved JSON is corrupted', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('daymark:v1', '{invalid json'))
  await page.reload()
  const recovery = await page.evaluate(() => localStorage.getItem('daymark:v1:recovery'))
  expect(recovery).toBe('{invalid json')
})

test('switches between light and dark mode and remembers the choice', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})


test('rejects impossible calendar dates in imported backups without changing saved items', async ({ page }) => {
  const today = await page.evaluate(() => {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  })
  const existing = {
    id: 'keep-me', date: today, title: 'Keep current data', details: '', kind: 'task',
    start: '09:00', end: '09:30', done: false, category: 'Personal', createdAt: 1793000000000,
  }
  await page.evaluate(item => localStorage.setItem('daymark:v1', JSON.stringify({ items: [item] })), existing)
  await page.reload()
  const backup = {
    schemaVersion: 1,
    items: [{ ...existing, id: 'invalid-date', date: '2026-02-31', title: 'Invalid date' }],
  }
  await page.locator('input[aria-label="Import backup"]').setInputFiles({
    name: 'invalid-date.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)),
  })
  await expect(page.getByText('This backup file is not valid for Dailume.')).toBeVisible()
  await expect(page.getByText('Keep current data', { exact: true })).toBeVisible()
  await expect(page.getByText('Invalid date', { exact: true })).toHaveCount(0)
})

test('rejects duplicate item IDs in imported backups', async ({ page }) => {
  const today = await page.evaluate(() => {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  })
  const item = {
    id: 'duplicate-id', date: today, title: 'Duplicate item', details: '', kind: 'task',
    start: '09:00', end: '09:30', done: false, category: 'Personal', createdAt: 1793000000000,
  }
  const backup = { schemaVersion: 1, items: [item, { ...item, title: 'Second duplicate' }] }
  await page.locator('input[aria-label="Import backup"]').setInputFiles({
    name: 'duplicate-ids.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)),
  })
  await expect(page.getByText('This backup file is not valid for Dailume.')).toBeVisible()
})


test('rejects imported items with oversized fields without replacing current data', async ({ page }) => {
  const today = await page.evaluate(() => {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  })
  const existing = {
    id: 'keep-this', date: today, title: 'Existing safe item', details: '', kind: 'task',
    start: '09:00', end: '09:30', done: false, category: 'Personal', createdAt: Date.now(),
  }
  await page.evaluate(item => localStorage.setItem('daymark:v1', JSON.stringify({ items: [item] })), existing)
  await page.reload()
  const backup = {
    schemaVersion: 1,
    items: [{ ...existing, id: 'oversized', title: 'x'.repeat(181) }],
  }
  await page.locator('input[aria-label="Import backup"]').setInputFiles({
    name: 'oversized-field.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)),
  })
  await expect(page.getByRole('status')).toContainText('This backup file is not valid for Dailume.')
  await expect(page.getByText('Existing safe item', { exact: true })).toBeVisible()
  await expect(page.getByText('x'.repeat(181), { exact: true })).toHaveCount(0)
})

test('rejects an oversized backup file before parsing it', async ({ page }) => {
  await page.locator('input[aria-label="Import backup"]').setInputFiles({
    name: 'too-large.json', mimeType: 'application/json', buffer: Buffer.alloc(5 * 1024 * 1024 + 1, 32),
  })
  await expect(page.getByRole('status')).toContainText('This backup is too large.')
})


test('keeps keyboard focus inside the composer and restores it on close', async ({ page }) => {
  await page.getByRole('button', { name: 'New item' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  const controls = dialog.locator('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])')
  await controls.last().focus()
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'New item' })).toBeFocused()
})

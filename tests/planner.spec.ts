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

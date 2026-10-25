import { expect, test } from '@playwright/test'

test('published planner loads with rendered app content', async ({ page }) => {
  const response = await page.goto('/Notes/', { waitUntil: 'networkidle' })
  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle(/Dailume/)
  await expect(page.getByRole('heading', { name: /Today/ })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.getByText('The planner did not load.')).toHaveCount(0)
})

test('published planner exposes canonical SEO metadata and a public sitemap', async ({ page, request }) => {
  const response = await page.goto('/Notes/', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle('Dailume — make room for your day')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /calm, simple planner/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://davidpit1565.github.io/Notes/')
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Dailume — make room for your day')

  const sitemap = await request.get('/Notes/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const xml = await sitemap.text()
  expect(xml).toContain('https://davidpit1565.github.io/Notes/')
  expect(xml).toContain('https://davidpit1565.github.io/Notes/privacy.html')
  expect(xml).toContain('https://davidpit1565.github.io/Notes/support.html')
})

test('published privacy and support pages are reachable', async ({ page }) => {
  const privacy = await page.goto('/Notes/privacy.html', { waitUntil: 'domcontentloaded' })
  expect(privacy?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()

  const support = await page.goto('/Notes/support.html', { waitUntil: 'domcontentloaded' })
  expect(support?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'Dailume Support' })).toBeVisible()
})

test('published planner can create and retain a task in this test browser', async ({ page }) => {
  await page.goto('/Notes/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.getByRole('button', { name: 'New item' }).click()
  await page.getByPlaceholder('e.g. Finish the assignment').fill('Live deployment smoke test')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Live deployment smoke test', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Live deployment smoke test', { exact: true })).toBeVisible()
})

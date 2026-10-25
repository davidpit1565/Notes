import { expect, test } from '@playwright/test'

test('published planner loads with rendered app content', async ({ page }) => {
  const response = await page.goto('/Notes/', { waitUntil: 'networkidle' })
  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle(/Dailume/)
  await expect(page.getByText('dailume', { exact: true })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByRole('heading', { name: /Today/ })).toBeVisible()
  await expect(page.getByText('The planner did not load.')).toHaveCount(0)
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

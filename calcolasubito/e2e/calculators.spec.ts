import { test, expect } from '@playwright/test'

const calculatorRoutes = [
  '/percentuali',
  '/giorni-tra-date',
  '/scorporo-iva',
  '/codice-fiscale',
  '/rata-mutuo',
  '/rata-prestito',
  '/sconto-percentuale',
  '/aumento-percentuale',
  '/interesse-semplice',
  '/interesse-composto',
  '/indice-massa-corporea',
  '/fabbisogno-calorico',
  '/consumo-carburante',
  '/area-rettangolo',
  '/area-cerchio',
  '/media-voti',
  '/conversione-temperatura',
  '/convertitore-unita-lunghezza',
  '/numeri-casuali',
  '/calcolo-eta',
  '/calcolo-mancia',
  '/calcolo-imu',
  '/busta-paga-netta',
]

test('homepage search should find new calculators', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.getByRole('searchbox', { name: 'Cerca calcolatore' }).fill('imu')
  await expect(page.locator('a[href="/calcolo-imu"]').first()).toBeVisible()

  await page.getByRole('searchbox', { name: 'Cerca calcolatore' }).fill('busta paga')
  await expect(page.locator('a[href="/busta-paga-netta"]').first()).toBeVisible()
})

for (const route of calculatorRoutes) {
  test(`calculator route ${route} should render and expose canonical`, async ({ page }) => {
    await page.goto(route)

    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()

    const canonical = page.locator('head link[rel="canonical"]')
    const canonicalHref = await canonical.getAttribute('href')
    expect(canonicalHref).toBeTruthy()
    expect(canonicalHref).toMatch(/^https?:\/\/[^/]+/)
    expect(canonicalHref).toContain(route)

    const firstForm = page.locator('form').first()
    await expect(firstForm).toBeVisible()

    const submitButtons = firstForm.locator('button[type="submit"]')
    if (await submitButtons.count()) {
      await submitButtons.first().click()
    }

    await expect(page.locator('body')).toBeVisible()
  })
}

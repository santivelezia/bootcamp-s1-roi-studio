import { test, expect } from '@playwright/test'

test('happy path · cargar → cambiar industria → ver escenarios y gráficas', async ({ page }) => {
  await page.goto('/')

  // Header visible · branding correcto
  await expect(page.getByText('Smart4AI', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Calculadora.*ROI Empresarial/i })).toBeVisible()

  // Inputs panel · industria default A
  await expect(page.getByRole('radio', { name: /Selecciona la industria/i }).or(page.getByText('Servicios profesionales'))).toBeVisible()

  // Cambiar a industria C · botón SaaS / Tech
  const saasButton = page.getByRole('radio', { name: /SaaS.*Tech/i }).or(page.getByText('SaaS / Tech'))
  await saasButton.first().click()

  // 3 escenarios visibles
  await expect(page.getByText('Pesimista')).toBeVisible()
  await expect(page.getByText('Esperado')).toBeVisible()
  await expect(page.getByText('Optimista')).toBeVisible()

  // KPIs · al menos uno tipo "Ahorro al año"
  await expect(page.getByText(/Ahorro al año/i).first()).toBeVisible()

  // Footer presente
  await expect(page.getByText(/Construido en 90 min con/)).toBeVisible()
})

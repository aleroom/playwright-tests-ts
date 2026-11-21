const { test, expect } = require('@playwright/test');

test('Complete product purchase cycle on SauceDemo', async ({ page }) => {
  // 1. Открываем сайт и логинимся
  await page.goto('https://saucedemo.com');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('#login-button').click();

  // 2. Добавляем товар в корзину (Sauce Labs Backpack)
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // 3. Переходим в корзину и проверяем товар и цену
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart\.html/);
  const cartItem = page.locator('.cart_item');
  await expect(cartItem.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  await expect(cartItem.locator('.inventory_item_price')).toHaveText('$29.99');

  // 4. Кликаем на Checkout (это кнопка, а не ссылка)
  await page.locator('[data-test="checkout"]').click();

  // 5. Заполняем форму и нажимаем Continue
  await page.locator('[data-test="firstName"]').fill('Ivan');
  await page.locator('[data-test="lastName"]').fill('Ivanov');
  await page.locator('[data-test="postalCode"]').fill('220000');
  await page.locator('[data-test="continue"]').click();

  // 6. Проверяем детали заказа (Payment Info и цены)
  await expect(page.locator('[data-test="payment-info-value"]')).toHaveText('SauceCard #31337');
  await expect(page.locator('[data-test="subtotal-label"]')).toContainText('$29.99');
  await expect(page.locator('[data-test="total-label"]')).toContainText('$32.39');

  // 7. Кликаем Finish и проверяем финальное сообщение и кнопки
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
});
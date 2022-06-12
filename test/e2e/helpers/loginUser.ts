export async function loginUser(
  email: string = "tester96@gmail.com",
  password: string = "12345"
) {
  await page.click("button[data-testid='login-btn']");
  await page.type("input[data-testid='auth-email']", email);
  await page.type("input[data-testid='auth-password']", password);
  await page.click("button[data-testid='auth-login-btn']");
}

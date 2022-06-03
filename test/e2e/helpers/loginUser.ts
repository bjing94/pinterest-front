export async function loginUser(
  email: string = "tester96@gmail.com",
  password: string = "12345"
) {
  await page.click("button[data-test-id='login-btn']");
  await page.type("input[data-test-id='auth-email']", email);
  await page.type("input[data-test-id='auth-password']", password);
  await page.click("button[data-test-id='auth-login-btn']");
}

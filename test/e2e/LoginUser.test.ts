import "puppeteer";
import { loginUser } from "./helpers/loginUser";

describe("Login user", () => {
  it("Login button exists", async () => {
    await page.goto("http://localhost:3001");
    const authButton = await page.waitForSelector(
      "button[data-testid='login-btn']"
    );
    expect(authButton).toBeTruthy();
  });

  it("Auth popup opens", async () => {
    await page.click("button[data-testid='login-btn']");
    const authPopup = await page.waitForSelector(
      "div[data-testid='auth-popup']"
    );
    expect(authPopup).toBeTruthy();
  });

  it("Login successfully", async () => {
    await loginUser();
    const profileButton = await page.waitForSelector(
      "button[data-testid='profile-btn']"
    );
    expect(profileButton).toBeTruthy();
  });
});

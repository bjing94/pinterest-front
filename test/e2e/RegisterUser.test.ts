import puppeteer from "puppeteer";

describe("Register user", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let authButton: puppeteer.ElementHandle | null = null;
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });
  it("Register button exists", async () => {
    await page.goto("http://localhost:3001");
    authButton = await page.waitForSelector(
      "button[data-testid='register-btn']"
    );
    expect(authButton).toBeTruthy();
  });

  it("Auth popup opens", async () => {
    await page.click("button[data-testid='register-btn']");
    const authPopup = await page.waitForSelector(
      "div[data-testid='auth-popup']"
    );
    expect(authPopup).toBeTruthy();
  });

  it("User registered successfully", async () => {
    await page.type("input[data-testid='auth-username']", "testovik");
    await page.type("input[data-testid='auth-id']", "tester96");
    await page.type("input[data-testid='auth-email']", "tester96@gmail.com");
    await page.type("input[data-testid='auth-password']", "12345");
    await page.type("input[data-testid='auth-repeat-password']", "12345");
    await page.click("button[data-testid='auth-register-btn']");

    const textPopup = await page.waitForSelector("*[data-testid='text-popup']");
    expect(textPopup).toBeTruthy();
  });
  afterAll(() => browser.close());
});

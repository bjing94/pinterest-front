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
      "button[data-test-id='register-btn']"
    );
    expect(authButton).toBeTruthy();
  });

  it("Auth popup opens", async () => {
    await page.click("button[data-test-id='register-btn']");
    const authPopup = await page.waitForSelector(
      "div[data-test-id='auth-popup']"
    );
    expect(authPopup).toBeTruthy();
  });

  it("User registered successfully", async () => {
    await page.type("input[data-test-id='auth-username']", "testovik");
    await page.type("input[data-test-id='auth-id']", "tester96");
    await page.type("input[data-test-id='auth-email']", "tester96@gmail.com");
    await page.type("input[data-test-id='auth-password']", "12345");
    await page.type("input[data-test-id='auth-repeat-password']", "12345");
    await page.click("button[data-test-id='auth-register-btn']");

    const textPopup = await page.waitForSelector(
      "*[data-test-id='text-popup']"
    );
    expect(textPopup).toBeTruthy();
  });
  afterAll(() => browser.close());
});

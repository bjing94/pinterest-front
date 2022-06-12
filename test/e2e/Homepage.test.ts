import "puppeteer";

describe("Homepage works", () => {
  beforeAll(async () => {
    await page.goto(process.env.REACT_APP_TEST_URL || "http://localhost:3001");
  });

  it("Has pins", async () => {
    const pinCard = await page.waitForSelector(
      "div[class='user-pin-card__container']"
    );
    expect(pinCard).toBeTruthy();
  });

  it("Home button active", async () => {
    const homeButton = await page.waitForSelector(
      "div[data-testid='home-btn']"
    );
    expect(homeButton?.getProperty("class")).toContain("filled");
  });
});

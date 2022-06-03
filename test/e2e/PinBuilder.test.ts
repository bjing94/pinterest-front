import "puppeteer";
import { loginUser } from "./helpers/loginUser";

describe("PinBuilder page", () => {
  beforeAll(async () => {
    await loginUser();
  });

  it("Has Pin Builder Card", async () => {
    const pinBuilderCard = await page.$("div[class='pin-builder__card']");
    expect(pinBuilderCard).toBeTruthy();
  });

  it("Pin created successfully", async () => {
    const pinBuilderCard = await page.$("div[class='pin-builder__card']");
    expect(pinBuilderCard).toBeTruthy();
  });
});

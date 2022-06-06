import { render } from "@testing-library/react";
import Avatar from "./Avatar";
import { rest } from "msw";
import { setupServer } from "msw/node";

describe("Avatar element", () => {
  const server = setupServer(
    rest.get("/files/testImgId", (req, res, ctx) => {
      return res(ctx.json({ url: "hello_there.png" }));
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("Avatar displays correct image", async () => {
    const { getByAltText } = render(<Avatar imgId="testImgId" size={32} />);
    await new Promise((res: (value: void) => void, rej) => {
      setTimeout(() => {
        res();
      }, 500);
    });
    expect(getByAltText("avatar").getAttribute("src")).toBe(
      "undefined/images/hello_there.png"
    );
  });

  test("Avatar size matches", () => {
    const { getByAltText } = render(<Avatar imgId="" size={32} />);
    expect(getByAltText("avatar").getAttribute("width")).toBe("32");
    expect(getByAltText("avatar").getAttribute("height")).toBe("32");
  });

  test("Avatar displays backup image", () => {
    const { getByAltText } = render(<Avatar imgId="" size={32} />);
    expect(getByAltText("avatar").getAttribute("src")).toBe(
      "https://via.placeholder.com/32"
    );
  });
});

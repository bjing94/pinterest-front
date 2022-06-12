import { render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import ProfileInfo from "./ProfileInfo";

describe("Profile info test", () => {
  const server = setupServer(
    rest.get("/files/:id", (req, res, ctx) => {
      return res(ctx.json({ url: "hello_there.png" }));
    })
  );

  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it("Profile info displays correctly", async () => {
    const { getByTestId } = render(
      <ProfileInfo
        data-testid="profile-info"
        username="user"
        avatarId="avatar25"
      />
    );

    expect(getByTestId("profile-info").querySelector("img")).toBeTruthy();

    expect(
      getByTestId("profile-info").querySelector(".typography")
    ).toBeTruthy();

    expect(
      getByTestId("profile-info").querySelector(".typography")!.textContent
    ).toBe("user");

    await waitFor(() => {
      expect(
        (getByTestId("profile-info").querySelector("img") as HTMLImageElement)
          .src
      ).toBe("http://localhost/undefined/images/hello_there.png");
    });
  });
});

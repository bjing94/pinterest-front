import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import AuthPopup from "./AuthPopup";

describe("Auth popup test", () => {
  let isSubmitted = false;
  const server = setupServer(
    rest.post("/auth/register", (req, res, ctx) => {
      isSubmitted = true;
      return res(ctx.json({ msg: "success" }));
    }),
    rest.post("/auth/login", (req, res, ctx) => {
      isSubmitted = true;
      return res(ctx.json({ msg: "success" }));
    })
  );

  beforeAll(() => server.listen());
  beforeEach(() => (isSubmitted = false));
  afterAll(() => server.close());

  it("Renders all fields in register mode", () => {
    const { getByTestId } = render(
      <AuthPopup registerMode={true} onClose={() => {}} />
    );

    expect(getByTestId("auth-username")).toBeTruthy();
    expect(getByTestId("auth-email")).toBeTruthy();
    expect(getByTestId("auth-password")).toBeTruthy();
    expect(getByTestId("auth-repeat-password")).toBeTruthy();
    expect(getByTestId("auth-id")).toBeTruthy();
    expect(getByTestId("auth-register-btn")).toBeTruthy();
  });

  it("Submits in register mode", async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(
      <AuthPopup registerMode={true} onClose={() => {}} />
    );

    await user.type(getByTestId("auth-username"), "loler");
    await user.type(getByTestId("auth-email"), "lol@gmail.com");
    await user.type(getByTestId("auth-password"), "12345");
    await user.type(getByTestId("auth-repeat-password"), "12345");
    await user.type(getByTestId("auth-id"), "test-id");
    fireEvent.click(getByTestId("auth-register-btn"));
    await new Promise((r) => setTimeout(r, 200));
    expect(isSubmitted).toBe(true);
  });

  it("Renders all fields in login mode", () => {
    const { getByTestId, queryByTestId } = render(
      <AuthPopup registerMode={false} onClose={() => {}} />
    );

    expect(queryByTestId("auth-username")).not.toBeTruthy();
    expect(getByTestId("auth-email")).toBeTruthy();
    expect(getByTestId("auth-password")).toBeTruthy();
    expect(queryByTestId("auth-repeat-password")).not.toBeTruthy();
    expect(queryByTestId("auth-id")).not.toBeTruthy();
    expect(getByTestId("auth-login-btn")).toBeTruthy();
  });

  it("Submits in login mode", async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(
      <AuthPopup registerMode={false} onClose={() => {}} />
    );

    await user.type(getByTestId("auth-email"), "lol@gmail.com");
    await user.type(getByTestId("auth-password"), "12345");
    fireEvent.click(getByTestId("auth-login-btn"));
    await new Promise((r) => setTimeout(r, 200));
    expect(isSubmitted).toBe(true);
  });

  it("Closes", () => {
    let closed = false;
    const { getByTestId } = render(
      <AuthPopup
        registerMode={false}
        onClose={() => {
          closed = true;
        }}
      />
    );
    getByTestId("auth-close").click();
    expect(closed).toBe(true);
  });
});

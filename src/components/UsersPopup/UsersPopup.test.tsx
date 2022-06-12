import { fireEvent, render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import { UserData } from "../../services/responses/responses";
import { UserProvider } from "../../store/userContext";
import UsersPopup from "./UsersPopup";

let isSubscribed = false;

const WrapperComponent = ({ isAuth, ...rest }: { isAuth: boolean }) => {
  const currentUser: UserData = {
    _id: "testerov",
    username: "tester",
    displayId: "tester25",
    description: "some text",
    avatarSrc: "",
    email: "tester@gmail.com",
    passwordHash: "12345",
    createdPins: [],
    savedPins: [],
    boards: [],
    subscribers: [],
    subscriptions: [],
  };

  return (
    <UserProvider
      value={{
        isAuth: isAuth,
        setTextPopup: () => {},
        setErrorPopup: () => {},
        updateUserInfo: () => {},
        authUserData: currentUser || undefined,
      }}
    >
      <UsersPopup
        userIds={["user1", "user2"]}
        title="users"
        onUnSubscribe={() => {
          isSubscribed = false;
        }}
        onSubscribe={() => {
          isSubscribed = true;
        }}
        onClose={() => {}}
        data-testid="users-popup"
      />
    </UserProvider>
  );
};
describe("Users popup test", () => {
  const server = setupServer(
    rest.get("/user/:id", (req, res, ctx) => {
      const id = req.params["id"] as string;
      const data: UserData = {
        _id: id,
        username: "john" + "_" + id,
        description: "",
        avatarSrc: "sample",
        displayId: "john95",
        email: "john95@mail.ru",
        passwordHash: "12345",
        createdPins: [],
        savedPins: [],
        boards: [],
        subscribers: id === "user2" ? ["testerov"] : [],
        subscriptions: [],
      };
      return res(ctx.json(data));
    }),
    rest.get("/files/:id", (req, res, ctx) => {
      return res(ctx.json({ url: "hello_there.png" }));
    })
  );

  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it("Renders all fields", async () => {
    const { getByTestId } = render(<WrapperComponent isAuth={true} />);

    await waitFor(() => {
      expect(getByTestId("users-popup-username-user1").textContent).toBe(
        "john_user1"
      );
    });

    expect(getByTestId("users-popup-username-user2").textContent).toBe(
      "john_user2"
    );

    expect(getByTestId("users-popup__title").textContent).toBe("users");
  });

  it("Clicks subscribe", async () => {
    isSubscribed = false;
    const { getByTestId } = render(<WrapperComponent isAuth={true} />);

    await waitFor(() => {
      expect(getByTestId("users-popup-username-user1").textContent).toBe(
        "john_user1"
      );
    });

    fireEvent.click(getByTestId("users-popup-subscribe-user1"));

    expect(isSubscribed).toBe(true);
  });

  it("Clicks unsubscribe", async () => {
    isSubscribed = true;
    const { getByTestId } = render(<WrapperComponent isAuth={true} />);

    await waitFor(() => {
      expect(getByTestId("users-popup-username-user1").textContent).toBe(
        "john_user1"
      );
    });

    fireEvent.click(getByTestId("users-popup-unsubscribe-user2"));

    expect(isSubscribed).toBe(false);
  });
});

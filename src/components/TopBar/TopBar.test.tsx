import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "../../store/userContext";
import TopBar from "./TopBar";

const WrapperComponent = ({ isAuth = true, ...rest }: { isAuth?: boolean }) => {
  const currentUser = {
    _id: "test",
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
    <BrowserRouter>
      <UserProvider
        value={{
          isAuth: isAuth,
          setTextPopup: () => {},
          setErrorPopup: () => {},
          updateUserInfo: () => {},
          authUserData: currentUser || undefined,
        }}
      >
        <TopBar {...rest} />
      </UserProvider>
    </BrowserRouter>
  );
};

describe("Topbar test", () => {
  it("Displays all info desktop", () => {
    const { getByTestId, queryByTestId } = render(
      <WrapperComponent data-testid="top-bar" />
    );

    expect(getByTestId("top-bar-logo")).toBeTruthy();
    expect(getByTestId("home-btn")).toBeTruthy();
    expect(getByTestId("top-bar-search")).toBeTruthy();
    expect(queryByTestId("top-bar-burger")).not.toBeTruthy();
  });

  it("Displays unauth info desktop", () => {
    const { getByTestId, queryByTestId } = render(
      <WrapperComponent data-testid="top-bar" isAuth={false} />
    );

    expect(queryByTestId("profile-btn")).toBeFalsy();
    expect(queryByTestId("logout-btn")).toBeFalsy();
    expect(getByTestId("login-btn")).toBeTruthy();
    expect(getByTestId("register-btn")).toBeTruthy();
  });

  it("Displays auth info desktop", () => {
    const { getByTestId, queryByTestId } = render(
      <WrapperComponent data-testid="top-bar" />
    );

    expect(getByTestId("profile-btn")).toBeTruthy();
    expect(getByTestId("logout-btn")).toBeTruthy();
    expect(queryByTestId("login-btn")).toBeFalsy();
    expect(queryByTestId("register-btn")).toBeFalsy();
  });
});

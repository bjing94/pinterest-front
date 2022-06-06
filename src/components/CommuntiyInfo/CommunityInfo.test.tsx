import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserData } from "../../services/responses/responses";
import { UserProvider } from "../../store/userContext";
import CommunityInfo from "./CommunityInfo";

const WrapperComponent = ({
  isSubscribed,
  isAuth,
}: {
  isSubscribed: boolean;
  isAuth: boolean;
}) => {
  const currentUser: UserData = {
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
        <CommunityInfo
          data-testid="comm-info"
          username="tester"
          avatarId=""
          displayId="tester95"
          isSubscribed={isSubscribed}
          subscribersCount={5}
        />
      </UserProvider>
    </BrowserRouter>
  );
};

describe("Community info test", () => {
  it("Display info correctly", () => {
    const { getByTestId } = render(
      <WrapperComponent isSubscribed={false} isAuth />
    );

    expect(getByTestId("community-username").textContent).toBe("tester");
    expect(getByTestId("community-subscribers").textContent).toBe(
      "5 subscribers"
    );
    expect(getByTestId("community-btn").textContent).toBe("Subscribe");
  });

  it("Display info when subscribed", () => {
    const { getByTestId } = render(<WrapperComponent isSubscribed isAuth />);

    expect(getByTestId("community-btn").textContent).toBe("Unsubscribe");
  });

  it("Doesn't show subscribe to unauth user", () => {
    const { queryByTestId } = render(
      <WrapperComponent isSubscribed isAuth={false} />
    );

    expect(queryByTestId("community-btn")).toBeFalsy();
  });
});

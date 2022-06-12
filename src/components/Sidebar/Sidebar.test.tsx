import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "../../store/userContext";
import Sidebar from "./Sidebar";

// const WrapperComponent = () => {
//   return (
//     <BrowserRouter>
//       <Sidebar
//         data-testid="sidebar"
//         isAuth={false}
//         show
//         onClickLogin={() => {}}
//         onClickRegister={() => {}}
//       />
//     </BrowserRouter>
//   );
// };
describe("Sidebar test", () => {
  it("Renders fields for unauth", () => {
    const { getByTestId, queryByTestId } = render(
      <BrowserRouter>
        <Sidebar
          data-testid="sidebar"
          isAuth={false}
          show
          onClickLogin={() => {}}
          onClickRegister={() => {}}
        />
      </BrowserRouter>
    );

    expect(getByTestId("sidebar-login")).toBeTruthy();
    expect(getByTestId("sidebar-register")).toBeTruthy();
    expect(queryByTestId("sidebar-profile")).not.toBeTruthy();
  });

  it("Renders fields for auth", () => {
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

    const { getByTestId, queryByTestId } = render(
      <BrowserRouter>
        <UserProvider
          value={{
            isAuth: true,
            setTextPopup: () => {},
            setErrorPopup: () => {},
            updateUserInfo: () => {},
            authUserData: currentUser || undefined,
          }}
        >
          <Sidebar
            data-testid="sidebar"
            isAuth={true}
            show
            onClickLogin={() => {}}
            onClickRegister={() => {}}
          />
        </UserProvider>
      </BrowserRouter>
    );

    expect(queryByTestId("sidebar-login")).not.toBeTruthy();
    expect(queryByTestId("sidebar-register")).not.toBeTruthy();
    expect(getByTestId("sidebar-profile")).toBeTruthy();
  });

  it("Clicks login", () => {
    let clickedLogin = false;
    const { getByTestId } = render(
      <BrowserRouter>
        <Sidebar
          data-testid="sidebar"
          isAuth={false}
          show
          onClickLogin={() => {
            clickedLogin = true;
          }}
          onClickRegister={() => {}}
        />
      </BrowserRouter>
    );

    fireEvent.click(getByTestId("sidebar-login"));
    expect(clickedLogin).toBe(true);
  });

  it("Clicks register", () => {
    let clickedReg = false;
    const { getByTestId } = render(
      <BrowserRouter>
        <Sidebar
          data-testid="sidebar"
          isAuth={false}
          show
          onClickLogin={() => {}}
          onClickRegister={() => {
            clickedReg = true;
          }}
        />
      </BrowserRouter>
    );

    fireEvent.click(getByTestId("sidebar-register"));
    expect(clickedReg).toBe(true);
  });
});

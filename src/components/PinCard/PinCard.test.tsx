import { fireEvent, render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import { HTMLAttributes } from "react";
import { BrowserRouter } from "react-router-dom";
import { PinData, UserData } from "../../services/responses/responses";
import { UserProvider } from "../../store/userContext";
import PinCard, { PinCardProps } from "./PinCard";

const WrapperComponent = ({
  isAuth,
  userId = "test",
  ...rest
}: PinCardProps &
  HTMLAttributes<HTMLDivElement> & { isAuth: boolean; userId?: string }) => {
  const currentUser: UserData = {
    _id: userId,
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
          setErrorPopup: (err: string) => {
            console.log("error", err);
          },
          updateUserInfo: () => {},
          authUserData: currentUser || undefined,
        }}
      >
        <PinCard data-testid="edit-pin" {...rest} showInfo={true} />
      </UserProvider>
    </BrowserRouter>
  );
};

describe("Edit board popup test", () => {
  const server = setupServer(
    rest.get("/files/:id", (req, res, ctx) => {
      return res(ctx.json({ url: "hello_there.png" }));
    }),
    rest.get("/user/:id", (req, res, ctx) => {
      const data: UserData = {
        _id: "test5",
        username: "john",
        description: "",
        avatarSrc: "sample",
        displayId: "john95",
        email: "john95@mail.ru",
        passwordHash: "12345",
        createdPins: [],
        savedPins: [],
        boards: [],
        subscribers: [],
        subscriptions: [],
      };
      return res(ctx.json(data));
    }),
    rest.get("/pin/:id", (req, res, ctx) => {
      const id = req.params["id"] as string;

      const response: PinData = {
        _id: id,
        title: "testing" + id,
        userId: "tester",
        content: "hehe-hoho",
        imgId: "hmhm25",
        _v: "",
      };
      return res(ctx.json(response));
    }),
    rest.delete("/pin/:id", (req, res, ctx) => {
      const id = req.params["id"] as string;

      const response: PinData = {
        _id: id,
        title: "testing" + id,
        userId: "tester",
        content: "",
        imgId: "",
        _v: "",
      };
      return res(ctx.json(response));
    })
  );

  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it("Renders all info", async () => {
    const { getByTestId } = render(
      <WrapperComponent
        pinId="pin1"
        isAuth={true}
        boards={[]}
        isSaved={false}
        onSavePin={() => {}}
        onSetBoardId={() => {}}
        onShowCreateBoard={() => {}}
      />
    );
    await waitFor(() => {
      expect(
        //eslint-disable-next-line
        (getByTestId("edit-pin").querySelector("img") as HTMLImageElement).src
      ).toBe("http://localhost/undefined/images/hello_there.png");
    });

    expect(getByTestId("pin-card-title").textContent).toBe("testingpin1");

    expect(
      //eslint-disable-next-line
      getByTestId("pin-card-profile").querySelector(".typography")!.textContent
    ).toBe("john");
  });

  it("Overlay contains info for Auth", async () => {
    const { getByTestId, queryByTestId } = render(
      <WrapperComponent
        pinId="pin1"
        isAuth={true}
        boards={[]}
        isSaved={false}
        onSavePin={() => {}}
        onSetBoardId={() => {}}
        onShowCreateBoard={() => {}}
      />
    );
    await waitFor(() => {
      expect(
        //eslint-disable-next-line
        (getByTestId("edit-pin").querySelector("img") as HTMLImageElement).src
      ).toBe("http://localhost/undefined/images/hello_there.png");
    });

    expect(getByTestId("pin-card-save-btn")).toBeTruthy();
    expect(getByTestId("pin-card-boards")).toBeTruthy();
    expect(getByTestId("pin-card-link")).toBeTruthy();
    expect(queryByTestId("pin-card-edit")).toBeFalsy();
  });

  it("Overlay contains info for unauth", async () => {
    const { getByTestId, queryByTestId } = render(
      <WrapperComponent
        pinId="pin1"
        isAuth={false}
        boards={[]}
        isSaved={false}
        onSavePin={() => {}}
        onSetBoardId={() => {}}
        onShowCreateBoard={() => {}}
      />
    );
    await waitFor(() => {
      expect(
        //eslint-disable-next-line
        (getByTestId("edit-pin").querySelector("img") as HTMLImageElement).src
      ).toBe("http://localhost/undefined/images/hello_there.png");
    });

    expect(queryByTestId("pin-card-save-btn")).toBeFalsy();
    expect(queryByTestId("pin-card-boards")).toBeFalsy();
    expect(getByTestId("pin-card-link")).toBeTruthy();
    expect(queryByTestId("pin-card-edit")).toBeFalsy();
  });

  it("Overlay contains info for owner", async () => {
    const { getByTestId } = render(
      <WrapperComponent
        pinId="pin1"
        isAuth={true}
        boards={[]}
        isSaved={false}
        onSavePin={() => {}}
        onSetBoardId={() => {}}
        onShowCreateBoard={() => {}}
        isOwner={true}
      />
    );
    await waitFor(() => {
      expect(
        //eslint-disable-next-line
        (getByTestId("edit-pin").querySelector("img") as HTMLImageElement).src
      ).toBe("http://localhost/undefined/images/hello_there.png");
    });

    expect(getByTestId("pin-card-save-btn")).toBeTruthy();
    expect(getByTestId("pin-card-boards")).toBeTruthy();
    expect(getByTestId("pin-card-link")).toBeTruthy();
    expect(getByTestId("pin-card-edit")).toBeTruthy();
  });

  it("Pin saves", async () => {
    let wasSaved = false;

    const { getByTestId } = render(
      <WrapperComponent
        pinId="pin1"
        isAuth={true}
        boards={[]}
        isSaved={false}
        onSavePin={() => {
          wasSaved = true;
        }}
        onSetBoardId={() => {}}
        onShowCreateBoard={() => {}}
        isOwner={true}
      />
    );

    fireEvent.click(getByTestId("pin-card-save-btn"));

    expect(wasSaved).toBe(true);
  });
});

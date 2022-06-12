import { fireEvent, render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import { HTMLAttributes } from "react";
import { PinData, UserData } from "../../services/responses/responses";
import { UserProvider } from "../../store/userContext";
import EditPinPopup, { EditPinPopupProps } from "./EditPinPopup";

const WrapperComponent = ({
  isAuth,
  ...rest
}: EditPinPopupProps &
  HTMLAttributes<HTMLDivElement> & { isAuth: boolean }) => {
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
    <UserProvider
      value={{
        isAuth: isAuth,
        setTextPopup: () => {},
        setErrorPopup: () => {},
        updateUserInfo: () => {},
        authUserData: currentUser || undefined,
      }}
    >
      <EditPinPopup {...rest} />
    </UserProvider>
  );
};

describe("Edit pin popup test", () => {
  const server = setupServer(
    rest.get("/pin/:id", (req, res, ctx) => {
      const id = req.params["id"] as string;

      const response: PinData = {
        _id: id,
        title: "testing" + id,
        userId: "tester",
        content: "hehe-hoho",
        imgId: "",
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

  it("Renders all fields", async () => {
    const { getByTestId } = render(
      <WrapperComponent
        data-testid="edit-pin"
        pinId="pin1"
        title="Edit Pin"
        onClose={() => {}}
        onUpdate={() => {}}
        onDelete={() => {}}
        isAuth={true}
      />
    );

    await waitFor(() => {
      expect(getByTestId("edit-pin-delete-btn")).toBeTruthy();
    });
    expect(getByTestId("edit-pin-cancel-btn")).toBeTruthy();
    expect(getByTestId("edit-pin-update-btn")).toBeTruthy();
    await waitFor(() => {
      expect((getByTestId("edit-pin-title") as HTMLInputElement).value).toBe(
        "testingpin1"
      );
    });
    expect(
      (getByTestId("edit-pin-description") as HTMLInputElement).value
    ).toBe("hehe-hoho");
  });

  it("Closes", async () => {
    let isClosed = false;
    const { getByTestId } = render(
      <WrapperComponent
        data-testid="edit-pin"
        pinId="pin1"
        title="Edit Pin"
        onClose={() => {
          isClosed = true;
        }}
        onUpdate={() => {}}
        onDelete={() => {}}
        isAuth={true}
      />
    );

    await waitFor(() => {
      expect(getByTestId("edit-pin-cancel-btn")).toBeTruthy();
    });
    fireEvent.click(getByTestId("edit-pin-cancel-btn"));

    expect(isClosed).toBe(true);
  });

  it("Submits", async () => {
    let isUpdated = false;
    const { getByTestId } = render(
      <WrapperComponent
        data-testid="edit-pin"
        pinId="pin1"
        title="Edit Pin"
        onClose={() => {}}
        onUpdate={() => {
          isUpdated = true;
        }}
        onDelete={() => {}}
        isAuth={true}
      />
    );

    await waitFor(() => {
      expect((getByTestId("edit-pin-title") as HTMLInputElement).value).toBe(
        "testingpin1"
      );
    });

    fireEvent.input(getByTestId("edit-pin-title"), {
      target: { value: "newTitle25" },
    });

    fireEvent.click(getByTestId("edit-pin-update-btn"));
    await waitFor(() => {
      expect(isUpdated).toBe(true);
    });
  });

  it("Deletes", async () => {
    let isDeleted = false;
    const { getByTestId } = render(
      <WrapperComponent
        data-testid="edit-pin"
        pinId="pin1"
        title="Edit Pin"
        onClose={() => {}}
        onUpdate={() => {}}
        onDelete={() => {
          isDeleted = true;
        }}
        isAuth={true}
      />
    );

    await waitFor(() => {
      expect((getByTestId("edit-pin-title") as HTMLInputElement).value).toBe(
        "testingpin1"
      );
    });

    fireEvent.click(getByTestId("edit-pin-delete-btn"));
    await waitFor(() => {
      expect(isDeleted).toBe(true);
    });
  });
});

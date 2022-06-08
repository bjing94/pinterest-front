import { fireEvent, render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import { BoardData } from "../../services/responses/responses";
import DropdownBoards from "./DropdownBoards";

describe("Dropdown boards test", () => {
  const server = setupServer(
    rest.get("/board/:id", (req, res, ctx) => {
      const id = req.params["id"] as string;
      const response: BoardData = {
        _id: id,
        title: "testing" + id,
        pins: [],
        createdAt: "",
        updatedAt: "",
        userId: "tester",
      };
      return res(ctx.json(response));
    })
  );

  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it("Renders boards", async () => {
    const boardIds = ["board1", "board2"];
    const showDropdown = true;

    const { getByTestId } = render(
      <DropdownBoards
        data-testid="dropdown-boards"
        onSelectBoard={() => {}}
        onClickArrow={() => {}}
        showDropdown={showDropdown}
        boardIds={boardIds}
      />
    );

    await waitFor(() => {
      expect(
        // eslint-disable-next-line
        getByTestId("dropdown-boards").querySelectorAll("li").length
      ).toBe(2);
    });

    expect(
      // eslint-disable-next-line
      getByTestId("dropdown-boards").querySelectorAll(
        ".board-dropdown__item__name"
      )[0].textContent
    ).toBe("testingboard1");

    expect(
      // eslint-disable-next-line
      getByTestId("dropdown-boards").querySelectorAll(
        ".board-dropdown__item__name"
      )[1].textContent
    ).toBe("testingboard2");
  });

  it("Board selection works", async () => {
    const boardIds = ["board1", "board2"];
    const showDropdown = true;
    let selected = false;
    const { getByTestId } = render(
      <DropdownBoards
        data-testid="dropdown-boards"
        onSelectBoard={() => {
          selected = true;
        }}
        onClickArrow={() => {}}
        showDropdown={showDropdown}
        boardIds={boardIds}
      />
    );
    await waitFor(() => {
      expect(
        // eslint-disable-next-line
        getByTestId("dropdown-boards").querySelectorAll(
          ".board-dropdown__item__name"
        )[0]
      ).toBeTruthy();
    });

    fireEvent.click(
      // eslint-disable-next-line
      getByTestId("dropdown-boards").querySelectorAll(
        ".board-dropdown__item__btn"
      )[0]
    );

    await waitFor(() => {
      expect(
        // eslint-disable-next-line
        getByTestId("dropdown-boards").querySelector(
          ".board-dropdown__selection"
        )!.textContent
      ).toBe("testingboa...");
    });

    expect(selected).toBe(true);
  });

  it("Dropdown is hidden", async () => {
    const boardIds = ["board1", "board2"];
    const showDropdown = false;
    const { getByTestId } = render(
      <DropdownBoards
        data-testid="dropdown-boards"
        onSelectBoard={() => {}}
        onClickArrow={() => {}}
        showDropdown={showDropdown}
        boardIds={boardIds}
      />
    );

    expect(
      // eslint-disable-next-line
      getByTestId("dropdown-boards").querySelector(".dropdown-list")
    ).toBeFalsy();
  });

  it("Arrow works", async () => {
    const boardIds = ["board1", "board2"];
    const showDropdown = false;
    let clickedArrow = false;

    const { getByTestId } = render(
      <DropdownBoards
        data-testid="dropdown-boards"
        onSelectBoard={() => {}}
        onClickArrow={() => {
          clickedArrow = true;
        }}
        showDropdown={showDropdown}
        boardIds={boardIds}
      />
    );

    const arrowBtn =
      // eslint-disable-next-line
      getByTestId("dropdown-boards").querySelector(".btn-round ");
    expect(arrowBtn).toBeTruthy();

    if (!arrowBtn) return;

    fireEvent.click(arrowBtn);

    expect(clickedArrow).toBe(true);
  });
});

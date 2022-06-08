import { fireEvent, render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import { UpdateBoardDto } from "../../services/dto/update-board.dto";
import { BoardData } from "../../services/responses/responses";
import EditBoardPopup from "./EditBoardPopup";

describe("Edit board popup test", () => {
  let newTitle = "";
  let isDeleted = false;
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
    }),
    rest.patch("/board/:id", (req, res, ctx) => {
      const id = req.params["id"] as string;
      const dto: UpdateBoardDto = req.body as UpdateBoardDto;
      if (dto.title) {
        newTitle = dto.title;
      }

      const response: BoardData = {
        _id: id,
        title: "testing" + id,
        pins: [],
        createdAt: "",
        updatedAt: "",
        userId: "tester",
      };
      return res(ctx.json(response));
    }),
    rest.delete("/board/:id", (req, res, ctx) => {
      const id = req.params["id"] as string;
      isDeleted = true;

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

  it("Renders all fields", async () => {
    const { getByTestId } = render(
      <EditBoardPopup
        data-testid="edit-board"
        boardId="board1"
        title="Edit Board"
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );

    await waitFor(() => {
      expect((getByTestId("edit-board-title") as HTMLInputElement).value).toBe(
        "testingboard1"
      );
    });

    expect(getByTestId("edit-board-delete-btn")).toBeTruthy();
    expect(getByTestId("edit-board-update-btn")).toBeTruthy();
  });

  it("Submits", async () => {
    let isSubmitted = false;
    const { getByTestId } = render(
      <EditBoardPopup
        data-testid="edit-board"
        boardId="board1"
        title="Edit Board"
        onClose={() => {}}
        onSubmit={() => {
          isSubmitted = true;
        }}
      />
    );

    await waitFor(() => {
      expect((getByTestId("edit-board-title") as HTMLInputElement).value).toBe(
        "testingboard1"
      );
    });
    fireEvent.input(getByTestId("edit-board-title"), {
      target: { value: "new title" },
    });
    fireEvent.click(getByTestId("edit-board-update-btn"));
    await waitFor(() => {
      expect((getByTestId("edit-board-title") as HTMLInputElement).value).toBe(
        "new title"
      );
    });
    expect(newTitle).toBe("new title");
    await waitFor(() => {
      expect(isSubmitted).toBe(true);
    });
  });

  it("Closes", async () => {
    let isClosed = false;
    const { getByTestId } = render(
      <EditBoardPopup
        data-testid="edit-board"
        boardId="board1"
        title="Edit Board"
        onClose={() => {
          isClosed = true;
        }}
        onSubmit={() => {}}
      />
    );

    fireEvent.click(
      // eslint-disable-next-line testing-library/no-node-access
      getByTestId("edit-board").querySelector("*[class='popup__background']")!
    );

    expect(isClosed).toBe(true);
  });

  it("Deletes", async () => {
    const { getByTestId } = render(
      <EditBoardPopup
        data-testid="edit-board"
        boardId="board1"
        title="Edit Board"
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );

    fireEvent.click(getByTestId("edit-board-delete-btn"));
    await waitFor(() => {
      expect(isDeleted).toBe(true);
    });
  });
});

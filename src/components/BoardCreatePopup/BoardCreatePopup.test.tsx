import { fireEvent, render } from "@testing-library/react";
import BoardCreatePopup from "./BoardCreatePopup";

describe("Board create popup test", () => {
  it("Renders all fields", () => {
    const { getByTestId, getByPlaceholderText } = render(
      <BoardCreatePopup onClose={() => {}} onSubmit={() => {}} />
    );

    expect(getByTestId("board-create-title")).toBeTruthy();
    expect(getByPlaceholderText("Board name")).toBeTruthy();
    expect(getByTestId("board-create-btn")).toBeTruthy();
  });

  it("Closes", () => {
    let isClosed = false;
    const { getByTestId } = render(
      <BoardCreatePopup
        data-testid="board-create-popup"
        onClose={() => {
          isClosed = true;
        }}
        onSubmit={() => {}}
      />
    );

    fireEvent.click(
      // eslint-disable-next-line testing-library/no-node-access
      getByTestId("board-create-popup").querySelector(
        "*[class='popup__background']"
      )!
    );
    expect(isClosed).toBe(true);
  });
});

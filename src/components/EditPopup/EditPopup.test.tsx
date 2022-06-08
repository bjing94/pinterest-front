import { fireEvent, render } from "@testing-library/react";
import EditPopup from "./EditPopup";

describe("Edit popup test", () => {
  it("Display correct title", () => {
    const { getByText } = render(
      <EditPopup
        data-testid="edit-popup"
        title="test"
        bottomContent={<div></div>}
        mainContent={<div></div>}
        onClose={() => {}}
      />
    );

    expect(getByText("test")).toBeTruthy();
  });

  it("Display correct content", () => {
    const { getByTestId } = render(
      <EditPopup
        data-testid="edit-popup"
        title="test"
        bottomContent={<div data-testid="bottom"></div>}
        mainContent={<div data-testid="main"></div>}
        onClose={() => {}}
      />
    );

    expect(getByTestId("bottom")).toBeTruthy();
    expect(getByTestId("main")).toBeTruthy();
  });

  it("Closes", () => {
    let isClosed = false;
    const { getByTestId } = render(
      <EditPopup
        data-testid="edit-popup"
        title="test"
        bottomContent={<div data-testid="bottom"></div>}
        mainContent={<div data-testid="main"></div>}
        onClose={() => {
          isClosed = true;
        }}
      />
    );
    //eslint-disable-next-line
    const closeBtn = getByTestId("edit-popup").querySelector(".btn-round");
    expect(closeBtn).toBeTruthy();
    fireEvent.click(closeBtn!);
    expect(isClosed).toBe(true);
  });
});

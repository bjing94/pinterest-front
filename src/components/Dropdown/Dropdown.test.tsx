import { fireEvent, render } from "@testing-library/react";
import Dropdown from "./Dropdown";

describe("Dropdown test", () => {
  it("Displays content", () => {
    const { getByTestId } = render(
      <Dropdown data-testid="dropdown">
        <div className="test">item 1</div>
        <div className="test">item 2</div>
      </Dropdown>
    );
    // eslint-disable-next-line testing-library/no-node-access
    expect(getByTestId("dropdown").getElementsByClassName("test").length).toBe(
      2
    );
  });

  it("Applies styles", () => {
    const { getByTestId } = render(
      <Dropdown data-testid="dropdown" className="my-dropdown">
        <div className="test">item 1</div>
        <div className="test">item 2</div>
      </Dropdown>
    );
    expect(getByTestId("dropdown").className).toContain("my-dropdown");
  });

  it("Items are clickable", () => {
    let itemClicked = false;
    const { getByTestId } = render(
      <Dropdown
        data-testid="dropdown"
        className="my-dropdown"
        onClickItem={() => {
          itemClicked = true;
        }}
      >
        <div data-testid="dropdown-item" className="test">
          item 1
        </div>
        <div className="test">item 2</div>
      </Dropdown>
    );
    fireEvent.click(getByTestId("dropdown-item"));
    expect(itemClicked).toBe(true);
  });
});

import Popup from "./Popup";
import { fireEvent, render } from "@testing-library/react";

describe("Popup test", () => {
  it("Renders children", () => {
    const { getByTestId } = render(
      <Popup>
        <div data-testid="sample1">1</div>
        <div data-testid="sample2" className="test">
          221
        </div>
      </Popup>
    );

    expect(getByTestId("sample1").textContent).toBe("1");
    expect(getByTestId("sample2").textContent).toBe("221");
    expect(getByTestId("sample2").className).toContain("test");
  });

  it("Applies styles", () => {
    const { getByTestId } = render(
      <Popup data-testid="popup" className="test2"></Popup>
    );

    expect(getByTestId("popup").className).toContain("test2");
  });

  it("Clicks background", () => {
    let backgroundClicked = false;
    const { getByTestId } = render(
      <Popup
        data-testid="popup"
        className="test2"
        onClickBackground={() => {
          backgroundClicked = true;
        }}
      ></Popup>
    );

    //eslint-disable-next-line
    fireEvent.click(getByTestId("popup").querySelector(".popup__background")!);
    expect(backgroundClicked).toBe(true);
  });
});

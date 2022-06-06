import { render } from "@testing-library/react";
import ButtonGroup from "./ButtonGroup";

describe("Button group test", () => {
  it("Renders all buttons", () => {
    const { getByTestId } = render(
      <ButtonGroup>
        <button data-testid="btn1">btn 1</button>
        <button data-testid="btn2">btn 2</button>
        <button data-testid="btn3">btn 3</button>
      </ButtonGroup>
    );
    expect(getByTestId("btn1")).toBeTruthy();
    expect(getByTestId("btn2")).toBeTruthy();
    expect(getByTestId("btn3")).toBeTruthy();
  });
});

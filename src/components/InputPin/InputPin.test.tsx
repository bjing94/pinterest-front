import { render } from "@testing-library/react";
import { InputPin } from "./InputPin";

describe("Input pin test", () => {
  it("Displays info correctly", () => {
    const { getByTestId } = render(<InputPin data-testid="input-pin" />);

    expect(getByTestId("input-pin-text")).toBeTruthy();
    expect(getByTestId("input-pin-tip")).toBeTruthy();
    expect(getByTestId("input-pin")).toBeTruthy();
  });
});

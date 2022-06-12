import { render } from "@testing-library/react";
import RoundButton from "./RoundButton";

describe("Round button test", () => {
  it("Renders content", () => {
    const { getByTestId } = render(
      <RoundButton data-testid="rnd-button">Sample</RoundButton>
    );

    expect(getByTestId("rnd-button").textContent).toBe("Sample");
  });

  it("Passes styles", () => {
    const { getByTestId } = render(
      <RoundButton data-testid="rnd-button" className="test">
        Sample
      </RoundButton>
    );

    expect(getByTestId("rnd-button").className).toContain("test");
  });
});

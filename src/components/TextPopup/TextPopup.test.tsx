import { render } from "@testing-library/react";
import TextPopup from "./TextPopup";

describe("Text popup test", () => {
  it("Renders text", () => {
    const { getByTestId } = render(
      <TextPopup data-testid="test">test message</TextPopup>
    );

    expect(getByTestId("test").textContent).toBe("test message");
  });

  it("Changes type", () => {
    const { getByTestId } = render(
      <TextPopup data-testid="test" type="warning">
        test message
      </TextPopup>
    );

    expect(getByTestId("test").className).toContain("warning");
  });
});

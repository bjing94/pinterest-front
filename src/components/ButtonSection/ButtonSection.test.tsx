import { render } from "@testing-library/react";
import ButtonSection from "./ButtonSection";

describe("Button section test", () => {
  it("Renders correctly", () => {
    const { getByTestId } = render(
      <ButtonSection data-testid="btn-section" className="test">
        test1
      </ButtonSection>
    );

    expect(getByTestId("btn-section")).toBeTruthy();
    expect(getByTestId("btn-section").getAttribute("class")).toContain("test");
    expect(getByTestId("btn-section").textContent).toBe("test1");
  });

  it("Applies styles when selected", () => {
    const { getByTestId } = render(
      <ButtonSection isActive={true} data-testid="btn-section" className="test">
        test1
      </ButtonSection>
    );

    expect(getByTestId("btn-section").getAttribute("class")).toContain(
      "btn-section-active"
    );
  });
});

import { render } from "@testing-library/react";
import Typography from "./Typography";

describe("Typography test", () => {
  it("Renders text", () => {
    const { getByTestId } = render(
      <Typography data-testid="test" fontSize={12}>
        Test
      </Typography>
    );

    const element = getByTestId("test");
    expect(element.textContent).toBe("Test");
    expect(element.style.fontSize).toBe("12px");
    expect(element.style.lineHeight).toBe("18px");
  });

  it("Passes styles", () => {
    const { getByTestId } = render(
      <Typography data-testid="test" fontSize={12} className="my-text">
        Test
      </Typography>
    );

    const element = getByTestId("test");
    expect(element.className).toContain("my-text");
  });
});

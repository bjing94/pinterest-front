import { fireEvent, render } from "@testing-library/react";
import Card from "./Card";

describe("Card test", () => {
  it("Card renders content", () => {
    const { getByTestId } = render(
      <Card data-testid="card">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Card>
    );
    expect(getByTestId("card").childNodes.length).toBe(3);
  });

  it("Card applies styles", () => {
    const { getByTestId } = render(
      <Card data-testid="card" className="test"></Card>
    );
    expect(getByTestId("card").className).toContain("test");
  });

  it("Card clicks", () => {
    let clicked = false;
    const { getByTestId } = render(
      <Card
        data-testid="card"
        onClick={() => {
          clicked = true;
        }}
      >
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Card>
    );
    fireEvent.click(getByTestId("card"));
    expect(clicked).toBe(true);
  });
});

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./Button";
import React from "react";

describe("Button element", () => {
  test("Button renders text passed", () => {
    const { getByText } = render(<Button>Sample</Button>);
    expect(getByText("Sample")).toBeTruthy();
  });

  test("Button is clickable", () => {
    let val = 0;
    const { getByText } = render(
      <Button
        onClick={() => {
          val = val + 1;
        }}
      >
        Sample
      </Button>
    );
    getByText("Sample").click();
    expect(val).toEqual(1);
  });

  test("Button receives styles", () => {
    const { getByText } = render(
      <Button className="test-btn" color="primary">
        Sample
      </Button>
    );
    expect(getByText("Sample").classList).toContain("test-btn");
    expect(getByText("Sample").classList).toContain("primary");
  });
});

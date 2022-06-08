import { render } from "@testing-library/react";
import Container from "./Container";

describe("Container test", () => {
  it("Renders children", () => {
    const { getByTestId } = render(
      <Container data-testid="container">
        <div>child</div>
      </Container>
    );

    expect(getByTestId("container").childNodes.length).toBe(1);
  });
});

import { render } from "@testing-library/react";
import Box from "./Box";

describe("Box element", () => {
  test("Box renders content", () => {
    const { getByTestId } = render(
      <Box data-testid="my-box">
        <p>sample 1</p>
        <p>sample 2</p>
        <p>sample 3</p>
      </Box>
    );
    expect(getByTestId("my-box")).toBeTruthy();
    expect(getByTestId("my-box").childNodes.length).toEqual(3);
  });

  test("Box receives styles", () => {
    const { getByTestId } = render(
      <Box
        data-testid="my-box"
        padding="10px"
        margin="5px"
        border="1px solid black"
      ></Box>
    );
    expect(getByTestId("my-box").style.padding).toBe("10px");
    expect(getByTestId("my-box").style.margin).toBe("5px");
    expect(getByTestId("my-box").style.border).toBe("1px solid black");
  });
});

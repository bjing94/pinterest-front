import { render } from "@testing-library/react";
import Flexbox from "./Flexbox";

describe("Flexbox test", () => {
  it("Renders children", () => {
    const { getByTestId } = render(
      <Flexbox data-testid="flexbox">
        <div>item-1</div>
        <div>item-2</div>
        <div>item-3</div>
      </Flexbox>
    );

    expect(getByTestId("flexbox").childNodes.length).toBe(3);
  });

  it("Styles are correct", () => {
    const { getByTestId } = render(
      <Flexbox
        data-testid="flexbox"
        justifyContent="center"
        alignItems="flex-end"
        className="my-flexxx"
      ></Flexbox>
    );

    expect(getByTestId("flexbox").style.justifyContent).toBe("center");
    expect(getByTestId("flexbox").style.alignItems).toBe("flex-end");
    expect(getByTestId("flexbox").className).toContain("my-flexxx");
  });
});

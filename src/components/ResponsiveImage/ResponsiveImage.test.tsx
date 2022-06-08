import { render } from "@testing-library/react";
import ResponsiveImage from "./ResponsiveImage";

describe("Responsive image test", () => {
  it("Passes correct src", () => {
    const { getByTestId } = render(
      <div style={{ width: "200px" }}>
        <ResponsiveImage data-testid="responsive" src="example-src" />
      </div>
    );

    expect(
      //eslint-disable-next-line
      getByTestId("responsive").querySelector("img")!.src
    ).toBe("http://localhost/example-src");
  });

  it("Passes overlay", () => {
    const { getByTestId } = render(
      <div style={{ width: "100px" }}>
        <ResponsiveImage
          data-testid="responsive"
          src="example-src"
          overlayContent={<div>sample</div>}
        />
      </div>
    );
    //eslint-disable-next-line
    const overlayChild = getByTestId("responsive").querySelector(
      ".responsive-image__overlay"
    )!.childNodes[0] as HTMLDivElement;
    expect(overlayChild.textContent).toBe("sample");
  });
});

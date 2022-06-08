import { fireEvent, render, waitFor } from "@testing-library/react";
import Input from "./Input";

describe("Flexbox test", () => {
  it("Renders info correctly", () => {
    const { getByTestId } = render(
      <div data-testid="input-container">
        <Input
          data-testid="input"
          placeholder="TEST"
          value={"testik"}
          onInput={() => {}}
          label="test2"
        />
      </div>
    );
    const containerEl = getByTestId("input-container") as HTMLDivElement;
    const inputEl = getByTestId("input") as HTMLInputElement;

    expect(inputEl.placeholder).toBe("TEST");
    expect(inputEl.value).toBe("testik");
    // eslint-disable-next-line
    expect(containerEl.querySelector("label")!.textContent).toBe("test2");
  });

  it("Input works", async () => {
    let input = "";
    const { getByTestId } = render(
      <div data-testid="input-container">
        <Input
          data-testid="input"
          placeholder="TEST"
          value={"testik"}
          onInput={(data: any) => {
            input = data.currentTarget.value;
          }}
          label="test2"
        />
      </div>
    );
    const inputEl = getByTestId("input") as HTMLInputElement;

    fireEvent.input(inputEl, { target: { value: "12345" } });
    await waitFor(() => {
      expect(input).toBe("12345");
    });
  });
});

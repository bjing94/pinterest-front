import { fireEvent, render } from "@testing-library/react";
import InputSearch from "./InputSearch";

describe("Input search test", () => {
  it("Renders correctly", () => {
    const { getByTestId } = render(
      <InputSearch
        data-testid="input-search"
        placeholder="search"
        onChange={() => {}}
      />
    );
    const inputElement = getByTestId("input-search") as HTMLInputElement;

    expect(inputElement.placeholder).toBe("search");
    expect(getByTestId("input-search-icon")).toBeTruthy();
  });

  it("Input works", async () => {
    let input = "";
    const { getByTestId } = render(
      <InputSearch
        data-testid="input-search"
        placeholder="search"
        onChange={(data: any) => {
          input = data.currentTarget.value;
        }}
      />
    );
    const inputElement = getByTestId("input-search") as HTMLInputElement;

    fireEvent.input(inputElement, { target: { value: "12345" } });
    expect(input).toBe("12345");
  });
});

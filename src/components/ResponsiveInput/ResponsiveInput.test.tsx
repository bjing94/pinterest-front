import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { ResponsiveInput } from "./ResponsiveInput";

const WrapperComponent = ({ limit = 500 }: { limit?: number }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <ResponsiveInput
      data-testid="responsive-input"
      placeholder="test"
      tip="sample-tip"
      symbolsLimit={limit}
      value={inputValue}
      onTextInput={(value: string) => {
        setInputValue(value);
      }}
    />
  );
};
describe("Responsive input test", () => {
  it("Renders info correctly", () => {
    const { getByTestId } = render(<WrapperComponent />);

    const textArea = getByTestId("responsive-input").querySelector(
      "textarea"
    ) as HTMLTextAreaElement;

    expect(textArea.placeholder).toBe("test");
    expect(textArea.value).toBe("");

    const tip =
      getByTestId("responsive-input").querySelector(".input-tip__text");

    expect(tip?.textContent).toBe("sample-tip");
    const limit =
      getByTestId("responsive-input").querySelector(".input-tip__limit");

    expect(limit?.textContent).toBe("500");
  });

  it("Changes symbols limit on input", () => {
    const { getByTestId } = render(<WrapperComponent />);

    const textArea = getByTestId("responsive-input").querySelector(
      "textarea"
    ) as HTMLTextAreaElement;

    fireEvent.input(textArea, { target: { value: "12345" } });

    const limit =
      getByTestId("responsive-input").querySelector(".input-tip__limit");

    expect(limit?.textContent).toBe("495");
  });

  it("Doesn't allow to type above the limit", async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<WrapperComponent limit={3} />);

    const textArea = getByTestId("responsive-input").querySelector(
      "textarea"
    ) as HTMLTextAreaElement;

    await user.type(textArea, "165666");
    expect(textArea.textContent).toBe("165");
  });
});

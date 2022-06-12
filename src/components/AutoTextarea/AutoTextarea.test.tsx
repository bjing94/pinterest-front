import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { useState } from "react";
import AutoTextarea from "./AutoTextarea";
import userEvent from "@testing-library/user-event";

const WrapperComponent = React.forwardRef<
  HTMLTextAreaElement,
  { limit?: number }
>(({ limit }) => {
  const [input, setInput] = useState("");

  return (
    <div style={{ width: "200px" }}>
      <AutoTextarea
        value={input}
        onInput={(value: any) => {
          setInput(value);
        }}
        symbolsLimit={limit ?? 3}
      />
    </div>
  );
});

describe("Autotextarea test", () => {
  it("Displays input correctly", () => {
    let inputedValue = "";
    const { getByTestId } = render(
      <AutoTextarea
        value={inputedValue}
        onInput={(value: any) => {
          inputedValue = value;
        }}
      />
    );
    fireEvent.input(getByTestId("auto-textarea"), { target: { value: "165" } });
    expect(inputedValue).toBe("165");
  });

  it("Limits symbols", async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(<WrapperComponent />);

    await user.type(getByTestId("auto-textarea"), "165666");
    expect(getByTestId("auto-textarea").textContent).toBe("165");
    await user.clear(getByTestId("auto-textarea"));
    await user.type(getByTestId("auto-textarea"), "16");
    expect(getByTestId("auto-textarea").textContent).toBe("16");
  });
});

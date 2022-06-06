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

  // it("Grows with input", async () => {
  //   const user = userEvent.setup();
  //   const { getByTestId } = render(<WrapperComponent limit={500} />);
  //   const oldHeight = getByTestId("auto-textarea-container").style.height;
  //   await user.type(
  //     getByTestId("auto-textarea"),
  //     "16dfgdffffffffffffffffffffffffffffffffffffffffffffffffgdgdgfdgfdggfdgfdgdfdgfdgdfgdfgdgdgdfgdgfdgdfgfdgfdgfdgd5"
  //   );
  //   const newHeight = getByTestId("auto-textarea-container").style.height;
  //   console.log({ oldHeight, newHeight });
  //   console.log(getByTestId("auto-textarea-container").childNodes);
  //   expect(oldHeight).not.toBe(newHeight);
  // });

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

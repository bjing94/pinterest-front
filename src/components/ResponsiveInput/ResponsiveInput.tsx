import React, { useRef, useState } from "react";
import { BaseStyle } from "../../types/types";
import Flexbox from "../Flexbox/Flexbox";

import "./ResponsiveInput.scss";

interface ResponsiveInputProps extends BaseStyle {
  placeholder?: string;
  tip?: string;
  fontSize?: string;
  symbolsLimit?: number;
  value?: string;
  onInput?: any;
}

export const ResponsiveInput = React.forwardRef<
  HTMLTextAreaElement,
  ResponsiveInputProps
>(
  (
    {
      style,
      placeholder,
      tip,
      symbolsLimit,
      fontSize,
      value,
      onInput,
      className,
    },
    ref
  ) => {
    const [showTip, setShowTip] = useState(false);
    const [symbolsRemaining, setSymbolsRemaining] = useState(symbolsLimit);

    const styles: React.CSSProperties = {
      "--input-content": ` '${value}'`,
    } as React.CSSProperties;

    return (
      <div
        className={`input-container ${className}`}
        style={{ ...styles, fontSize }}
      >
        <textarea
          name="text"
          onInput={(event) => {
            if (symbolsLimit) {
              if (event.currentTarget.value.length <= symbolsLimit) {
                onInput(event.currentTarget.value);
                setSymbolsRemaining(
                  symbolsLimit - event.currentTarget.value.length
                );
              }
            } else {
              onInput(event.currentTarget.value);
            }
          }}
          onFocus={() => {
            setShowTip(true);
          }}
          onBlur={() => {
            setShowTip(false);
          }}
          rows={1}
          placeholder={placeholder}
          style={style}
          value={value}
          ref={ref}
        ></textarea>
        <Flexbox
          className="input-tip"
          alignItems="flex-start"
          justifyContent="space-between"
          style={{ visibility: showTip ? "visible" : "hidden" }}
        >
          <div className="input-tip__text">{tip}</div>
          {symbolsLimit && (
            <div className="input-tip__limit">{symbolsRemaining}</div>
          )}
        </Flexbox>
      </div>
    );
  }
);

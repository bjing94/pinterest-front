import React from "react";
import { BaseStyle } from "../../types/types";

import "./AutoTextarea.scss";

interface AutoTextareaProps extends BaseStyle {
  placeholder?: string;
  fontSize?: string;
  symbolsLimit?: number;
  value?: string;
  onInput?: any;
}

// Adjusts height based on number of symbols
const AutoTextarea = React.forwardRef<HTMLTextAreaElement, AutoTextareaProps>(
  ({ style, placeholder, symbolsLimit, fontSize, value, onInput }, ref) => {
    const styles: React.CSSProperties = {
      "--input-content": ` '${value}'`,
    } as React.CSSProperties;

    return (
      <div
        className="responsive-textarea-container"
        style={{ ...styles, fontSize }}
      >
        <textarea
          name="text"
          onInput={(event) => {
            if (symbolsLimit) {
              if (event.currentTarget.value.length <= symbolsLimit) {
                onInput(event.currentTarget.value);
              }
            } else {
              onInput(event.currentTarget.value);
            }
          }}
          rows={1}
          placeholder={placeholder}
          style={style}
          value={value}
          ref={ref}
        ></textarea>
      </div>
    );
  }
);

export default AutoTextarea;

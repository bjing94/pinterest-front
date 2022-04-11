import React from "react";
import { BaseStyle } from "../../types/types";

import "./Input.scss";

interface InputProps extends BaseStyle {
  placeholder?: string;
  fontSize?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, fontSize = 14, className = "" }, ref) => {
    return (
      <input
        ref={ref}
        className={`rounded-input ${className}`}
        placeholder={placeholder}
        style={{ fontSize: `${fontSize}px` }}
      />
    );
  }
);
export default Input;

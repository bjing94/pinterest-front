import React from "react";
import { BaseStyle } from "../../types/types";
import Box from "../Box/Box";

import "./Input.scss";

interface InputProps {
  placeholder?: string;
  fontSize?: string;
  value?: string;
  onInput?: any;
  label?: string;
}

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
>(
  (
    {
      placeholder,
      fontSize = 14,
      className = "",
      value,
      onInput,
      label,
      type,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        <Box margin="0px 0px 5px 0px">
          <label htmlFor={rest.id}>{label}</label>
        </Box>
        <input
          ref={ref}
          className={`rounded-input ${className}`}
          placeholder={placeholder}
          style={{ fontSize: `${fontSize}px` }}
          value={value}
          onInput={onInput}
          type={type}
          id="rounded-input"
          {...rest}
        />
      </>
    );
  }
);
export default Input;

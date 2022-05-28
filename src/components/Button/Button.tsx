import React, { HTMLProps } from "react";
import { BaseStyle } from "../../types/types";

import "./Button.scss";

interface ButtonProps extends BaseStyle {
  children: any;
  onClick?: any;
  color?: "primary" | "secondary";
  backgroundColor?: string;
  active?: boolean;
  variant?: "filled" | "text" | "outline";
  type?: "button" | "submit" | "reset";
}
export default function Button({
  children,
  onClick,
  color = "primary",
  className = "",
  active = true,
  style,
  variant = "filled",
  type = "button",
  ...rest
}: ButtonProps & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className={`btn ${className} ${
        active ? "" : "inactive"
      } ${color} ${variant}`}
      onClick={(event) => {
        if (active) {
          onClick(event);
        }
      }}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}

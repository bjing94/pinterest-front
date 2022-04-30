import React from "react";
import { BaseStyle } from "../../types/types";

import "./Button.scss";

interface ButtonProps extends BaseStyle {
  children: any;
  onClick?: any;
  color?: "primary" | "secondary";
  backgroundColor?: string;
  active?: boolean;
  type?: "filled" | "text" | "outline";
}
export default function Button({
  children,
  onClick,
  color = "primary",
  className = "",
  active = true,
  style,
  type = "filled",
}: ButtonProps) {
  return (
    <button
      className={`btn ${className} ${
        active ? "" : "inactive"
      } ${color} ${type}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}

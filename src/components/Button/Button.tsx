import React from "react";
import { BaseStyle } from "../../types/types";

import "./Button.scss";

interface ButtonProps extends BaseStyle {
  children: any;
  onClick?: any;
  color?: string;
  backgroundColor?: string;
  active?: boolean;
}
export default function Button({
  children,
  onClick,
  color = "white",
  backgroundColor = "black",
  className = "",
  active = true,
}: ButtonProps) {
  return (
    <button
      className={`btn ${className} ${active ? "" : "inactive"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

import React from "react";
import { BaseStyle } from "../../types/types";

import "./Button.scss";

interface ButtonProps extends BaseStyle {
  children: any;
  onClick?: any;
  color?: string;
  backgroundColor?: string;
}
export default function Button({
  children,
  onClick,
  color = "white",
  backgroundColor = "black",
  className = "",
}: ButtonProps) {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

import React from "react";
import { BaseStyle } from "../../types/types";

import "./RoundButton.scss";

interface RoundButtonProps extends BaseStyle {
  children?: any;
  type?: "default" | "action";
  style?: any;
  onClick?: any;
  size?: number;
}
export default function RoundButton({
  children,
  type,
  style,
  onClick,
  className = "",
  size = 16,
}: RoundButtonProps) {
  return (
    <button
      className={`btn-round ${
        type === "action" ? "btn-round__action" : ""
      } ${className}`}
      style={{ ...style, width: `${size}px`, height: `${size}px` }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

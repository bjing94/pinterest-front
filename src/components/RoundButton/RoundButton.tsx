import React from "react";
import { BaseStyle } from "../../types/types";

import "./RoundButton.scss";

interface RoundButtonProps extends BaseStyle {
  children?: any;
  type?: "default" | "action";
  style?: any;
  onClick?: any;
}
export default function RoundButton({
  children,
  type,
  style,
  onClick,
  className = "",
}: RoundButtonProps) {
  return (
    <button
      className={`btn-round ${
        type === "action" ? "btn-round__action" : ""
      } ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

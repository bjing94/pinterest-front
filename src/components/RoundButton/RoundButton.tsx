import React, { HTMLProps } from "react";
import { BaseStyle } from "../../types/types";

import "./RoundButton.scss";

interface RoundButtonProps extends BaseStyle {
  children?: any;
  type?: "default" | "action";
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
  ...rest
}: RoundButtonProps & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className={`btn-round ${
        type === "action" ? "btn-round__action" : ""
      } ${className}`}
      style={{ ...style, width: `${size}px`, height: `${size}px` }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

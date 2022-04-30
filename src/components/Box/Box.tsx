import React from "react";
import { BaseStyle } from "../../types/types";

interface BoxProps extends BaseStyle {
  padding?: string;
  margin?: string;
  border?: string;
  children?: any;
  width?: string;
  height?: string;
  onClick?: any;
}

export default function Box({
  padding,
  margin,
  border,
  children,
  width,
  height,
  className = "",
  onClick,
}: BoxProps) {
  return (
    <div
      style={{
        padding: padding,
        margin: margin,
        border: border,
        width: width,
        height: height,
      }}
      className={className}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

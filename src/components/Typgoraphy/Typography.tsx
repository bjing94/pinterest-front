import React from "react";
import { BaseStyle } from "../../types/types";

import "./Typography.scss";

interface TypographyProps extends BaseStyle {
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  children?: any;
  textAlign?: string;
}
export default function Typography({
  fontSize = 2,
  color,
  children,
  fontWeight,
  className = "",
  textAlign = "center",
}: TypographyProps) {
  const lineHeight = fontSize * 1.5;
  return (
    <div
      style={{
        fontSize: `${fontSize}rem`,
        lineHeight: `${lineHeight}rem`,
        color: color,
        fontWeight,
        textAlign: "center",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

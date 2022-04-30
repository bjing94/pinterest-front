import React from "react";
import { BaseStyle } from "../../types/types";

import "./Typography.scss";

interface TypographyProps extends BaseStyle {
  fontSize?: number;
  fontWeight?: string;
  color?: "primary" | "secondary" | "error";
  children?: any;
  textAlign?:
    | "start"
    | "end"
    | "left"
    | "right"
    | "center"
    | "justify"
    | "match-parent";
}
export default function Typography({
  fontSize = 2,
  color = "primary",
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
        fontWeight,
        textAlign: textAlign,
      }}
      className={`typography ${className} ${color}`}
    >
      {children}
    </div>
  );
}

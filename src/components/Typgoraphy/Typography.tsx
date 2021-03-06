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
  fontSize = 24,
  color = "primary",
  children,
  fontWeight,
  className = "",
  textAlign = "center",
  ...rest
}: TypographyProps) {
  const lineHeight = fontSize * 1.5;
  return (
    <div
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}px`,
        fontWeight,
        textAlign: textAlign,
      }}
      className={`typography ${className} ${color}`}
      {...rest}
    >
      {children}
    </div>
  );
}

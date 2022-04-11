import React from "react";
import * as CSS from "csstype";

import "./Flexbox.scss";
import { BaseStyle } from "../../types/types";

interface FlexboxProps extends BaseStyle {
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";
  children?: any;
  style?: React.CSSProperties;
}
export default function Flexbox({
  flexDirection,
  justifyContent,
  alignItems,
  children,
  style,
  className = "",
}: FlexboxProps) {
  return (
    <div
      className={`my-flexbox ${className}`}
      style={{ ...style, justifyContent, flexDirection, alignItems }}
    >
      {children}
    </div>
  );
}

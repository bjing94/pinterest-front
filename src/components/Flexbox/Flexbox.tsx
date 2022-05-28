import React from "react";

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
  fluid?: boolean;
  onClick?: any;
}
export default function Flexbox({
  flexDirection,
  justifyContent,
  alignItems,
  children,
  style,
  className = "",
  fluid = false,
  onClick,
}: FlexboxProps) {
  return (
    <div
      className={`my-flexbox ${className} ${fluid ? "my-flexbox-fluid" : ""}`}
      style={{ ...style, justifyContent, flexDirection, alignItems }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

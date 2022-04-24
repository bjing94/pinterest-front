import React from "react";
import { BaseStyle } from "../../types/types";

import "./Card.scss";

interface CardProps extends BaseStyle {
  children?: any;
  onClick?: any;
  id?: string;
}
export default function Card({
  children,
  style,
  className = "",
  onClick,
  id,
}: CardProps) {
  return (
    <div
      className={`card-container ${className}`}
      style={style}
      onClick={onClick}
      id={id}
    >
      {" "}
      {children}
    </div>
  );
}

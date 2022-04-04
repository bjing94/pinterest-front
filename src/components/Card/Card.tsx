import React from "react";
import { BaseStyle } from "../../types/types";

import "./Card.scss";

interface CardProps extends BaseStyle {
  children?: any;
}
export default function Card({ children, style }: CardProps) {
  return (
    <div className="card-container" style={style}>
      {" "}
      {children}
    </div>
  );
}

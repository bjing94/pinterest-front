import React, { HTMLAttributes } from "react";
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
  ...rest
}: CardProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`card-container ${className}`}
      style={style}
      onClick={onClick}
      id={id}
      {...rest}
    >
      {children}
    </div>
  );
}

import React from "react";

import "./Card.scss";

interface CardProps {
  children?: any;
}
export default function Card({ children }: CardProps) {
  return <div className="card-container">{children}</div>;
}

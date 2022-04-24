import React from "react";
import Typography from "../Typgoraphy/Typography";

import "./ButtonSection.scss";

interface ButtonSectionProps {
  children?: any;
  isActive?: boolean;
  onClick?: any;
}

export default function ButtonSection({
  children,
  isActive,
  onClick,
}: ButtonSectionProps) {
  return (
    <button
      className={`btn-section ${isActive ? "btn-section-active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

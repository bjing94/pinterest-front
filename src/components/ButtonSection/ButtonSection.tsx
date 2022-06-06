import React, { HTMLAttributes } from "react";

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
  className,
  ...rest
}: ButtonSectionProps & HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`btn-section ${
        isActive ? "btn-section-active" : ""
      } ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

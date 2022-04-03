import React from "react";

import "./Button.scss";

interface ButtonProps {
  children: any;
  onClick?: any;
}
export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  );
}

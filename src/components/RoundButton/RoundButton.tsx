import React from "react";

import "./RoundButton.scss";

interface RoundButtonProps {
  children?: any;
  type?: "default" | "action";
  style?: any;
  onClick?: any;
}
export default function RoundButton({
  children,
  type,
  style,
  onClick,
}: RoundButtonProps) {
  return (
    <button
      className={`btn-round ${type === "action" ? "btn-round__action" : ""}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

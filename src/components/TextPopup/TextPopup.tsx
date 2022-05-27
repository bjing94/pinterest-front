import React from "react";
import Card from "../Card/Card";

import "./TextPopup.scss";

interface TextPopupProps {
  children?: any;
  type?: "info" | "error" | "warning";
}
export default function TextPopup({ children, type = "info" }: TextPopupProps) {
  return (
    <div className={`text-popup ${type}`}>
      <Card>{children}</Card>
    </div>
  );
}

import React from "react";
import Card from "../Card/Card";

import "./TextPopup.scss";

interface TextPopupProps {
  children?: any;
}
export default function TextPopup({ children }: TextPopupProps) {
  return (
    <div className="text-popup">
      <Card>{children}</Card>
    </div>
  );
}

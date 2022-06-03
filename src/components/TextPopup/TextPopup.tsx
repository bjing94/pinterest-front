import React from "react";
import Card from "../Card/Card";

import "./TextPopup.scss";

interface TextPopupProps {
  children?: any;
  type?: "info" | "error" | "warning";
}
export default function TextPopup({
  children,
  type = "info",
  ...rest
}: TextPopupProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-popup ${type}`} {...rest}>
      <Card>{children}</Card>
    </div>
  );
}

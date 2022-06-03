import React from "react";
import Card from "../Card/Card";

import "./Popup.scss";

interface PopupProps {
  children?: any;
  containerClass?: string;
  onClickBackground?: () => void;
}

export default function Popup({
  children,
  onClickBackground,
  containerClass = "",
  ...rest
}: PopupProps & React.HTMLProps<HTMLDivElement>) {
  return (
    <div className="popup__root" {...rest}>
      <div className="popup__background" onClick={onClickBackground} />
      <Card className={`${containerClass} popup__container`}>{children}</Card>
    </div>
  );
}

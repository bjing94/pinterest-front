import React from "react";
import Flexbox from "../Flexbox/Flexbox";

import "./ButtonGroup.scss";

interface ButtonGroupProps {
  children?: any;
}

export default function ButtonGroup({ children }: ButtonGroupProps) {
  return <Flexbox className="btn-group">{children}</Flexbox>;
}

import React from "react";
import { BaseStyle } from "../../types/types";
import Flexbox from "../Flexbox/Flexbox";

import "./ButtonGroup.scss";

interface ButtonGroupProps extends BaseStyle {
  children?: any;
}

export default function ButtonGroup({ children, style }: ButtonGroupProps) {
  return (
    <Flexbox className="btn-group" style={style}>
      {children}
    </Flexbox>
  );
}

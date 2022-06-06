import React, { HTMLAttributes } from "react";
import { BaseStyle } from "../../types/types";
import Flexbox from "../Flexbox/Flexbox";

import "./ButtonGroup.scss";

interface ButtonGroupProps extends BaseStyle {
  children?: any;
}

export default function ButtonGroup({
  children,
  style,
  ...rest
}: ButtonGroupProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <Flexbox className="btn-group" style={style} {...rest}>
      {children}
    </Flexbox>
  );
}

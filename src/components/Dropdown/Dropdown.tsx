import React, { HTMLAttributes } from "react";
import { BaseStyle } from "../../types/types";
import Card from "../Card/Card";
import Flexbox from "../Flexbox/Flexbox";

import "./Dropdown.scss";

interface DropdownProps extends BaseStyle {
  width?: string;
  padding?: string;
  children?: any;
  onClickItem?: any;
  left?: string;
  top?: string;
}

export default function Dropdown({
  children,
  onClickItem,
  className = "",
  ...rest
}: DropdownProps & HTMLAttributes<HTMLDivElement>) {
  let childElements = null;
  if (children) {
    childElements = children.map((child: any, id: number) => {
      return (
        <div
          className={`dropdown__item`}
          onClick={onClickItem}
          key={`dropdown-item-${id}`}
        >
          {child}
        </div>
      );
    });
  }
  return (
    <Card className={`dropdown__list ${className}`} {...rest}>
      <Flexbox fluid flexDirection="column">
        {childElements}
      </Flexbox>
    </Card>
  );
}

import React from "react";
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
}: DropdownProps) {
  let childElements = null;
  if (children) {
    childElements = children.map((child: any) => {
      return (
        <div className={`dropdown__item`} onClick={onClickItem}>
          {child}
        </div>
      );
    });
  }
  return (
    <Card className={`dropdown__list ${className}`}>
      <Flexbox fluid flexDirection="column">
        {childElements}
      </Flexbox>
    </Card>
  );
}

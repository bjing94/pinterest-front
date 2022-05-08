import React, { ReactChild } from "react";
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
  width = "100%",
  padding = "0",
  children,
  onClickItem,
  left = "50%",
  top = "100%",
  className = "",
}: DropdownProps) {
  let childElements = null;
  if (children) {
    childElements = children.map((child: any) => {
      return (
        <li className={`dropdown__item`} onClick={onClickItem}>
          {child}
        </li>
      );
    });
  }
  return (
    <Card
      style={{
        padding: padding,
        minWidth: 0,
        width: width,
        left: left,
        top: top,
        borderRadius: "0.5em",
      }}
      className={`dropdown__list ${className}`}
    >
      <Flexbox fluid flexDirection="column">
        {childElements}
      </Flexbox>
    </Card>
  );
}

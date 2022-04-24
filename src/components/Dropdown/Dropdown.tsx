import React, { ReactChild } from "react";
import Card from "../Card/Card";
import Flexbox from "../Flexbox/Flexbox";

import "./Dropdown.scss";

function DropdownList() {
  return (
    <div className="dropdown__list">
      <Card style={{ padding: 0, minWidth: 0 }}>
        <Flexbox fluid flexDirection="column">
          <div>item 1</div>
          <div>item 2</div>
          <div>item 3</div>
          <div>item 4</div>
        </Flexbox>
      </Card>
    </div>
  );
}

interface DropdownProps {
  width?: string;
  padding?: string;
  children?: ReactChild[];
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
}: DropdownProps) {
  let childElements = null;
  if (children) {
    childElements = children.map((child) => {
      return (
        <div className="dropdown__item" onClick={onClickItem}>
          {child}
        </div>
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
      }}
      className="dropdown__list"
    >
      <Flexbox fluid flexDirection="column">
        {childElements}
      </Flexbox>
    </Card>
  );
}

import React, { ReactChild, ReactElement } from "react";

import "./Container.css";

interface ContainerProps {
  children?: any;
}
export default function Container({ children }: ContainerProps) {
  return <div className="my-container">{children}</div>;
}

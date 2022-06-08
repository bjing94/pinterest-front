import React, { HTMLAttributes } from "react";

import "./Container.css";

interface ContainerProps {
  children?: any;
}
export default function Container({
  children,
  ...rest
}: ContainerProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="my-container" {...rest}>
      {children}
    </div>
  );
}

import React, { HTMLAttributes } from "react";

import "./Container.scss";

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

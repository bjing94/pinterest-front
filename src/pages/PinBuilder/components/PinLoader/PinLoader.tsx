import React from "react";
import { GridLoader } from "react-spinners";

import "./PinLoader.scss";

export default function PinLoader() {
  return (
    <div className="pin-loader">
      <GridLoader size={32} margin={2} color="white" />
    </div>
  );
}

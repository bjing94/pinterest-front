import React from "react";
import Flexbox from "../Flexbox/Flexbox";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import ResponsiveImage from "../ResponsiveImage/ResponsiveImage";

import "./PinCard.scss";

export default function PinCard({ src }: any) {
  return (
    <Flexbox
      className="pin-card"
      flexDirection="column"
      alignItems="flex-start"
    >
      <ResponsiveImage src={src} />
      <ProfileInfo username="Shazam" />
    </Flexbox>
  );
}

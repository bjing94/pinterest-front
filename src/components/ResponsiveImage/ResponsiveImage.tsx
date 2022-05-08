import React, { useEffect, useState } from "react";

import "./ResponsiveImage.scss";

interface ResponsiveImageProps {
  src: string;
  overlayContent?: any;
  maxHeight?: string;
  minHeight?: string;
}

const ResponsiveImage = React.forwardRef<
  HTMLImageElement,
  ResponsiveImageProps
>(({ src, overlayContent, maxHeight = "none", minHeight = "none" }, ref) => {
  const [imgHeight, setImgHeight] = useState(0);

  useEffect(() => {}, [src]);
  console.log(maxHeight);

  return (
    <div
      className="responsive-image__container"
      style={{ maxHeight: maxHeight, minHeight }}
    >
      <img src={src} ref={ref} />
      {overlayContent && (
        <div className="responsive-image__overlay">{overlayContent}</div>
      )}
    </div>
  );
});

export default ResponsiveImage;

import React, { useEffect, useState } from "react";

import "./ResponsiveImage.scss";

interface ResponsiveImageProps {
  src: string;
  overlayContent?: any;
}

const ResponsiveImage = React.forwardRef<
  HTMLImageElement,
  ResponsiveImageProps
>(({ src, overlayContent }, ref) => {
  const [imgHeight, setImgHeight] = useState(0);

  const handleUploadImg = () => {
    const img = new Image();
    img.src = src;
    img.onload = function () {
      const multiplier = 340 / img.width;
      setImgHeight(img.height * multiplier);
    };
  };

  useEffect(() => {
    handleUploadImg();
  }, [src]);

  return (
    <div className="responsive-image__container">
      <img
        src={src}
        ref={ref}
        style={{ width: "100%", borderRadius: "1rem" }}
        height={imgHeight}
      />
      {overlayContent && (
        <div
          className="responsive-image__overlay"
          style={{ height: `${imgHeight}px` }}
        >
          {overlayContent}
        </div>
      )}
    </div>
  );
});

export default ResponsiveImage;

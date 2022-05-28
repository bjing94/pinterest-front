import React from "react";

import "./ResponsiveImage.scss";

interface ResponsiveImageProps {
  src: string;
  overlayContent?: any;
  maxHeight?: string;
  minHeight?: string;
  className?: string;
}

const ResponsiveImage = React.forwardRef<
  HTMLImageElement,
  ResponsiveImageProps
>(
  (
    {
      src,
      overlayContent,
      className = "",
      maxHeight = "none",
      minHeight = "none",
    },
    ref
  ) => {
    return (
      <div
        className={`responsive-image ${className}`}
        style={{ maxHeight: maxHeight, minHeight }}
      >
        <div
          className="responsive-image__container"
          style={{ maxHeight: maxHeight, minHeight }}
        >
          <img
            alt="responsive-image"
            style={{ minHeight }}
            src={src}
            ref={ref}
          />
        </div>

        {overlayContent && (
          <div
            className="responsive-image__overlay"
            style={{ maxHeight: maxHeight, minHeight }}
          >
            {overlayContent}
          </div>
        )}
      </div>
    );
  }
);

export default ResponsiveImage;

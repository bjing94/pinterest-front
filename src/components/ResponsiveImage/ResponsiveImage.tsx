import React, { HTMLAttributes } from "react";

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
  ResponsiveImageProps & HTMLAttributes<HTMLDivElement>
>(
  (
    {
      src,
      overlayContent,
      className = "",
      maxHeight = "none",
      minHeight = "none",
      ...rest
    },
    ref
  ) => {
    return (
      <div
        className={`responsive-image ${className}`}
        style={{ maxHeight: maxHeight, minHeight }}
        {...rest}
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

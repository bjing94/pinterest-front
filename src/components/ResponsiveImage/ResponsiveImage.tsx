import React, { useEffect, useState } from "react";

interface ResponsiveImageProps {
  src: string;
}
const ResponsiveImage = React.forwardRef<
  HTMLImageElement,
  ResponsiveImageProps
>(({ src }, ref) => {
  const [imgHeight, setImgHeight] = useState(0);

  const handleUploadImg = () => {
    console.log("Src", src);
    const img = new Image();
    img.src = src;
    img.onload = function () {
      console.log("Image dimensions: ", img.width, img.height);
      const multiplier = 340 / img.width;
      console.log("Suggested dimensions:", 340, img.height * multiplier);
      setImgHeight(img.height * multiplier);
    };
  };

  useEffect(() => {
    handleUploadImg();
  }, [src]);

  return (
    <img
      src={src}
      ref={ref}
      style={{ width: "100%", borderRadius: "1rem" }}
      height={imgHeight}
    />
  );
});

export default ResponsiveImage;

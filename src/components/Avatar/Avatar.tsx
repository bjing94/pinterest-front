import React, { useEffect, useState } from "react";
import { getStaticImage } from "../../services/FileService";

interface AvatarProps {
  imgId: string;
  size: number;
}

export default function Avatar({ imgId, size }: AvatarProps) {
  const [avatarSrc, setAvatarSrc] = useState("");

  useEffect(() => {
    getStaticImage(imgId).then((data) => {
      if (data) {
        setAvatarSrc(data);
      }
    });
  }, [imgId]);

  return (
    <img
      alt="avatar"
      width={size}
      height={size}
      src={avatarSrc || `https://via.placeholder.com/${size}`}
      style={{ borderRadius: "50%" }}
    />
  );
}

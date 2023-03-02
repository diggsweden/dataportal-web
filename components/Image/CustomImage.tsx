import env from "@beam-australia/react-env";
import React from "react";
import { Image as ImageInterface } from "../../graphql/__generated__/Image";
import { isExternalLink } from "../../utilities";
import Image from "next/image";

interface ImageSizes {
  mobile: string;
  tablet: string;
  desktop: string;
}

type Device = keyof ImageSizes;

interface ResponsiveSizes {
  mobile: number;
  tablet: number;
  desktop: number;
}

interface CustomImageProps {
  image: ImageInterface;
  style?: "responsive" | "fill";
  sizes?: ImageSizes;
}

const imageWidths = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 768, 1024, 1280, 1536, 1640, 1920,
];

const responsiveSizes: ResponsiveSizes = {
  mobile: 639,
  tablet: 1023,
  desktop: 1024,
};

const isNextStatic = (url: any) => typeof url != "string";

export const CustomImage: React.FC<CustomImageProps> = ({
  image,
  style,
  sizes,
}) => {
  if (isNextStatic(image.url)) {
    return (
      <Image
        src={image.url}
        width={image.width || 300}
        height={image.height || 200}
        alt={image.alt || ""}
      />
    );
  }

  const src = isExternalLink(image.url)
    ? image.url
    : (env("MEDIA_BASE_URL") || "") + image.url;

  const srcset = imageWidths
    .map((w) => `${src}?w=${w}&q=${75} ${w}w`)
    .join(", ");

  const imageSizes =
    sizes &&
    Object.keys(sizes)
      .map(
        (key) =>
          `(${(key as Device) === "desktop" ? "min" : "max"}-width:${
            responsiveSizes[key as Device]
          }px) ${sizes[key as Device]}`
      )
      .join(", ");

  return (
    <picture>
      <source srcSet={srcset} type={image.mime} sizes={imageSizes} />
      <img
        className={style}
        src={`${src}?w=${384}&q=${75}`}
        width={image.width || ""}
        height={image.height || ""}
        alt={image.alt || ""}
      />
    </picture>
  );
};

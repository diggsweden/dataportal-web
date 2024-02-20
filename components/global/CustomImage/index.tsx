import env from "@beam-australia/react-env";
import { FC } from "react";
import { ImageFragment as ImageInterface } from "@/graphql/__generated__/operations";
import { isExternalLink } from "@/utilities";
import Image from "next/image";
import noImage from "@/assets/logos/noImage.png";

interface CustomImageProps {
  image: ImageInterface | null;
  height?: number;
  width?: number;
  className?: string;
  sizes?: string;
}

const isNextStatic = (url: string) =>
  typeof url != "string" || !url.startsWith("/uploads");

export const CustomImage: FC<CustomImageProps> = ({
  image,
  height,
  width,
  className,
  sizes,
}) => {
  if (!image) {
    return (
      <Image
        src={noImage}
        width={width || 300}
        height={height || 200}
        alt={"image not found"}
        className={className}
        priority
      />
    );
  }

  if (isNextStatic(image.url)) {
    return (
      <Image
        src={`${image.url}?w=${width ? width : 384}&q=${75}`}
        width={image.width || 300}
        height={image.height || 200}
        className={className}
        alt={image.alt || ""}
        sizes={sizes || ""}
        priority
      />
    );
  }

  const src = isExternalLink(image.url)
    ? image.url
    : (env("MEDIA_BASE_URL") || "") + image.url;

  // eslint-disable-next-line
  console.log("isNextStatic", isNextStatic);
  // eslint-disable-next-line
  console.log("width", width);
  // eslint-disable-next-line
  console.log("height", height);
  // eslint-disable-next-line
  console.log("sizes", sizes);

  var src_test = `${src}?w=${width ? width : 384}&q=${75}`;
  // eslint-disable-next-line
  console.log("src", src_test);

  return (
    <Image
      src={src}
      width={width ? width : Number(image.width || "")}
      height={height ? height : Number(image.height || "")}
      className={className}
      alt={image.alt || ""}
      sizes={sizes || ""}
      priority
    />
  );
};

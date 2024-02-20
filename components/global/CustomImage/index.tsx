import env from "@beam-australia/react-env";
import { FC } from "react";
import { ImageFragment as ImageInterface } from "@/graphql/__generated__/operations";
import { isExternalLink } from "@/utilities";
import Image from "next/image";
import noImage from "@/assets/logos/noImage.png";

interface CustomImageProps {
  image: ImageInterface | null;
  width?: number;
  className?: string;
}

const isNextStatic = (url: string) =>
  typeof url != "string" || !url.startsWith("/uploads");

export const CustomImage: FC<CustomImageProps> = ({
  image,
  width,
  className,
}) => {
  if (!image) {
    return (
      <Image
        src={noImage}
        width={width || 384}
        height={200}
        alt={"image not found"}
        className={className}
        priority
      />
    );
  }

  if (isNextStatic(image.url)) {
    return (
      <Image
        src={image.url}
        width={image.width || 384}
        height={image.height || 200}
        className={className}
        alt={image.alt || ""}
        priority
      />
    );
  }

  const src = isExternalLink(image.url)
    ? image.url
    : (env("MEDIA_BASE_URL") || "") + image.url;

  /* HOTFIX-image-optimize: Adding unoptimized true to external images to not be
   *  optimized twice by Graphql and Next.js
   */
  return (
    <Image
      src={`${src}?w=${width ? width : 384}&q=${75}`}
      width={width ? width : Number(image.width || "")}
      height={Number(image.height || "")}
      className={className}
      alt={image.alt || ""}
      priority
      unoptimized={true}
    />
  );
};

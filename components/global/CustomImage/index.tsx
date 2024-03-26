import env from "@beam-australia/react-env";
import { FC } from "react";
import { ImageFragment as ImageInterface } from "@/graphql/__generated__/operations";
import { isExternalLink } from "@/utilities";
import Image from "next/image";
import noImage from "@/assets/logos/noImage.png";

interface CustomImageProps {
  image: ImageInterface | null;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

const isNextStatic = (url: string) =>
  typeof url != "string" || !url.startsWith("/uploads");

const imageSizes = ["thumbnail", "small", "medium", "large"];
const imageWidths = ["248w", "500w", "750w", "1000w"];

export const CustomImage: FC<CustomImageProps> = ({
  image,
  sizes,
  className,
  priority = false,
}) => {
  if (!image) {
    return (
      <Image
        src={noImage}
        width={384}
        height={200}
        alt={"image not found"}
        className={className}
        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 20vw"
        loading="lazy"
      />
    );
  }

  if (isNextStatic(image.url)) {
    return (
      <Image
        key={image.url}
        src={image.url}
        width={image.width || 384}
        height={image.height || 200}
        className={className}
        alt={image.alt || ""}
        sizes={
          sizes
            ? sizes
            : "(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 20vw"
        }
        priority={priority}
      />
    );
  }

  const src = isExternalLink(image.url);

  const srcset = imageSizes
    .map(
      (w, idx: number) =>
        `${
          src
            ? image.url
            : (env("MEDIA_BASE_URL") || "") +
              image.url.replace("uploads/", "uploads/" + w + "_") +
              " " +
              imageWidths[idx]
        }`,
    )
    .join(", ");

  return (
    <picture>
      <source
        srcSet={srcset + `, ${env("MEDIA_BASE_URL") + image.url} 1920w`}
        type={image.mime}
        sizes={sizes}
      />
      <img
        className={className}
        src={src ? image.url : (env("MEDIA_BASE_URL") || "") + image.url}
        width={image.width || ""}
        height={image.height || ""}
        alt={image.alt || ""}
        loading="lazy"
      />
    </picture>
  );
};

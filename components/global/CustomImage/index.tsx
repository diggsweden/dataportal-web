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
}

const isNextStatic = (url: string) =>
  typeof url != "string" || !url.startsWith("/uploads");

const imageWidths = [128, 256, 384, 640, 828, 1080, 1200, 1920, 3840];

export const CustomImage: FC<CustomImageProps> = ({
  image,
  sizes,
  className,
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
        sizes={
          sizes
            ? sizes
            : `(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 20vw`
        }
        priority
      />
    );
  }

  const src = isExternalLink(image.url)
    ? image.url
    : (env("MEDIA_BASE_URL") || "") + image.url;

  const srcset = imageWidths
    .map((w) => `${src}?w=${w}&q=${75} ${w}w`)
    .join(", ");

  return (
    <picture>
      <source srcSet={srcset} type={image.mime} sizes={sizes} />
      <img
        className={className}
        src={`${src}?w=${384}&q=${75}`}
        width={image.width || ""}
        height={image.height || ""}
        alt={image.alt || ""}
        /* @ts-ignore */
        fetchpriority="high"
      />
    </picture>
  );
};

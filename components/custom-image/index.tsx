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
  width?: number;
}

const isNextStatic = (url: string) =>
  typeof url != "string" || !url.startsWith("/uploads");

export const CustomImage: FC<CustomImageProps> = ({
  image,
  sizes,
  className,
  priority = false,
  width,
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

  const src = isExternalLink(image.url)
    ? image.url
    : (env("MEDIA_BASE_URL") || "") + image.url;

  return (
    <Image
      key={src}
      src={`${src}?w=${width || 384}&q=${75}`}
      width={Number(image.width) || 384}
      height={Number(image.height) || 200}
      className={className ? className : ""}
      alt={image.alt || ""}
      unoptimized={true}
      priority={priority}
    />
  );
};

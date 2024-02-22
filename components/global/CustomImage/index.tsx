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

  // eslint-disable-next-line
  console.log("src", src);

  // eslint-disable-next-line
  console.log("src with query", `${src}?w=${image.width || 384}&q=90`);

  /**
   * If image is an external link, we need to send query parameters for the image to work properly
   * */
  return (
    <Image
      src={`${src}?w=${image.width || 384}&q=90`}
      width={Number(image.width || 384)}
      height={Number(image.height || "")}
      quality={90}
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
};

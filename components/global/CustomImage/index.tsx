import env from "@beam-australia/react-env";
import { FC } from "react";
import { ImageFragment as ImageInterface } from "@/graphql/__generated__/operations";
import { isExternalLink } from "@/utilities";
import Image from "next/image";
import noImage from "@/assets/logos/noImage.png";

interface CustomImageProps {
  image: ImageInterface | null;
  className?: string;
}

const isNextStatic = (url: string) => typeof url != "string";

export const CustomImage: FC<CustomImageProps> = ({ image, className }) => {
  if (!image) {
    return (
      <Image src={noImage} alt={"image not found"} className={className} />
    );
  }

  if (isNextStatic(image.url)) {
    return (
      <Image
        src={image.url}
        width={image.width || 300}
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

  return (
    <Image
      src={`${src}?w=${384}&q=${75}`}
      width={Number(image.width || "")}
      height={Number(image.height || "")}
      className={className}
      alt={image.alt || ""}
    />
  );
};

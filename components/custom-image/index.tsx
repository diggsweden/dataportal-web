import env from "@beam-australia/react-env";
import Image from "next/image";
import { FC } from "react";

import noImage from "@/assets/logos/noImage.png";
import { ImageFragment as ImageInterface } from "@/graphql/__generated__/operations";
import { isExternalLink } from "@/utilities";

/**
 * Props for the CustomImage component
 * @interface CustomImageProps
 */
interface CustomImageProps {
  /** The image object containing url, width, height, and alt text */
  image: ImageInterface | null;
  /** Responsive image sizes attribute */
  sizes?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to prioritize image loading */
  priority?: boolean;
  /** Desired image width */
  width?: number;
  /** Image quality (1-100) */
  quality?: number;
}

/** Default dimensions and quality settings */
const DEFAULT_WIDTH = 384;
const DEFAULT_HEIGHT = 200;
const DEFAULT_QUALITY = 75;
const DEFAULT_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 20vw";

/**
 * Checks if the image URL is a Next.js static asset
 * @param url - The image URL to check
 * @returns boolean indicating if the URL is a Next.js static asset
 */
const isNextStatic = (url: string) => !url.startsWith("/uploads");

/**
 * Generates the complete image URL with width and quality parameters
 * @param imageUrl - The base image URL
 * @param width - Desired image width
 * @param quality - Desired image quality
 * @returns The complete image URL with parameters
 */
const getImageUrl = (imageUrl: string, width: number, quality: number) => {
  if (isExternalLink(imageUrl)) return imageUrl;
  const baseUrl = env("MEDIA_BASE_URL") || "";
  return `${baseUrl}${imageUrl}?w=${width}&q=${quality}`;
};

/**
 * A custom Image component that handles various image sources and formats
 * Supports external images, Next.js static assets, and dynamic images with optimization
 * Falls back to a placeholder image when no image is provided
 */
export const CustomImage: FC<CustomImageProps> = ({
  image,
  sizes = DEFAULT_SIZES,
  className = "",
  priority = false,
  width = DEFAULT_WIDTH,
  quality = DEFAULT_QUALITY,
}) => {
  if (!image) {
    return (
      <Image
        src={noImage}
        width={DEFAULT_WIDTH}
        height={DEFAULT_HEIGHT}
        alt="image not found"
        className={className}
        sizes={sizes}
        loading="lazy"
      />
    );
  }

  const imageProps = {
    width: Number(image.width) || DEFAULT_WIDTH,
    height: Number(image.height) || DEFAULT_HEIGHT,
    className,
    alt: image.alt || "",
    sizes,
    priority,
  };

  if (isNextStatic(image.url)) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image src={image.url} {...imageProps} />;
  }

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      src={getImageUrl(image.url, width, quality)}
      {...imageProps}
      unoptimized
    />
  );
};

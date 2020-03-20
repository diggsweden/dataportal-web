import { styled, Box } from '@digg/design-system';
import React from 'react';
import { keyframes } from 'emotion';

/**
 * Put this in a 'div' with position: relative to plot three pixels
 *
 */
export type PixelEffectProps = {
  position: number;
  size?: number;
};

interface PixelProps {
  size: number;
}

interface Point {
  x: number;
  y: number;
}

interface CoordsSizeMap {
  [size: number]: Point[];
}

const coordsBySize: CoordsSizeMap = {};

const getOrGenerateCoords = (size: number): Point[] => {
  const coords = coordsBySize[size];

  if (coords) return coords;

  const max = 100 - size * 2;

  let coordsArray: Point[] = [];

  for (let x = size; x <= max; x += size) {
    for (let y = size; y <= max; y += size) {
      coordsArray.push({ x, y });
    }
  }

  coordsBySize[size] = coordsArray;

  return coordsArray;
};

const pixelAnimation = keyframes`
  from {
    transform: translateY(-30px) scale(1.2);
  }
  
  to {
    opacity: 1;
    transform: none;
  }
`;

export const PixelBox = styled(Box)<PixelProps>`
  @media screen and (max-width: 30em) {
    display: none;
  }
  width: ${props => props.size}%;
  padding-top: ${props => props.size}%;
  position: absolute;
  opacity: 0;
  animation: ${pixelAnimation} 1s ${props => props.theme.timings.fast} forwards;
`;

const randomNum = (max: number) => {
  return Math.floor(Math.random() * max);
};

export class PixelEffect extends React.PureComponent<PixelEffectProps> {
  coordsFromKey(key: number, size: number) {
    const coords = getOrGenerateCoords(size);

    const count = 3;

    return new Array(count)
      .fill('')
      .map(() => coords[randomNum(coords.length)]);
  }

  render() {
    if (this.props.position === null) return;

    const size = this.props.size ? this.props.size : 10;

    const coords = this.coordsFromKey(this.props.position, size);

    const opacity = 0.5 / coords.length;

    return coords.map((coord, index) => {
      const delay = index * 0.2;
      const currentOpacity = (index + 1) * opacity;

      return (
        <PixelBox
          key={index}
          size={size}
          style={{
            bottom: `${coord.y}%`,
            left: `${coord.x}%`,
            animationDelay: `${delay}s`,
            backgroundColor: `rgba(255, 255, 255, ${currentOpacity})`,
          }}
        />
      );
    });
  }
}

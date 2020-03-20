import { colorPalette, Theme } from '@digg/design-system';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import React from 'react';

export interface EventRenderProps {
  className: string;
}

export interface EventEffectProps {
  theme?: Theme;
  full?: boolean;
  outline?: boolean;
  active?: boolean;
  noHover?: boolean;
  noColorInvert?: boolean;
  children: (props: EventRenderProps) => React.ReactElement<any> | null;
}
/**
 * TODO: Allow arrays of prop and value pairs for style methods.
 */
const fullStyle = (props: EventEffectProps) =>
  props.full === true
    ? `
    transition: background-color 0.25s ${props.theme &&
      props.theme.timings.fast},
                color 0.25s ${props.theme && props.theme.timings.fast};

    ${focusStyle(props, 'background-color', colorPalette.darkred)}
    ${hoverStyle(props, 'background-color', colorPalette.darkred)} 
    ${activeStyle(props, 'background-color', colorPalette.darkred)}

`
    : '';
const outlineStyle = (props: EventEffectProps) =>
  props.outline === true
    ? `
    outline: none;
    transition: border 0.25s ${props.theme && props.theme.timings.fast},
                color 0.25s ${props.theme && props.theme.timings.fast};

    ${focusStyle(props, 'outline', '2px solid ' + colorPalette.darkred)}
    ${hoverStyle(props, 'outline', '2px solid ' + colorPalette.darkred)}
    ${activeStyle(props, 'outline', '2px solid ' + colorPalette.darkred)}
`
    : '';

const hoverStyle = (
  props: EventEffectProps,
  hoverProp: string,
  value: string
) =>
  !props.noHover
    ? `
    &:hover {
      ${
        props.noColorInvert || props.outline
          ? ''
          : 'color:' + colorPalette.red6 + ';'
      }
      ${hoverProp}: ${value};
      ${
        props.noColorInvert || props.outline
          ? ''
          : `svg{
        fill: ${colorPalette.red6};
      }`
      }
      
    }
  `
    : '';
const focusStyle = (
  props: EventEffectProps,
  focusProp: string,
  value: string
) => `
    &:focus {
      ${
        props.noColorInvert || props.outline
          ? ''
          : 'color:' + colorPalette.red6 + ';'
      }
      ${focusProp}: ${value};
      ${props.full ? 'outline: none;' : ''}
      ${
        props.noColorInvert || props.outline
          ? ''
          : `svg{
        fill: ${colorPalette.red6};
      }`
      }
    }
`;
const activeStyle = (
  props: EventEffectProps,
  activeProp: string,
  value: string
) =>
  props.active
    ? `
    &:active {
      ${
        props.noColorInvert || props.outline
          ? ''
          : 'color:' + colorPalette.red6 + ';'
      }
      ${activeProp}: ${value};
      ${
        props.noColorInvert || props.outline
          ? ''
          : `svg{
        fill: ${colorPalette.red6};
      }`
      }
    }
  `
    : '';

const hoverEffectStyle = (props: EventEffectProps) => css`
  ${fullStyle(props)};
  ${outlineStyle(props)};
`;

export const EventEffectNoTheme: React.SFC<EventEffectProps> = props =>
  props.children({
    className: hoverEffectStyle(props),
  });

export const EventEffect = withTheme(EventEffectNoTheme);

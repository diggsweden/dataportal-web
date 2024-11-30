/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "qss" {
  export function encode(_obj: Record<string, any>): string;
  export function decode(_str: string): Record<string, any>;
}

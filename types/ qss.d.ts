declare module "qss" {
  // biome-ignore lint/suspicious/noExplicitAny: Unknown type
  export function encode(_obj: Record<string, any>): string;
  // biome-ignore lint/suspicious/noExplicitAny: Unknown type
  export function decode(_str: string): Record<string, any>;
}

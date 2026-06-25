declare module "qss" {
  export function encode(
    _obj: Record<string, string | number | boolean>,
  ): string;
  export function decode(_str: string): Record<string, string | undefined>;
}

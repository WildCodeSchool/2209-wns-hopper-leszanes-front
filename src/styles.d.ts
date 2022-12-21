/* eslint-disable import/no-default-export */
declare module "*.module.scss" {
  const content: Record<string, string>;
  export = content;
}

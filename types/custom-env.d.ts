declare module 'custom-env' {
  export function env(
    envPath?: string,
    sample?: string | string[],
    options?: {
      mode?: string;
      encoding?: string;
    }
  ): void;
}

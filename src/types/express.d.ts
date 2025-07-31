// Type extensions for Express cookie options
declare namespace Express {
  interface CookieOptions {
    partitioned?: boolean;
  }
}

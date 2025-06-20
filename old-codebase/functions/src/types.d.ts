// eslint-disable-next-line no-unused-vars
declare namespace Express {
  export interface Request {
    cf_ip?: string;
  }
}
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
type PlayerUser = { username: string; uuid: string };

export type paramArray = { param: string, min: number, max: number, numQueries: number} [];
export type noteArray = { type: string, n: number, startTime: number, length: number} [];
export type clientOptions = {
  targetPort: number,
  targetHost: string,
  header: number,
  timeout: number,
  isUnixDomainSocket: boolean,
}
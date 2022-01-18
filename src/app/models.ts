export class Point {
  constructor(readonly x: number, readonly y: number) {}
}

export interface Type<T> {
  new (...args: any[]): T;
}

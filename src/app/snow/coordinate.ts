export type Coordinate = {
  x: number;
  y: number;
}

export type CoordinateAtTop = Pick<Coordinate, "x"> & { y: 0 };

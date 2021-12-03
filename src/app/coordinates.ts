import { Observable, timer } from "rxjs";
import { map } from "rxjs/operators";

export interface ICoordinates {
  x: number;
  y: number;
}

function randomNumber(max: number) {
  return Math.floor(Math.random() * max);
}

export function generateCoordinate(inMilliseconds: number, max: number): Observable<number> {
  return timer(inMilliseconds, inMilliseconds)
        .pipe(map(_ => (randomNumber(max))));
}

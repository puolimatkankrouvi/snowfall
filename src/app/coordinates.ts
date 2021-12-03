import { Observable, of, timer } from "rxjs";
import { map } from "rxjs/operators";

export interface ICoordinates {
  x: number;
  y: number;
}

function randomNumber(max: number) {
  return Math.floor(Math.random() * max);
}

export function generateCoordinates(inMilliseconds: number): Observable<ICoordinates> {
  return timer(inMilliseconds, inMilliseconds)
        .pipe(map(_ => ({x: randomNumber(800), y: randomNumber(600)})));
}

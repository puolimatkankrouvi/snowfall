import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { canvasHeight, canvasWidth, ICoordinate } from 'src/app/coordinates';

@Injectable({
  providedIn: 'root'
})
export class SnowflakeService { 
  private snowflakeCoordinates: Array<ICoordinate> = new Array<ICoordinate>();
  public snowflakeCoordinateChanges$ = new Subject<ReadonlyArray<ICoordinate>>();

  constructor() {  
    generateCoordinate(2000, canvasWidth).subscribe(xCoordinate => this.addNewSnowflake(xCoordinate));
    timer(700, 700).subscribe(_ => this.moveSnowflakesDown());
  }

  private addNewSnowflake(xCoordinate: number) {
    this.snowflakeCoordinates.push({x: xCoordinate, y: 0});
    this.snowflakeCoordinateChanges$.next(this.snowflakeCoordinates);
  }

  private moveSnowflakesDown() {
    for (let i = 0; i < this.snowflakeCoordinates.length; i++) {
      const snowflakeCoordinate = this.snowflakeCoordinates[i];
      if (snowflakeCoordinate.y <= canvasHeight) {       
        snowflakeCoordinate.y += 30;
        this.snowflakeCoordinates[i] = { x: snowflakeCoordinate.x, y: snowflakeCoordinate.y };
      } else {
        this.snowflakeCoordinates.slice(i);
      }
    }

    this.snowflakeCoordinateChanges$.next(this.snowflakeCoordinates);
  }
}

function generateCoordinate(inMilliseconds: number, max: number): Observable<number> {
  return timer(inMilliseconds, inMilliseconds)
        .pipe(map(_ => (Math.floor(Math.random() * max))));
}

import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { canvasHeight, canvasWidth, ICoordinate } from 'src/app/coordinates';

@Injectable({
  providedIn: 'root'
})
export class SnowflakeService { 
  private snowflakeCoordinates: Array<ICoordinate> = new Array<ICoordinate>();
  public snowflakeCoordinateChanges$ = new Subject<ReadonlyArray<ICoordinate>>();
  private density: number = 2000;
  private coordinateGeneration$: Subscription;

  constructor() {  
    this.coordinateGeneration$ = this.startSnowGeneration();
    timer(700, 700).subscribe(_ => this.moveSnowflakesDown());
  }

  public setDensity(density: number) {
    this.density = density;
    this.coordinateGeneration$.unsubscribe();
    this.coordinateGeneration$ = this.startSnowGeneration();
  }

  private startSnowGeneration(): Subscription {
    return generateCoordinate(this.density, canvasWidth)
          .subscribe(xCoordinate => this.addNewSnowflake(xCoordinate));
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

function generateCoordinate(density: number, max: number): Observable<number> {
  return timer(0, density)
        .pipe(map(_ => (Math.floor(Math.random() * max))));
}

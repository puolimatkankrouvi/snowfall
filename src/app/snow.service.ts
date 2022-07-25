import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { canvasHeight, canvasWidth, ICoordinate } from 'src/app/coordinates';

@Injectable({
  providedIn: 'root'
})
export class SnowService { 
  private snowflakeCoordinates: Array<ICoordinate> = new Array<ICoordinate>();
  public snowflakeCoordinateChanges$ = new Subject<ReadonlyArray<ICoordinate>>();
  private coordinateGeneration$: Subscription;

  public density: number = 2000;
  private densityChanges$ = new Subject<number>();

  constructor() {  
    this.coordinateGeneration$ = this.startSnowGeneration();
    timer(700, 700).subscribe(_ => this.moveSnowflakesDown());
    this.densityChanges$.subscribe(density => {
      this.density = density;
    });
  }

  public setDensity(density: number) {
    this.densityChanges$.next(density);
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
  return timer(0, 2200 - density)
        .pipe(map(_ => (Math.floor(Math.random() * max))));
}

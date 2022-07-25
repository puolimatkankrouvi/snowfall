import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICoordinate } from 'src/app/coordinate';
import { IDimensions } from 'src/app/dimensions';

@Injectable({
  providedIn: 'root'
})
export class SnowService { 
  private snowflakeCoordinates: Array<ICoordinate> = new Array<ICoordinate>();
  public snowflakeCoordinateChanges$ = new Subject<ReadonlyArray<ICoordinate>>();
  private coordinateGeneration$: Subscription;

  public density: number = 5;
  private densityChanges$ = new Subject<number>();

  public canvasDimensions: IDimensions = { width: 800, height: 600 };
  private canvasDimensionChanges$ = new Observable<IDimensions>();

  constructor() {  
    this.coordinateGeneration$ = this.startSnowGeneration();
    timer(700, 700).subscribe(_ => this.moveSnowflakesDown());
    this.densityChanges$.subscribe((density: number) => {
      this.density = density;
    });
    this.canvasDimensionChanges$.subscribe((dimensions: IDimensions) => {
      this.canvasDimensions = dimensions;
    });
  }

  public setDensity(density: number) {
    this.densityChanges$.next(density);
    this.coordinateGeneration$.unsubscribe();
    this.coordinateGeneration$ = this.startSnowGeneration();
  }

  private startSnowGeneration(): Subscription {
    return generateCoordinate(this.density, this.canvasDimensions.width)
          .subscribe((xCoordinate: number) => this.addNewSnowflake(xCoordinate));
  }

  private addNewSnowflake(xCoordinate: number) {
    this.snowflakeCoordinates.push({x: xCoordinate, y: 0});
    this.snowflakeCoordinateChanges$.next(this.snowflakeCoordinates);
  }

  private moveSnowflakesDown() {
    for (let i = 0; i < this.snowflakeCoordinates.length; i++) {
      const snowflakeCoordinate = this.snowflakeCoordinates[i];
      if (snowflakeCoordinate.y <= this.canvasDimensions.height) {       
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
  const interval = 2200 - (density * 200);
  return timer(0, interval)
        .pipe(map(_ => (Math.floor(Math.random() * max))));
}

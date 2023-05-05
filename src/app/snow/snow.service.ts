import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coordinate } from 'src/app/snow/coordinate';
import { CurrentAndOldDimensions, CurrentDimensions, maxCanvasHeight, maxCanvasWidth } from 'src/app/snow/dimensions';

@Injectable()
export class SnowService { 
  private snowflakeCoordinates: Array<Coordinate> = new Array<Coordinate>();
  public snowflakeCoordinateChanges$ = new Subject<ReadonlyArray<Coordinate>>();
  private coordinateGeneration$: Subscription;

  public density: number = 5;
  private densityChanges$ = new Subject<number>();

  public canvasDimensions: CurrentDimensions = { width: maxCanvasWidth, height: maxCanvasHeight };
  public canvasDimensionChanges$ = new Subject<CurrentDimensions>();

  constructor() {  
    this.coordinateGeneration$ = this.startSnowGeneration();
    timer(700, 700).subscribe(() => this.moveSnowflakesDown());
    this.densityChanges$.subscribe((density: number) => {
      this.density = density;
    });
    this.canvasDimensionChanges$.subscribe((dimensions: CurrentDimensions) => {
      this.canvasDimensions = dimensions;
    });
  }

  public setDensity(density: number) {
    this.densityChanges$.next(density);
    
    this.coordinateGeneration$.unsubscribe();
    this.coordinateGeneration$ = this.startSnowGeneration();
  }

  public setCanvasDimensions(width: number, height: number) {
    const oldWidth = this.canvasDimensions.width;
    const oldHeight = this.canvasDimensions.height;
    if (width !== oldWidth && height !== oldHeight) {
      this.coordinateGeneration$.unsubscribe()
      this.adjustSnowflakesToCanvasSize({ width, oldWidth, height, oldHeight });
      this.canvasDimensionChanges$.next({ width, height });
      this.coordinateGeneration$ = this.startSnowGeneration();
    }
  }

  private startSnowGeneration(): Subscription {
    return generateCoordinate(this.density, this.canvasDimensions.width)
          .subscribe((xCoordinate: number) => this.addNewSnowflake(xCoordinate));
  }

  private addNewSnowflake(xCoordinate: number) {
    this.snowflakeCoordinates.push({x: xCoordinate, y: 0});
    this.snowflakeCoordinateChanges$.next(this.snowflakeCoordinates);
  }

  private adjustSnowflakesToCanvasSize(dimensions: CurrentAndOldDimensions) {
    for (let i = 0; i < this.snowflakeCoordinates.length; i++) {
      const snowflakeCoordinate = this.snowflakeCoordinates[i];
      const widthRatio = dimensions.width / dimensions.oldWidth;
      const heightRatio = dimensions.height /dimensions. oldHeight;
      this.snowflakeCoordinates[i] = {
        x: snowflakeCoordinate.x * widthRatio,
        y: snowflakeCoordinate.y * heightRatio,
      };
    }

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

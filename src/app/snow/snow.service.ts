import { Injectable, signal } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coordinate, CoordinateAtTop } from 'src/app/snow/coordinate';
import { CurrentAndOldDimensions, CurrentDimensions, maxCanvasHeight, maxCanvasWidth } from 'src/app/snow/dimensions';

@Injectable()
export class SnowService { 
  private snowflakeCoordinates: Array<Coordinate> = new Array<Coordinate>();
  public snowflakeCoordinateChanges$ = new Subject<ReadonlyArray<Coordinate>>();
  private coordinateGeneration$: Subscription;

  public density = signal(5);

  public canvasDimensions: CurrentDimensions = { width: maxCanvasWidth, height: maxCanvasHeight };
  public canvasDimensionChanges$ = new Subject<CurrentDimensions>();

  constructor() {  
    this.coordinateGeneration$ = this.startSnowGeneration();
    timer(700, 700).subscribe(() => this.moveSnowflakeCoordinatesDown());
    this.canvasDimensionChanges$.subscribe((dimensions: CurrentDimensions) => {
      this.canvasDimensions = dimensions;
    });
  }

  public setDensity(density: number) {
    this.density.set(density);
    
    this.coordinateGeneration$.unsubscribe();
    this.coordinateGeneration$ = this.startSnowGeneration();
  }

  public setCanvasDimensions(dimensions: CurrentDimensions) {
    const { width, height } = dimensions;
    const oldWidth = this.canvasDimensions.width;
    const oldHeight = this.canvasDimensions.height;

    if (width !== oldWidth && height !== oldHeight) {
      this.coordinateGeneration$.unsubscribe()
      this.adjustSnowflakeCoordinatesToCanvasSize({ width, oldWidth, height, oldHeight });
      this.canvasDimensionChanges$.next({ width, height });
      this.coordinateGeneration$ = this.startSnowGeneration();
    }
  }

  private startSnowGeneration(): Subscription {
    return generateCoordinate(this.density(), this.canvasDimensions.width)
          .subscribe((xCoordinate: number) => this.addNewSnowflakeCoordinate(xCoordinate));
  }

  private addNewSnowflakeCoordinate(xCoordinate: number) {
    const coordinate: CoordinateAtTop = { x: xCoordinate, y: 0 };
    this.snowflakeCoordinates.push(coordinate);
    this.snowflakeCoordinateChanges$.next(this.snowflakeCoordinates);
  }

  private adjustSnowflakeCoordinatesToCanvasSize(dimensions: CurrentAndOldDimensions) {
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

  private moveSnowflakeCoordinatesDown() {
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

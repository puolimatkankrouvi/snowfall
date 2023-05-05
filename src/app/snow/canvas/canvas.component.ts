import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Coordinate } from 'src/app/snow/coordinate';
import { CurrentDimensions, maxCanvasHeight, maxCanvasWidth } from 'src/app/snow/dimensions';
import { SnowService } from 'src/app/snow/snow.service';

@Component({
  selector: 'snow-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements OnDestroy, AfterViewInit {
  @ViewChild('canvasEl') canvasEl!: ElementRef;

  private ctx!: CanvasRenderingContext2D | null;

  public canvasDimensions: CurrentDimensions

  resize$: Observable<Event> | null = null;
  resizeSubscription$: Subscription | null = null;

  constructor(private readonly snowService: SnowService) {
    this.canvasDimensions = snowService.canvasDimensions;
  }
  
  ngAfterViewInit(): void {
    this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');

    this.snowService.canvasDimensionChanges$.subscribe((canvasDimensions: CurrentDimensions) => {
      this.canvasDimensions = canvasDimensions
    });

    this.resize$ = fromEvent(window, "resize");
    this.resizeSubscription$ = this.resize$.pipe(debounceTime(500)).subscribe((event: any) => {
      const width = event.target.innerWidth - 10;
      const height = event.target.innerHeight - 10;

      const dimensions = this.clampDimensionsToMaxCanvasDimensions(width, height);
      this.snowService.setCanvasDimensions(dimensions);
    });

    this.snowService
      .snowflakeCoordinateChanges$
      .subscribe((snowflakeCoordinates: ReadonlyArray<Coordinate>) => this.redrawSnowflakes(snowflakeCoordinates));
  }

  ngOnDestroy(): void {
    this.resizeSubscription$!.unsubscribe();
  }
  
  private redrawSnowflakes(snowflakeCoordinates: ReadonlyArray<Coordinate>) { 
    this.ctx!.clearRect(0, 0, this.canvasDimensions.width, this.canvasDimensions.height);

    snowflakeCoordinates.forEach(coordinate => {     
      this.ctx!.beginPath()
      this.ctx!.arc(coordinate.x, coordinate.y, 5, 0, 2 * Math.PI);
      this.ctx!.stroke();
    });
  }

  private clampDimensionsToMaxCanvasDimensions(width: number, height: number): CurrentDimensions {
      return {
        width: Math.min(width, maxCanvasWidth),
        height: Math.min(height, maxCanvasHeight),
      };
  }
}


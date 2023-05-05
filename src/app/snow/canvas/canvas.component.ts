import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Coordinate } from 'src/app/snow/coordinate';
import { CurrentDimensions } from 'src/app/snow/dimensions';
import { SnowService } from 'src/app/snow/snow.service';

@Component({
  selector: 'snow-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements OnDestroy, AfterViewInit {
  @ViewChild('canvasEl') canvasEl!: ElementRef;

  private ctx!: CanvasRenderingContext2D | null;

  private snowService: SnowService;

  public canvasDimensions: CurrentDimensions

  resize$: Observable<Event> | null = null;
  resizeSubscription$: Subscription | null = null;

  constructor(snowService: SnowService) {
    this.snowService = snowService;
    this.canvasDimensions = snowService.canvasDimensions
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

      this.snowService.setCanvasDimensions(
        Math.min(width, 800),
        Math.min(height, 600),
      );
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
}


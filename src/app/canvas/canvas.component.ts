import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { canvasWidth, canvasHeight, ICoordinate } from 'src/app/coordinates';
import { SnowService } from 'src/app/snow.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvasEl') canvasEl!: ElementRef;

  private ctx!: CanvasRenderingContext2D | null;

  private snowflakeService: SnowService;

  constructor(snowService: SnowService) {
    this.snowflakeService = snowService;
  }
  
  ngAfterViewInit(): void {
    this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.snowflakeService
      .snowflakeCoordinateChanges$
      .subscribe(snowflakeCoordinates => this.redrawSnowflakes(snowflakeCoordinates));
  }
  
  private redrawSnowflakes(snowflakeCoordinates: ReadonlyArray<ICoordinate>) { 
    this.ctx!.clearRect(0, 0, canvasWidth, canvasHeight);

    snowflakeCoordinates.forEach(coordinate => {     
      this.ctx!.beginPath()
      this.ctx!.arc(coordinate.x, coordinate.y, 5, 0, 2 * Math.PI);
      this.ctx!.stroke();
    });
  }
}


import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { canvasWidth, canvasHeight, ICoordinate } from 'src/app/coordinates';
import { SnowflakeService } from '../snowflake.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less'],
  providers: [SnowflakeService]
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvasEl') canvasEl!: ElementRef;

  private ctx!: CanvasRenderingContext2D | null;

  private snowflakeService: SnowflakeService;

  constructor(snowService: SnowflakeService) {
    this.snowflakeService = snowService;
  }
  
  ngAfterViewInit(): void {
    this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.snowflakeService
      .snowflakeChanges$
      .subscribe(snowflakeCoordinates => this.printSnowflakes(snowflakeCoordinates));
  }
  
  private printSnowflakes(snowflakeCoordinates: ReadonlyArray<ICoordinate>) {
    if (this.ctx) {  
      this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      snowflakeCoordinates.forEach(coordinate => {     
        this.ctx!.beginPath()
        this.ctx!.arc(coordinate.x, coordinate.y, 5, 0, 2 * Math.PI);
        this.ctx!.stroke();
      });
    }
  }
}


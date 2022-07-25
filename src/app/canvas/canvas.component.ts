import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ICoordinate } from 'src/app/coordinate';
import { IDimensions } from 'src/app/dimensions';
import { SnowService } from 'src/app/snow.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvasEl') canvasEl!: ElementRef;

  private ctx!: CanvasRenderingContext2D | null;

  private snowService: SnowService;
  public canvasDimensions: IDimensions;

  constructor(snowService: SnowService) {
    this.snowService = snowService;
    this.canvasDimensions = snowService.canvasDimensions;
  }
  
  ngAfterViewInit(): void {
    this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.snowService
      .snowflakeCoordinateChanges$
      .subscribe((snowflakeCoordinates: ReadonlyArray<ICoordinate>) => this.redrawSnowflakes(snowflakeCoordinates));
  }
  
  private redrawSnowflakes(snowflakeCoordinates: ReadonlyArray<ICoordinate>) { 
    this.ctx!.clearRect(0, 0, this.canvasDimensions.width, this.canvasDimensions.height);

    snowflakeCoordinates.forEach(coordinate => {     
      this.ctx!.beginPath()
      this.ctx!.arc(coordinate.x, coordinate.y, 5, 0, 2 * Math.PI);
      this.ctx!.stroke();
    });
  }
}


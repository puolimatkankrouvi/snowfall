import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { ICoordinates, generateCoordinate } from 'src/app/coordinates';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvasEl') canvasEl!: ElementRef;

  private ctx!: CanvasRenderingContext2D | null;

  private snowflakeCoordinates: Array<ICoordinates>;

  private canvasWidth = 800;
  private canvasHeight = 600;

  constructor() {
    this.snowflakeCoordinates = new Array();
  }
  
  ngAfterViewInit(): void {
    this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    generateCoordinate(2000, this.canvasWidth).subscribe(xCoordinate => this.addNewSnowflake(xCoordinate));
    timer(700, 700).subscribe(_ => this.moveSnowflakesDown());
  }

  private addNewSnowflake(xCoordinate: number) {
    this.snowflakeCoordinates.push({x: xCoordinate, y: 0});
  }
  
  private printSnowflake(xCoordinate: number, yCoordinate: number) {
    if (this.ctx) {    
      this.ctx.beginPath()
      this.ctx.arc(xCoordinate, yCoordinate, 5, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
  }

  private moveSnowflakesDown() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      for (let i = 0; i < this.snowflakeCoordinates.length; i++) {
        const snowflakeCoordinate = this.snowflakeCoordinates[i];
        if (snowflakeCoordinate.y < this.canvasHeight) {
          
          this.printSnowflake(snowflakeCoordinate.x, snowflakeCoordinate.y);
          
          snowflakeCoordinate.y += 30;
          this.snowflakeCoordinates[i] = { x: snowflakeCoordinate.x, y: snowflakeCoordinate.y };
        } else {
          this.snowflakeCoordinates.slice(i);
        }
      }      
    }
  }

}

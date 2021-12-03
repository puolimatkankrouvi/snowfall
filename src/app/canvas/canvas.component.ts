import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ICoordinates, generateCoordinates } from 'src/app/coordinates';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.less']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvasEl') canvasEl!: ElementRef;

  private ctx!: CanvasRenderingContext2D | null;

  constructor() {}
  ngAfterViewInit(): void {
    this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    generateCoordinates(1000).subscribe(coordinates => this.printSnow(coordinates));
  }
  
  private printSnow(coordinates: ICoordinates) {
    if (this.ctx) {
      this.ctx.beginPath()
      this.ctx.arc(coordinates.x, coordinates.y, 5, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
  }

}

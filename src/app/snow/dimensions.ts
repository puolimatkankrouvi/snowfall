type OldDimensions = {
    oldWidth: number;
    oldHeight: number;
}

export type CurrentDimensions = {
    width: number;
    height: number;
}

export type CurrentAndOldDimensions = CurrentDimensions & OldDimensions;

export const maxCanvasWidth = 800;
export const maxCanvasHeight = 600;

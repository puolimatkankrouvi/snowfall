type OldDimensions = {
    oldWidth: number;
    oldHeight: number;
}

export type CurrentDimensions = {
    width: number;
    height: number;
}

export type CurrentAndOldDimensions = CurrentDimensions & OldDimensions;

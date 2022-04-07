import {
    Directions,
} from '../constants';

export default class Path {
    constructor(startCol, startRow, autoRecenter = false) {
        this.startCol = startCol;
        this.startRow = startRow;
        this.pathWidth = 1;
        this.pathHeight = 1;
        this.directions = [];
        this.autoRecenter = autoRecenter;
    }

    recalculateWidthHeight() {
        let minCol = 0;
        let minRow = 0;
        let maxCol = 0;
        let maxRow = 0;

        let curCol = 0;
        let curRow = 0;

        for (let i=0; i<this.directions.length; i++) {
            const dir = this.directions[i];
            const [colMove, rowMove] = {
                [Directions.North]: [0, -1],
                [Directions.South]: [0, 1],
                [Directions.East]: [1, 0],
                [Directions.West]: [-1, 0],
            }[dir];
            curCol -= colMove;
            curRow -= rowMove;
            if (curCol < minCol) minCol = curCol;
            if (curCol > maxCol) maxCol = curCol;
            if (curRow < minRow) minRow = curRow;
            if (curRow > maxRow) maxRow = curRow;
        }

        this.pathWidth = (maxCol - minCol) + 1;
        this.pathHeight = (maxRow - minRow) + 1;
    }

    move(dir, recenter = false) {
        const origPathWidth = this.pathWidth;
        const origPathHeight = this.pathHeight;
        this.directions.push(dir);
        this.recalculateWidthHeight();
        if (recenter || this.autoRecenter) {
            if (this.pathWidth !== origPathWidth && dir === Directions.West) this.startCol += 1;
            if (this.pathHeight !== origPathHeight && dir === Directions.North) this.startRow += 1;
        }
    };
}

export const convertServerPath = (currentShipPath) => {
    const shipPath = new Path(currentShipPath.startCol, currentShipPath.startRow);
    for (const dir of currentShipPath.path) {
        shipPath.move(dir);
    }
    return shipPath
}

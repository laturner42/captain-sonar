import {
    TILE_SIZE,
    Directions,
} from '../constants';

export default function Grid(props) {
    const {
        width,
        height,
        path,
        boardMargin,
        manualOffsetX,
        manualOffsetY,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        hidePath,
    } = props;

    const lineThickness = 8;
    const lineColor = props.lineColor || 'green';

    const {
        directions,
    } = path;

    let {
        startCol: currentCol,
        startRow: currentRow,
    } = path;

    currentCol += boardMargin;
    currentRow += boardMargin;

    const convertColRowtoXY = (col, row) => {
        return [
            (col * TILE_SIZE) + (TILE_SIZE / 2) - (lineThickness / 2),
            (row * TILE_SIZE) + (TILE_SIZE / 2) - (lineThickness / 2)
        ];
    }

    const [
        lineStartX,
        lineStartY,
    ] = convertColRowtoXY(currentCol, currentRow);

    const lineDivs = [
        <div
            style={{
                position: 'absolute',
                marginLeft: lineStartX - (TILE_SIZE / 2) + (lineThickness / 2),
                marginTop: lineStartY,
                backgroundColor: lineColor,
                width: TILE_SIZE,
                height: lineThickness,
                transform: 'rotate(45deg)',
                borderRadius: lineThickness
            }}
            key={'path-start-l'}
        />,
        <div
            style={{
                position: 'absolute',
                marginLeft: lineStartX - (TILE_SIZE / 2) + (lineThickness / 2),
                marginTop: lineStartY,
                backgroundColor: lineColor,
                width: TILE_SIZE,
                height: lineThickness,
                transform: 'rotate(-45deg)',
                borderRadius: lineThickness
            }}
            key={'path-start-r'}
        />
    ];

    for (let i=0; i<directions.length; i++) {
        const dir = directions[i];
        const [ startLocX, startLocY ] = convertColRowtoXY(currentCol, currentRow)
        let horizontal = false;
        let offsetX = 0;
        let offsetY = 0;
        switch (dir) {
            case (Directions.North):
                offsetY = -TILE_SIZE;
                currentRow -= 1;
                break;
            case (Directions.South):
                currentRow += 1;
                break;
            case (Directions.West):
                offsetX = -TILE_SIZE;
                currentCol -= 1;
                horizontal = true;
                break;
            case (Directions.East):
                currentCol += 1;
                horizontal = true;
                break;
            default:
                console.debug('uh oh bad direction');
                break;
        }
        let height, width;
        if (horizontal) {
            width = TILE_SIZE + lineThickness;
            height = lineThickness;
        } else {
            height = TILE_SIZE + lineThickness;
            width = lineThickness;
        }
        const marginLeft = startLocX + offsetX;
        const marginTop = startLocY + offsetY;
        lineDivs.push(
            <div
                style={{
                    position: 'absolute',
                    marginLeft,
                    marginTop,
                    width,
                    height,
                    borderRadius: lineThickness,
                    backgroundColor: lineColor,
                }}
                key={`path-line-${marginLeft},${marginTop},${dir}`}
            />
        )
    }

    return (
        <div
            style={{
                position: 'absolute',
                backgroundImage: `
                    repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%),
                    repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 100%)
                `,
                backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
                backgroundColor: `rgba(255, 255, 255, ${onMouseMove ? 0.25 : 0})`,
                borderRadius: onMouseMove ? TILE_SIZE : 0,
                width: ((width + (boardMargin * 2)) * TILE_SIZE) + 1,
                height: ((height + (boardMargin * 2)) * TILE_SIZE) + 1,
                margin: 0,
                marginLeft: manualOffsetX,
                marginTop: manualOffsetY,
            }}
            draggable="false"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
        >
            {!hidePath && lineDivs}
        </div>
    )
}

import { useState } from 'react';
import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    Directions,
    TILE_SIZE,
} from '../constants';
import map from '../components/rename.png';
import Grid from '../components/Grid';
import Notes from '../components/toolbelt/Notes';

export default function Navigator(props) {
    const {
        boardWidth,
        boardHeight,
        shipPath,
    } = props;

    const [offsetCoords, setOffsetCoords] = useState([0, 0]);
    const [dragCoords, setDragCoords] = useState(null);

    const toolBeltWidth = 200;

    const width = boardWidth * TILE_SIZE;
    const height = boardHeight * TILE_SIZE;

    const dragStart = (event) => {
        event.preventDefault();
        setDragCoords([event.pageX - offsetCoords[0], event.pageY - offsetCoords[1]]);
    }

    const updateOffset = (event) => {
        const offset = [(event.pageX - dragCoords[0]), event.pageY - dragCoords[1]];
        offset[0] = Math.min(Math.max(offset[0], -TILE_SIZE), (TILE_SIZE * boardWidth) - (TILE_SIZE * shipPath.pathWidth) - TILE_SIZE);
        offset[1] = Math.min(Math.max(offset[1], -TILE_SIZE), (TILE_SIZE * boardHeight) - (TILE_SIZE * shipPath.pathHeight) - TILE_SIZE);
        setOffsetCoords(offset);
    }

    const dragEnd = (event) => {
        event.preventDefault();
        updateOffset(event);
        setDragCoords(null);
    }

    const onDrag = (event) => {
        event.preventDefault();
        if (!dragCoords) return;
        if (event.pageX !== dragCoords[0] || event.pageY !== dragCoords[1]) {
            updateOffset(event);
        }
    }

    return (
        <div
            style={{
                width: width + toolBeltWidth,
                height,
                border: '10px solid #853',
                borderRadius: 5,
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                overflow: 'hidden',
            }}
        >
            <img
                src={map}
                width={width}
                height={height}
                style={{
                    position: 'absolute',
                }}
                draggable="false"
            />
            <Grid
                width={shipPath.pathWidth}
                height={shipPath.pathHeight}
                path={shipPath}
                boardMargin={1}
                lineColor="black"
                manualOffsetX={offsetCoords[0]}
                manualOffsetY={offsetCoords[1]}
                onMouseDown={dragStart}
                onMouseMove={onDrag}
                onMouseUp={dragEnd}
            />
            <div
                style={{
                    marginLeft: width,
                    width: toolBeltWidth,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Notes width={toolBeltWidth} />
            </div>
        </div>
    )
}
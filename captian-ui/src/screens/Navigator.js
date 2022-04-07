import { useState } from 'react';
import {
    TILE_SIZE,
} from '../constants';
import map from '../components/rename.png';
import Grid from '../components/Grid';
import Notes from '../components/toolbelt/Notes';
import ToolBelt from '../components/toolbelt/ToolBelt';
import {convertServerPath} from '../components/Path';
import SystemChoices from '../components/toolbelt/SystemChoices';

export default function Navigator(props) {
    const {
        boardWidth,
        boardHeight,
        enemyTeam,
        sendMessage,
    } = props;

    const shipPath = convertServerPath(enemyTeam.currentShipPath, true);

    const width = boardWidth * TILE_SIZE;
    const height = boardHeight * TILE_SIZE;

    const [offsetCoords, setOffsetCoords] = useState([(width/2) - (TILE_SIZE/2) - TILE_SIZE, (height/2) - (TILE_SIZE/2) - TILE_SIZE]);
    const [dragCoords, setDragCoords] = useState(null);


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
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <div
                style={{
                    width,
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
            </div>
            <ToolBelt>
                <Notes />
                <SystemChoices
                    title="Enemy Systems"
                    team={enemyTeam}
                    enableActions
                    clickable={false}
                    removeOutlines
                />
            </ToolBelt>
        </div>
    )
}
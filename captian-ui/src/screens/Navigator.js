import { useState } from 'react';
import {
    TILE_SIZE,
} from '../constants';
import Grid from '../components/Grid';
import Map from '../components/Map';
import Notes from '../components/toolbelt/Notes';
import ToolBelt from '../components/toolbelt/ToolBelt';
import {convertServerPath} from '../components/Path';
import SystemChoices from '../components/toolbelt/SystemChoices';
import EnemyHistory from '../components/toolbelt/EnemyHistory';

export default function Navigator(props) {
    const {
        boardWidth,
        boardHeight,
        enemyTeam,
    } = props;

    const [selectedPath, setSelectedPath] = useState(enemyTeam.currentShipPath);

    const changePath = (newPath) => {
        if (newPath === 'current') {
            setSelectedPath(enemyTeam.currentShipPath);
        } else {
            const index = parseInt(`${newPath}`, 10);
            setSelectedPath(enemyTeam.pastShipPaths[index]);
        }
    }

    const shipPath = convertServerPath(selectedPath, true);

    const width = (boardWidth * TILE_SIZE) + (TILE_SIZE * 2);
    const height = (boardHeight * TILE_SIZE) + (TILE_SIZE * 2);

    const [offsetCoords, setOffsetCoords] = useState([(width/2) - (TILE_SIZE/2) - TILE_SIZE, (height/2) - (TILE_SIZE/2) - TILE_SIZE]);
    const [dragCoords, setDragCoords] = useState(null);


    const dragStart = (event) => {
        event.preventDefault();
        setDragCoords([event.pageX - offsetCoords[0], event.pageY - offsetCoords[1]]);
    }

    const updateOffset = (event) => {
        const offset = [(event.pageX - dragCoords[0]), event.pageY - dragCoords[1]];
        offset[0] = Math.min(Math.max(offset[0], 0), (TILE_SIZE * boardWidth) - (TILE_SIZE * shipPath.pathWidth));
        offset[1] = Math.min(Math.max(offset[1], 0), (TILE_SIZE * boardHeight) - (TILE_SIZE * shipPath.pathHeight));
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
                <Map />
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
                <EnemyHistory
                    enemyTeam={enemyTeam}
                />
                <div
                    style={{
                        marginTop: 5,
                        width: '90%',
                        fontSize: 15,
                    }}
                >
                    <span>Tracking:</span>
                    <select
                        onChange={changePath}
                        style={{
                            width: '100%',
                            marginTop: 2,
                        }}
                    >
                        {
                            enemyTeam.pastShipPaths.map((p, i) => (
                                <option value={i}>Old Path {i + 1}</option>
                            ))
                        }
                        <option value='current'>Current Path</option>
                    </select>
                </div>
            </ToolBelt>
        </div>
    )
}
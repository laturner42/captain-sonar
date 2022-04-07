import { useState } from 'react';
import {
    Jobs,
    MessageTypes,
    TILE_SIZE,
    Directions,
    BOARD_HEIGHT,
    BOARD_WIDTH,
} from '../constants';
import map from '../components/rename.png';
import Grid from '../components/Grid';
import CaptainMap from '../components/toolbelt/CaptainMap';
import ToolBelt from '../components/toolbelt/ToolBelt';
import { convertServerPath } from '../components/Path';
import ConfirmSelection from '../components/Confirm';

export default function Captain(props) {
    const {
        boardWidth,
        boardHeight,
        myTeam,
        sendMessage,
    } = props;

    const [placementCol, setPlacementCol] = useState(Math.floor(BOARD_WIDTH / 2));
    const [placementRow, setPlacementRow] = useState(Math.floor(BOARD_HEIGHT / 2))

    const disabledDirections = [Directions.East];

    const { startSelected } = myTeam;
    const { pendingMove } = myTeam;
    const shipPath = convertServerPath(myTeam.currentShipPath);

    const markerSize = 20;

    const width = boardWidth * TILE_SIZE;
    const height = boardHeight * TILE_SIZE;

    const clickMap = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.
        const newCol = Math.floor((x / width) * (TILE_SIZE / 2));
        const newRow = Math.floor((y / height) * (TILE_SIZE / 2));
        setPlacementCol(newCol);
        setPlacementRow(newRow);
        sendMessage(
            MessageTypes.SET_START,
            {
                startCol: newCol,
                startRow: newRow,
            }
        )
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
                }}
            >
                <img
                    src={map}
                    alt="The Map"
                    width={width}
                    height={height}
                    style={{
                        position: 'absolute',
                    }}
                />
                <Grid
                    width={boardWidth}
                    height={boardHeight}
                    path={shipPath}
                    hidePath={!startSelected}
                    boardMargin={0}
                    lineColor="#444"
                    onMouseDown={startSelected ? undefined : clickMap}
                />
                {
                    !startSelected && (
                        <div
                            style={{
                                position: 'absolute',
                                left: (TILE_SIZE * placementCol) + (TILE_SIZE / 2) - (markerSize / 2),
                                top: (TILE_SIZE * placementRow) + (TILE_SIZE / 2) - (markerSize / 2),
                                width: markerSize - 10,
                                height: markerSize - 10,
                                borderStyle: 'solid',
                                borderWidth: 5,
                                borderColor: 'red',
                                borderRadius: markerSize,
                            }}
                        />
                    )
                }
            </div>
            <ToolBelt>
                <CaptainMap active={!pendingMove && startSelected} pendingDirection={pendingMove && pendingMove.direction} sendMessage={sendMessage} disabledDirections={disabledDirections} />
                {
                    !startSelected &&
                        <ConfirmSelection job={Jobs.CAPTAIN} sendMessage={sendMessage} />
                }
            </ToolBelt>
        </div>
    )
}
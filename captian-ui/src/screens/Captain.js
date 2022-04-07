import { useState } from 'react';
import {
    Button,
} from '@mui/material';
import {
    Jobs,
    MessageTypes,
    TILE_SIZE,
    Directions,
    BOARD_HEIGHT,
    BOARD_WIDTH,
} from '../constants';
import {
    Systems,
} from '../components/systems';
import map from '../components/rename.png';
import Grid from '../components/Grid';
import CaptainMap from '../components/toolbelt/CaptainMap';
import ToolBelt from '../components/toolbelt/ToolBelt';
import { convertServerPath } from '../components/Path';
import ConfirmSelection from '../components/Confirm';
import CaptainSystemChoice from '../components/toolbelt/CaptainSystemChoice';
import SystemChoices from '../components/toolbelt/SystemChoices';

export default function Captain(props) {
    const {
        boardWidth,
        boardHeight,
        myTeam,
        enemyTeam,
        sendMessage,
    } = props;

    const [placementCol, setPlacementCol] = useState(Math.floor(BOARD_WIDTH / 2));
    const [placementRow, setPlacementRow] = useState(Math.floor(BOARD_HEIGHT / 2))

    const { startSelected } = myTeam;
    const { startSelected: enemyStartSelected } = enemyTeam;
    const { pendingMove } = myTeam;
    const shipPath = convertServerPath(myTeam.currentShipPath);

    const disabledDirections = [];

    const markerSize = 20;

    const width = boardWidth * TILE_SIZE + TILE_SIZE;
    const height = boardHeight * TILE_SIZE + TILE_SIZE;

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

    const enableActions = !pendingMove && startSelected && enemyStartSelected;

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
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                        width: TILE_SIZE,
                    }}
                >
                    <div
                        style={{
                            marginTop: TILE_SIZE,
                        }}
                    />
                    {
                        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((num) => (
                            <div
                                style={{
                                    height: TILE_SIZE,
                                    width: TILE_SIZE,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ccf',
                                    fontSize: 16,
                                }}
                            >
                                {num}
                            </div>
                        ))
                    }
                </div>
                <div
                    // style={{
                    //     marginLeft: TILE_SIZE,
                    //     marginTop: TILE_SIZE,
                    // }}
                >
                    <div
                        style={{
                            display: 'flex',
                            height: TILE_SIZE
                        }}
                    >
                        {
                            ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'].map((num) => (
                                <div
                                    style={{
                                        height: TILE_SIZE,
                                        width: TILE_SIZE,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ccf',
                                        fontSize: 16,
                                    }}
                                >
                                    {num}
                                </div>
                            ))
                        }
                    </div>
                    <img
                        src={map}
                        alt="The Map"
                        width={width - TILE_SIZE}
                        height={height - TILE_SIZE}
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
            </div>
            <ToolBelt>
                <CaptainMap active={enableActions} pendingDirection={pendingMove && pendingMove.direction} sendMessage={sendMessage} disabledDirections={disabledDirections} />
                <SystemChoices
                    team={myTeam}
                    enableActions={enableActions}
                    clickable
                />
                <div
                    style={{
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            borderWidth: 2,
                            borderRadius: 30,
                            borderColor: '#444',
                            borderStyle: 'solid',
                            margin: 5,
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <span>Ship</span>
                        <Button
                            disabled={!enableActions}
                            variant="contained"
                            style={{ margin: 5 }}

                        >
                            Surface
                        </Button>
                    </div>
                </div>
                {
                    !startSelected &&
                        <ConfirmSelection text="Dive!" job={Jobs.CAPTAIN} sendMessage={sendMessage} />
                }
            </ToolBelt>
        </div>
    )
}
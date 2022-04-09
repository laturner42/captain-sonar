import { useState } from 'react';
import {
    Button,
} from '@mui/material';
import {
    MyLocation as Compass,
} from '@mui/icons-material';
import { letters, getCurrentLoc, MessageTypes, TILE_SIZE } from '../../constants';

export default function MinesAction(props) {
    const {
        isMyAction,
        sendMessage,
        myTeam,
        possibleMineLocations,
    } = props;

    const [selectedLoc, setSelectedLoc] = useState([]);

    if (!isMyAction) {
        return (
            <div style={{ fontSize: 20, textAlign: 'center', marginTop: 40 }}>
                <span>The Enemy is deploying a Mine.</span>
                <div style={{ marginTop: 10 }}>
                    <span>Hold on tight!</span>
                </div>
            </div>
        )
    }

    const [
        currentCol,
        currentRow,
    ] = getCurrentLoc(myTeam.currentShipPath);

    const lockItIn = () => {
        sendMessage(
            MessageTypes.PLACE_MINE,
            {
                col: selectedLoc[0],
                row: selectedLoc[1],
            },
        )
    }

    const spaces = [];



    for (let r=-1; r<=1; r++) {
        const line = [];
        for (let c=-1; c<=1; c++) {
            const col = currentCol + c;
            const row = currentRow + r;
            let active = false;
            for (const loc of possibleMineLocations) {
                if (col === loc[0] && row === loc[1]) {
                    active = true;
                    break;
                }
            }
            const selected = col === selectedLoc[0] && row === selectedLoc[1];
            const center = c === 0 && r === 0;
            line.push(
                <div
                    key={`mine-tile-${col}${row}`}
                    style={{
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        margin: 1,
                        backgroundColor: (active || center) ? (selected ? 'red' : '#6af') : undefined,
                        borderWidth: 1,
                        color: 'white',
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: active ? 'pointer' : undefined,
                    }}
                    onClick={active ? () => setSelectedLoc([col, row]) : null}
                >
                    {
                        center ?
                            <Compass style={{ fontSize: 18 }} /> :
                            active ? `${letters[col]}${row + 1}` : ''
                    }
                </div>
            )
        }
        spaces.push(line);
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 16,
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    margin: 10,
                    marginTop: -5,
                    height: 50,
                }}
            >
                <span>Select the Column and Row to place a Mine at.</span>
                <span>You can trigger this mine manually later.</span>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 20,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    {
                        spaces.map((line) => (
                            <div
                                style={{ display: 'flex', flexDirection: 'row' }}
                            >
                                {line}
                            </div>
                        ))
                    }
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 40,
                    }}
                >
                    <Button
                        onClick={lockItIn}
                        variant="outlined"
                        color="secondary"
                        style={{
                            margin: 20,
                        }}
                    >
                        Lock In
                    </Button>
                </div>
            </div>
        </div>
    )
}
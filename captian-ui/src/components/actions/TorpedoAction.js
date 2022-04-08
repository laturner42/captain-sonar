import { useState } from 'react';
import {
    Button,
} from '@mui/material';
import {
    Navigation as Arrow,
    MyLocation as Compass,
} from '@mui/icons-material';
import {letters, getCurrentLoc, MessageTypes, TILE_SIZE} from '../../constants';

export default function TorpedoAction(props) {
    const {
        isMyAction,
        sendMessage,
        myTeam,
        map,
    } = props;

    const [selectedLoc, setSelectedLoc] = useState([]);

    if (!isMyAction) {
        return (
            <div style={{ fontSize: 20, textAlign: 'center', marginTop: 40 }}>
                <span>The Enemy is deploying a torpedo.</span>
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
            MessageTypes.LAUNCH_TORPEDO,
            {
                col: selectedLoc[0],
                row: selectedLoc[1],
            },
        )
    }

    const spaces = [];

    for (let r=-4; r<=4; r++) {
        const line = [];
        for (let c=-4; c<=4; c++) {
            const col = currentCol + c;
            const row = currentRow + r;
            let active = Math.abs(Math.abs(c) + Math.abs(r)) <= 4;
            for (const island of map.islandLocs) {
                if (col === island[0] && row === island[1]) {
                    active = false;
                }
            }
            const selected = col === selectedLoc[0] && row === selectedLoc[1];
            line.push(
                <div
                    key={`torpedo-tile-${col}${row}`}
                    style={{
                        width: TILE_SIZE * 0.75,
                        height: TILE_SIZE * 0.75,
                        margin: 1,
                        backgroundColor: active ? (selected ? 'red' : '#6af') : undefined,
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
                        c === 0 && r == 0 ?
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
                    margin: 10,
                    marginTop: -5,
                }}
            >
                <span>Select the Column and Row to fire a Torpedo at.</span>
            </div>
            <div
                style={{
                    display: 'flex',
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
                        width: '100%',
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
                        Fire!
                    </Button>
                </div>
            </div>
        </div>
    )
}
import { useState } from 'react';
import {
    Button,
} from '@mui/material';
import {
    MyLocation as Compass,
} from '@mui/icons-material';
import {letters, getCurrentLoc, MessageTypes, TILE_SIZE, BOARD_WIDTH} from '../../constants';

export default function SilenceAction(props) {
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
                <span>The Enemy has deployed a cloak.</span>
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                    <span>They can move in only a single direction, up to four tiles.</span>
                </div>
                <span>Their systems do not charge or take damage during these moves.</span>
            </div>
        )
    }

    const [
        currentCol,
        currentRow,
    ] = getCurrentLoc(myTeam.currentShipPath);

    const lockItIn = () => {
        sendMessage(
            MessageTypes.MOVE_QUIETLY,
            {
                col: selectedLoc[0],
                row: selectedLoc[1],
            },
        )
    }

    const badLocs = [...myTeam.mines, ...map.islandLocs];
    const goodLocs = [];

    const keepGoing = [true, true, true, true];
    for (let i=0; i<=4; i++) {
        const checkLocs = [
            [currentCol + i, currentRow],
            [currentCol - i, currentRow],
            [currentCol, currentRow + i],
            [currentCol, currentRow - i],
        ];
        for (let j=0; j<checkLocs.length; j++) {
            const checkLoc = checkLocs[j];
            let weGood = keepGoing[j];
            for (const bacLoc of badLocs) {
                if (keepGoing[j]) {
                    if (checkLoc[0] === bacLoc[0] && checkLoc[1] === bacLoc[1]) {
                        keepGoing[j] = false;
                        weGood = false;
                        break;
                    }
                } else {
                    break;
                }
            }
            if (weGood) {
                goodLocs.push(checkLoc);
            }
        }
    }

    const spaces = [];

    for (let r=-4; r<=4; r++) {
        const line = [];
        for (let c=-4; c<=4; c++) {
            const col = currentCol + c;
            const row = currentRow + r;
            let active = false;
            if (col >= 0 && row >= 0 && col < BOARD_WIDTH && row < BOARD_WIDTH) {
                for (const goodLoc of goodLocs) {
                    if (col === goodLoc[0] && row === goodLoc[1]) {
                        active = true;
                        break;
                    }
                }
            }
            const selected = col === selectedLoc[0] && row === selectedLoc[1];
            line.push(
                <div
                    key={`silence-tile-${col}${row}`}
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
                        c === 0 && r === 0 ?
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
                <span>Select the Column and Row to silently move to.</span>
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
                        Move
                    </Button>
                </div>
            </div>
        </div>
    )
}
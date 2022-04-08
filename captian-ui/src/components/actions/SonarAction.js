import { useState } from 'react';
import {
    Button,
} from '@mui/material';
import { MessageTypes } from '../../constants';

export default function SonarAction(props) {
    const {
        isMyAction,
        sendMessage,
    } = props;
    const [chosenSector, setChosenSector] = useState('1');

    if (!isMyAction) {
        return (
            <div style={{ fontSize: 20, textAlign: 'center', marginTop: 40 }}>
                <span>The Enemy is guessing which Sector your ship is in.</span>
            </div>
        )
    }

    const lockItIn = () => {
        sendMessage(
            MessageTypes.SCAN_SONAR,
            {
                sector: parseInt(`${chosenSector}`, 10),
            }
        )
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
            <span>Select which Sector you believe the Enemy is in.</span>
            <div
                style={{
                    marginTop: 20,
                    marginBottom: 20,
                }}
            >
                <span>The results will be reported to your First Mate.</span>
            </div>
            <div
                style={{
                    display: 'flex',
                    height: 35,
                    justifyContent: 'center',
                }}
            >
                <select
                    onChange={(event) => setChosenSector(event.target.value)}
                    value={chosenSector}
                    style={{ width: 90 }}
                >
                    {
                        [1,2,3,4,5,6,7,8,9].map((sector) => (
                            <option value={sector}>Sector {sector}</option>
                        ))
                    }
                </select>
                <Button
                    onClick={lockItIn}
                    variant="outlined"
                    style={{ marginLeft: 30 }}
                >
                    Lock In
                </Button>
            </div>
        </div>
    )
}
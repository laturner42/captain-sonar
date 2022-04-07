import { useState } from 'react';
import {
    Button,
} from '@mui/material';
import { MessageTypes } from '../../constants';

export default function SonarAction(props) {
    const {
        isMyAction,
        myTeam,
        enemyTeam,
        sendMessage,
    } = props;
    const [chosenSector, setChosenSector] = useState('1');

    if (!isMyAction) {
        return (
            <span>The Enemy is guessing which Sector your ship is in.</span>
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
        <div>
            <span>Please select what Sector you believe the Enemy is in.</span>
            <select
                onChange={(event) => setChosenSector(event.target.value)}
                value={chosenSector}
            >
                {
                    [1,2,3,4,5,6,7,8,9].map((sector) => (
                        <option value={sector}>Sector ${sector}</option>
                    ))
                }
            </select>
            <Button
                onClick={lockItIn}
            >
                Lock In
            </Button>
        </div>
    )
}
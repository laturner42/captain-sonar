import { useState } from 'react';
import {
    Button,
    TextField,
} from '@mui/material';
import {calculateSector, getCurrentLoc, MessageTypes} from '../../constants';

export default function DroneAction(props) {
    const {
        isMyAction,
        myTeam,
        sendMessage,
    } = props;

    const [selectedSector, setSelectedSector] = useState(null);
    const [selectedCol, setSelectedCol] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const [lieInfo, setLieInfo] = useState('sector');
    const [lieValue, setLieValue] = useState(null);

    if (isMyAction) {
        return (
            <div>
                <span>The Drone is scanning the Enemy.</span>
                <span>The Enemy is aware and are attempting countermeasures.</span>
                <span>Only one piece of information the Drone brings back will be accurate.</span>
            </div>
        )
    }

    const [ currentCol, currentRow ] = getCurrentLoc(myTeam.currentShipPath);
    const currentSector = calculateSector(currentCol, currentRow);

    const setTruth = ({ target }) => {
        const { value: truth } = target;

        setSelectedSector(null);
        setSelectedCol(null);
        setSelectedRow(null);

        if (truth === 'sector') setSelectedSector(currentSector);
        else if (truth === 'col') setSelectedCol(currentCol);
        else if (truth === 'row') setSelectedRow(currentRow);
    }

    const lockItIn = () => {
        let sendingSector = selectedSector;
        let sendingCol = selectedCol;
        let sendingRow = selectedRow;

        if (lieInfo === 'sector') sendingSector = lieValue;
        else if (lieInfo === 'col') sendingCol = lieValue;
        else if (lieInfo === 'row') sendingRow = lieValue;

        let message = 'The Drone reported';
        if (selectedSector) {
            message += ` Sector ${sendingSector}`
        }
        if (selectedCol) {
            message += ` Column ${sendingCol}`
        }
        if (selectedRow) {
            message += ` Row ${sendingRow}`
        }
        sendMessage(
            MessageTypes.SEND_DRONES,
            {
                message,
            }
        )
    }

    return (
        <div>
            <span>Select which location detail the Drone will report accurately.</span>
            <select
                onChange={setTruth}
            >
                <option value="sector">Sector ${currentSector}</option>
                <option value="col">Column ${currentCol}</option>
                <option value="row">Row ${currentRow}</option>
            </select>
            <span>Now select which location detail the Drone will report inaccurately.</span>
            <select
                onChange={({ target }) => setLieInfo(target.value)}
            >
                { !selectedSector && <option value="sector">Sector ${currentSector}</option> }
                { !selectedCol && <option value="col">Column ${currentCol}</option> }
                { !selectedRow && <option value="row">Row ${currentRow}</option> }
            </select>
            <span>What value will the Drone report?</span>
            <TextField
                disabled={!lieInfo}
                onChange={({ target }) => setLieValue(target.value)}
            />
            <Button
                onClick={lockItIn}
                disabled={!lieValue}
            >
                Lock In
            </Button>
        </div>
    )
}
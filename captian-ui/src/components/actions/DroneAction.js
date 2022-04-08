import { useState } from 'react';
import {
    Button,
    TextField,
} from '@mui/material';
import {calculateSector, getCurrentLoc, MessageTypes, letters } from '../../constants';

export default function DroneAction(props) {
    const {
        isMyAction,
        myTeam,
        sendMessage,
    } = props;

    const [ currentCol, currentRow ] = getCurrentLoc(myTeam.currentShipPath);
    const currentSector = calculateSector(currentCol, currentRow);

    const [selectedSector, setSelectedSector] = useState(currentSector);
    const [selectedCol, setSelectedCol] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const [lieInfo, setLieInfo] = useState('');
    const [lieValue, setLieValue] = useState('');

    if (isMyAction) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 20,
                    textAlign: 'center',
                    height: '80%',
                }}
            >
                <span>The Drone is scanning for the Enemy.</span>
                <span>The Enemy is aware and are attempting countermeasures.</span>
                <span>Only one piece of information the Drone brings back will be accurate.</span>
                <span>The Drone's report will be sent to the First Mate.</span>
            </div>
        )
    }

    const setTruth = ({ target }) => {
        const { value: truth } = target;

        setSelectedSector(null);
        setSelectedCol(null);
        setSelectedRow(null);
        setLieInfo('');

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
        if (sendingSector) {
            message += ` Sector ${sendingSector},`
        }
        if (sendingCol) {
            message += ` Column ${sendingCol},`
        }
        if (sendingRow) {
            message += ` Row ${sendingRow},`
        }
        sendMessage(
            MessageTypes.SEND_DRONES,
            {
                message: message.replace(/,$/, '.'),
            }
        )
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 16,
                justifyContent: 'space-evenly',
                height: '100%',
            }}
        >
            <div style={{ marginLeft: 10, marginRight: 10, width: '100%', textAlign: 'center', }} ><span>You've managed to hack into the Enemy Drone.</span></div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div
                    style={{
                        width: 260,
                    }}
                >
                    <span>Select which location detail the Drone will report <span style={{ fontWeight: 'bold', color: '#060' }}>accurately.</span></span>
                </div>
                <div
                    style={{ width: 120, height: 40, display: 'flex' }}
                >
                    <select
                        onChange={setTruth}
                        style={{ width: '100%' }}
                    >
                        <option value="sector">Sector {currentSector}</option>
                        <option value="col">Column {letters[currentCol]}</option>
                        <option value="row">Row {currentRow + 1}</option>
                    </select>
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div
                    style={{
                        width: 260,
                    }}
                >
                    <span>Select which location detail the Drone will report <span style={{ fontWeight: 'bold', color: '#600' }}>inaccurately.</span></span>
                </div>
                <div
                    style={{ width: 120, height: 40, display: 'flex' }}
                >
                    <select
                        onChange={({ target }) => setLieInfo(target.value)}
                        style={{ width: '100%' }}
                        value={lieInfo}
                    >
                        { <option value="">Select One</option>}
                        { !selectedSector && <option value="sector">Sector</option> }
                        { !selectedCol && <option value="col">Column</option> }
                        { !selectedRow && <option value="row">Row</option> }
                    </select>
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div
                    style={{
                        width: 260,
                    }}
                >
                    <span>Enter the value that the Drone will report instead.</span>
                </div>
                <div
                    style={{ width: 120, height: 40 }}
                >
                    <TextField
                        inputProps={{
                            style: {
                                height: 4,
                            }
                        }}
                        value={lieValue}
                        disabled={!lieInfo}
                        onChange={({ target }) => setLieValue(target.value.slice(0, 2))}
                    />
                </div>
            </div>
            <Button
                onClick={lockItIn}
                disabled={!lieValue}
            >
                Lock In
            </Button>
        </div>
    )
}
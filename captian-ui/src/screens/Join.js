import { useState } from 'react';
import {
    TextField,
    Button,
} from '@mui/material';
import {MessageTypes} from '../constants';

export default function Join(props) {
    const {
        myName,
        setMyName,
        join,
        connected,
    } = props;

    const [joining, setJoining] = useState(false);

    const changeName = ({ target }) => {
        let { value: newName } = target;
        setMyName(newName);
    }

    const startJoin = () => {
        setJoining(true);
        join();
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <span>Join Game</span>
            <TextField
                label="Name"
                value={myName}
                onChange={changeName}
                autoFocus
                inputProps={{
                    style: {
                        color: 'white',
                    }
                }}
                style={{
                    marginTop: 10,
                    marginBottom: 10,
                }}
            />
            <Button
                onClick={startJoin}
                disabled={joining || !connected || !myName}
                variant="outlined"
                fullWidth
            >
                Join
            </Button>
        </div>
    )
}
import { useState } from 'react';
import {MessageTypes} from '../constants';

export default function ConfirmSelection(props) {
    const {
        job,
        sendMessage,
        disabled,
        text,
    } = props;
    const [pending, setPending] = useState(false);

    const confirmSelection = () => {
        setPending(true);
        sendMessage(
            MessageTypes.CONFIRM_SELECTION,
            {
                job,
            }
        );
    };

    const off = disabled || pending;

    return (
        <div>
            <div
                style={{
                    width: 100,
                    height: 40,
                    backgroundColor: off ? 'gray' : 'green',
                    borderWidth: 1,
                    borderColor: 'white',
                    borderStyle: 'solid',
                    borderRadius: 10,
                    cursor: off ? undefined : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={off ? undefined : confirmSelection}
            >
                <span>{text || 'Confirm'}</span>
            </div>
        </div>
    )
}
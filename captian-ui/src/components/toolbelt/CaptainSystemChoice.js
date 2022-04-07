import {SystemColors} from '../systems';
import {SystemIcons} from '../SystemIcons';

export default function CaptainSystemChoice(props) {
    const {
        system,
        systems,
        disabled,
        clickable,
        removeOutline,
    } = props;

    const systemSize = 40;

    const active = !disabled && systems[system].filled === systems[system].max;

    return (
        <div
            style={{
                width: systemSize,
                height: systemSize,
                borderStyle: 'solid',
                borderColor: removeOutline ? SystemColors[system] : 'white',
                borderWidth: 3,
                backgroundColor: SystemColors[system],
                borderRadius: systemSize,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: systemSize * 1.1,
                opacity: active ? 1 : 0.6,
                margin: 5,
                cursor: active && clickable ? 'pointer' : 'not-allowed',
            }}
        >
            {SystemIcons[system]}
        </div>
    )
}
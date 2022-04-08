import {
    SystemColors,
} from './systems';

import {
    SystemIcons,
} from './SystemIcons';

import {
    Jobs,
} from '../constants';

export default function System(props) {
    const {
        system,
        systems,
        pendingMove,
        onClick,
    } = props;

    const { filled, max } = systems[system];

    const selected = !!pendingMove && pendingMove.firstmateSelection === system;
    const disabled = !pendingMove || pendingMove.confirmed[Jobs.FIRSTMATE]; // || filled === max;

    const systemSize = 75;

    const rectangles = [];
    const rectWidth = systemSize * 0.5;
    const rectHeight = systemSize * 0.3;
    for (let i=0; i<max; i++) {
        rectangles.push(
            <div
                key={`system-${i}`}
                style={{
                    position: 'absolute',
                    backgroundColor: `rgba(255,255,255,${filled > i ? 1 : 0.5})`,
                    width: rectWidth,
                    height: rectHeight,
                    borderRadius: systemSize * 0.1,
                    transformOrigin: '50% 275%',
                    transform: `rotate(${30 + (i * 45)}deg)`,
                    marginTop: -rectHeight,
                    marginLeft: (systemSize * 0.5) - (rectWidth / 2),
                }}
            />
        )
    }

    return (
        <div
            style={{
                position: 'relative',
                margin: rectWidth * 0.8,
                cursor: disabled ? undefined : 'pointer',
            }}
            key={system}
            onClick={disabled ? undefined : () => onClick(system)}
        >
            {rectangles}
            <div
                style={{
                    position: 'absolute',
                    fontSize: 16,
                    textAlign: 'right',
                    right: 42,
                    top: -22,
                }}
            >
                <span>{system}</span>
            </div>
            <div
                style={{
                    width: systemSize,
                    height: systemSize,
                    borderStyle: 'solid',
                    borderColor: selected ? 'cyan' : 'white',
                    color: selected ? 'cyan' : 'white',
                    borderWidth: 3,
                    backgroundColor: SystemColors[system],
                    borderRadius: systemSize,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: systemSize * 1.1,
                }}
            >
                {SystemIcons[system]}
            </div>
        </div>
    )
}
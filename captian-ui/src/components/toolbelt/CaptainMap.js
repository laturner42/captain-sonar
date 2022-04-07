import {
    Navigation as Arrow,
    MyLocation as Compass,
} from '@mui/icons-material';
import {
    Directions, MessageTypes,
} from '../../constants';

export default function CaptainMap(props) {
    const {
        active,
        pendingDirection,
        disabledDirections,
        sendMessage,
    } = props;

    const DirectionBlock = ({ direction }) => {
        let icon = <Compass />;
        let onClick;

        const selected = pendingDirection === direction;
        const disabled = disabledDirections.includes(direction) || !!pendingDirection;

        if (direction) {
            icon = <Arrow />;
            if (!disabled) {
                onClick=() => sendMessage(MessageTypes.HEAD, { direction })
            }
        }
        const rotate = {
            [Directions.South]: 180,
            [Directions.East]: 90,
            [Directions.West]: -90,
        }[direction] || 0;

        return (
            <div
                style={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: !!onClick ? 'pointer' : undefined,
                    transform: `rotate(${rotate}deg)`,
                    opacity: disabled ? 0.5 : 1,
                    color: selected ? 'lime' : 'white',
                }}
                onClick={onClick}
            >
                {icon}
            </div>
        )
    }

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid white',
                }}
            >
                <span>Heading</span>
                <DirectionBlock direction={Directions.North} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <DirectionBlock direction={Directions.West} />
                    <DirectionBlock />
                    <DirectionBlock direction={Directions.East} />
                </div>
                <DirectionBlock direction={Directions.South} />
            </div>
        </div>
    )
}
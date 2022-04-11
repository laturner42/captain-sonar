import {
    MyLocation as Compass,
} from '@mui/icons-material';
import {
    Directions, MessageTypes,
} from '../../constants';
import {dirIcon} from '../SystemIcons';

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
        const disabled = !active || disabledDirections.includes(direction) || !!pendingDirection;

        if (direction) {
            icon = dirIcon(direction);
            if (!disabled) {
                onClick=() => sendMessage(MessageTypes.HEAD, { direction })
            }
        }

        return (
            <div
                style={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: !!onClick ? 'pointer' : 'not-allowed',
                    opacity: disabled ? 0.5 : 1,
                    color: selected ? 'lime' : 'white',
                    margin: 1,
                }}
                onClick={onClick}
            >
                {icon}
            </div>
        )
    }

    return (
        <div
            style={{
                width: '100%',
            }}
        >
            <div
                style={{
                    margin: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderRadius: 30,
                    borderColor: '#444',
                    borderStyle: 'solid',
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
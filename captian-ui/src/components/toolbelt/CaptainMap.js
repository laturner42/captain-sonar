import {
    Navigation as Arrow,
    MyLocation as Compass,
} from '@mui/icons-material';
import {
    Directions,
} from '../../constants';

export default function CaptainMap(props) {
    const {
        activee,
    } = props;

    const DirectionBlock = ({ direction }) => {
        let icon = <Compass />;
        let onClick;
        if (direction) {
            icon = <Arrow />;
            onClick = () => {

            };
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
                }}
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
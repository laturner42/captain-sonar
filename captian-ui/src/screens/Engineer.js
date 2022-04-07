import {
    Navigation as Arrow,
} from '@mui/icons-material';
import {
    TILE_SIZE, Directions, MessageTypes, Jobs
} from '../constants';
import {
    SubSystems,
    SubSystemsColors,
} from '../components/systems';
import {
    SubSystemsIcons,
} from '../components/SystemIcons';
import Notes from '../components/toolbelt/Notes';
import ToolBelt from '../components/toolbelt/ToolBelt';
import ConfirmSelection from '../components/Confirm';

const rotations = {
    [Directions.North]: 0,
    [Directions.South]: 180,
    [Directions.East]: 90,
    [Directions.West]: -90,
}

const dirIcon = (direction, oStyle = {}) => (
    <div
        style={{
            ...oStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        }}
    >
        <Arrow style={{ fontSize: 40, color: '#666', position: 'absolute', transform: `rotate(${rotations[direction]}deg)` }} />
        <span
            style={{ position: 'relative', fontWeight: 'bold' }}
        >
            {direction}
        </span>
    </div>
)


export default function Navigator(props) {
    const {
        boardWidth,
        boardHeight,
        myTeam,
        sendMessage,
    } = props;
    // const [currentSelection, setCurrentSelection] = useState(null);

    const setCurrentSelection = (selection) => {
        sendMessage(
            MessageTypes.SELECT_ENGINEER_SYSTEM,
            {
                engineerSelection: selection,
            }
        )
    }

    const { pendingMove, offlineSystems } = myTeam;

    const width = boardWidth * TILE_SIZE;
    const height = boardHeight * TILE_SIZE;

    const directionOrder = [Directions.West, Directions.North, Directions.South, Directions.East];

    const subsystems = [
        {
            name: 'A',
            [Directions.West]: [SubSystems.Weapons, SubSystems.Flee, SubSystems.Search],
            [Directions.North]: null,
            [Directions.South]: null,
            [Directions.East]: [SubSystems.Weapons],
        },
        {
            name: 'B',
            [Directions.West]: null,
            [Directions.North]: [SubSystems.Flee, SubSystems.Flee, SubSystems.Weapons],
            [Directions.South]: null,
            [Directions.East]: [SubSystems.Search],
        },
        {
            name: 'C',
            [Directions.West]: null,
            [Directions.North]: null,
            [Directions.South]: [SubSystems.Search, SubSystems.Flee, SubSystems.Weapons],
            [Directions.East]: [SubSystems.Flee],
        },
        {
            name: 'S',
            [Directions.West]: [SubSystems.Search, SubSystems.Reactor, SubSystems.Reactor],
            [Directions.North]: [SubSystems.Search, SubSystems.Weapons, SubSystems.Reactor],
            [Directions.South]: [SubSystems.Weapons, SubSystems.Reactor, SubSystems.Flee],
            [Directions.East]: [SubSystems.Reactor, SubSystems.Search, SubSystems.Reactor],
        },
    ];

    const iconSize = width * 0.06;

    const awaitingSelection = !!pendingMove && !pendingMove.confirmed[Jobs.ENGINEER];

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <div
                style={{
                    width,
                    height,
                    border: '10px solid #853',
                    borderRadius: 5,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginLeft: 10,
                        }}
                    >
                        {
                            directionOrder.map((direction) => (
                                dirIcon(direction, { marginLeft: width/6.2 })
                            ))
                        }
                    </div>
                    {
                        subsystems.map((subsystem) => {
                            const boxes = [
                                <div
                                    style={{
                                        margin: 5,
                                        marginLeft: 10,
                                        marginRight: 15,
                                    }}
                                >
                                    <span>{subsystem.name}</span>
                                </div>
                            ];
                            for (const direction of directionOrder) {
                                const subsystemOrder = subsystem[direction] ?? [];
                                boxes.push(
                                    <div
                                        style={{
                                            height: iconSize * 2.6,
                                            borderLeftWidth: 1,
                                            borderLeftStyle: 'solid',
                                            borderLeftColor: '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: width / 5,
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'center',
                                                alignItems: 'space-around',
                                                overflow: 'wrap',
                                                fontSize: iconSize,
                                            }}
                                        >
                                            {subsystemOrder.map((icon, i) => {
                                                const offline = offlineSystems.filter((off) => (
                                                    off.direction === direction
                                                    && off.index === i
                                                    && off.subsystem === subsystem.name
                                                )).length > 0;

                                                let selected = false;
                                                if (pendingMove) {
                                                    const { engineerSelection } = pendingMove;
                                                    selected = !!engineerSelection
                                                        && engineerSelection.direction === direction
                                                        && engineerSelection.index === i
                                                        && engineerSelection.subsystem === subsystem.name;
                                                }

                                                const color = selected ? 'black' : 'white';

                                                return (
                                                    <div
                                                        style={{
                                                            opacity: offline ? '0.3' : '1',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color,
                                                            backgroundColor: SubSystemsColors[icon],
                                                            borderRadius: iconSize,
                                                            border: `2px solid ${color}`,
                                                            marginLeft: 3,
                                                            marginRight: 3,
                                                            cursor: offline || !awaitingSelection ? undefined : 'pointer',
                                                        }}
                                                        onClick={awaitingSelection ? () => setCurrentSelection({
                                                            direction,
                                                            index: i,
                                                            subsystem: subsystem.name,
                                                            system: icon,
                                                        }) : undefined}
                                                    >
                                                        {SubSystemsIcons[icon]}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 2,
                                        borderStyle: 'solid',
                                        borderColor: subsystem.name !== 'S' ? '#888' : 'rgba(255,255,255,0.1)',
                                        borderRadius: 4,
                                        margin: 5,
                                    }}
                                >
                                    {boxes}
                                </div>
                            );
                        })
                    }
                </div>
                <div
                    style={{
                        fontSize: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        width: '90%',
                    }}
                >
                    <span><span style={{ color: '#f55' }}>1 Ship Damage</span> occurs at the end of a turn if either:</span>
                    <span>- All six Systems for a Cardinal Direction are offline</span>
                    <span>- All six Reactor Systems are offline</span>
                    <span>A, B, C will <span style={{ color: '#5f5' }}>Auto-Repair</span> if all 4 Systems are down</span>
                </div>
            </div>
            <ToolBelt>
                <Notes />
                {
                    !!pendingMove && (
                        <div>
                            <span>The Captain has set heading:</span>
                            {dirIcon(pendingMove.direction)}
                            <ConfirmSelection disabled={!pendingMove.engineerSelection || pendingMove.confirmed[Jobs.ENGINEER]} job={Jobs.ENGINEER} sendMessage={sendMessage} />
                        </div>
                    )
                }
            </ToolBelt>
        </div>
    )
}
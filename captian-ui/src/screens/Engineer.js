import {
    TILE_SIZE, Directions, MessageTypes, Jobs
} from '../constants';
import {
    SubSystems,
    SubSystemsColors, Systems, DependentSubSystem, SystemColors,
} from '../components/systems';
import {
    SubSystemsIcons,
    SystemIcons,
    dirIcon,
} from '../components/SystemIcons';
import Notes from '../components/toolbelt/Notes';
import ToolBelt from '../components/toolbelt/ToolBelt';
import ConfirmSelection from '../components/Confirm';

export default function Navigator(props) {
    const {
        boardWidth,
        boardHeight,
        myTeam,
        sendMessage,
        notes,
        setJobNotes,
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


    const width = (boardWidth * TILE_SIZE) + (TILE_SIZE * 2);
    const height = (boardHeight * TILE_SIZE) + (TILE_SIZE * 2);

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
            name: 'R',
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
                                dirIcon(direction, { marginLeft: width/6.2, color: pendingMove && pendingMove.direction === direction ? 'lime' : 'white' })
                            ))
                        }
                    </div>
                    {
                        subsystems.map((subsystem) => {
                            const boxes = [
                                <div
                                    key="subsystem-title-blank"
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
                                        key={`subsystem-title-${subsystem.name}-${direction}`}
                                        style={{
                                            height: iconSize * 2.6,
                                            borderLeftWidth: 1,
                                            borderLeftStyle: 'solid',
                                            borderLeftColor: '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: pendingMove && pendingMove.direction === direction ? 'rgba(255,255,255,0.15)' : undefined,
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

                                                let color = selected ? 'cyan' : 'white';
                                                const selectable = awaitingSelection && direction === pendingMove.direction;
                                                if (awaitingSelection && !selectable) {
                                                    color = '#ddd';
                                                }

                                                return (
                                                    <div
                                                        key={`eng-selection-${subsystem.name}-${direction}-${i}`}
                                                        style={{
                                                            opacity: offline ? '0.2' : '1',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color,
                                                            backgroundColor: SubSystemsColors[icon],
                                                            borderRadius: iconSize,
                                                            borderWidth: 2,
                                                            borderStyle: 'solid',
                                                            borderColor: selectable ? color : SubSystemsColors[icon],
                                                            marginLeft: 3,
                                                            marginRight: 3,
                                                            cursor: offline || !selectable ? undefined : 'pointer',
                                                        }}
                                                        onClick={selectable ? () => setCurrentSelection({
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
                                    key={`subsystem-${subsystem.name}`}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 2,
                                        borderStyle: 'solid',
                                        borderColor: subsystem.name !== 'R' ? '#888' : 'rgba(255,255,255,0.1)',
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
                    <span>A, B, C will <span style={{ color: '#5f5' }}>Auto-Repair</span> if inclusive 4 Systems are offline</span>
                    <span><span style={{ color: '#f55' }}>1 Damage</span> occurs & all Systems <span style={{ color: '#5f5' }}>Auto-Repair</span> if, at the end of a move, either:</span>
                    <span>- All six Systems for a Cardinal Direction are offline</span>
                    <span>- All six Reactors are offline</span>
                    {/*<span>All Systems will <span style={{ color: '#5f5' }}>Auto-Repair</span> if all six Reactors are offline</span>*/}
                </div>
            </div>
            <ToolBelt>
                <Notes
                    job={Jobs.ENGINEER}
                    notes={notes}
                    setJobNotes={setJobNotes}
                />
                {
                    Object.values(SubSystems)
                        .filter(subsystem => subsystem !== SubSystems.Reactor)
                        .map((subsystem) => (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                marginTop: 5,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    marginLeft: 20,
                                }}
                            >
                                <div
                                    style={{
                                        color: SubSystemsColors[subsystem],
                                        fontSize: 30,
                                        marginRight: 10,
                                    }}
                                >
                                    {SubSystemsIcons[subsystem]}
                                </div>
                                <span>{subsystem}</span>
                            </div>
                            <div
                            style={{
                                marginLeft: 40,
                                marginTop: -5,
                                marginBottom: 10,
                            }}
                            >
                                {
                                    Object.values(Systems)
                                        .filter(system => DependentSubSystem[system] === subsystem)
                                        .map((system) => (
                                            <div
                                                style={{
                                                    fontSize: 17,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        marginRight: 10,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: SystemColors[system],
                                                        borderRadius: 22,
                                                        fontSize: 22,
                                                    }}
                                                >
                                                    {SystemIcons[system]}
                                                </div>
                                                <span>{system}</span>
                                            </div>
                                        ))
                                }
                            </div>
                        </div>
                    ))
                }
                {
                    !!pendingMove && (
                        <ConfirmSelection disabled={!pendingMove.engineerSelection || pendingMove.confirmed[Jobs.ENGINEER]} job={Jobs.ENGINEER} sendMessage={sendMessage} />
                    )
                }
            </ToolBelt>
        </div>
    )
}
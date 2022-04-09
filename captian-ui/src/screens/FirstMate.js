import {
    TILE_SIZE,
    Jobs, MessageTypes,
} from '../constants';
import {
    Systems
} from '../components/systems';
import ToolBelt from '../components/toolbelt/ToolBelt';
import Notes from '../components/toolbelt/Notes';
import System from '../components/System';
import ConfirmSelection from '../components/Confirm';
import EnemyHistory from '../components/toolbelt/EnemyHistory';

export default function Navigator(props) {
    const {
        boardWidth,
        boardHeight,
        sendMessage,
        myTeam,
    } = props;

    const { systems, pendingMove } = myTeam;

    const width = (boardWidth * TILE_SIZE) + (TILE_SIZE * 2);
    const height = (boardHeight * TILE_SIZE) + (TILE_SIZE * 2);

    const onClick = (system) => {
        sendMessage(
            MessageTypes.SELECT_FIRSTMATE_SYSTEM,
            {
                firstmateSelection: system
            }
        )
    };

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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <System system={Systems.Torpedo} pendingMove={pendingMove} onClick={onClick} systems={systems} />
                        <System system={Systems.Mine} pendingMove={pendingMove} onClick={onClick} systems={systems} />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <System system={Systems.Drone} pendingMove={pendingMove} onClick={onClick} systems={systems} />
                        <System system={Systems.Sonar} pendingMove={pendingMove} onClick={onClick} systems={systems} />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <System system={Systems.Silence} pendingMove={pendingMove} onClick={onClick} systems={systems} />
                    </div>
                </div>
                <div
                    style={{
                        width: '90%',
                        fontSize: 16,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <span>Every movement, pick a System to charge.</span>
                    <span>Once a system is fully charged, it can be Deployed by the Captain.</span>
                </div>
                <div
                    style={{ marginTop: 20, height: 20 }}
                >
                    <span
                        style={{ color: 'cyan' }}
                    >
                        {myTeam.lastActionResult || ''}
                    </span>
                </div>
            </div>
            <ToolBelt
                height={height}
            >
                <Notes />
                <EnemyHistory
                    team={myTeam}
                />
                {
                    !!pendingMove && (
                        <ConfirmSelection disabled={!pendingMove.firstmateSelection || pendingMove.confirmed[Jobs.FIRSTMATE]} job={Jobs.FIRSTMATE} sendMessage={sendMessage} />
                    )
                }
            </ToolBelt>
        </div>
    )
}
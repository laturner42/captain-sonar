import {Systems} from '../components/systems';
import SonarAction from '../components/actions/SonarAction';
import DroneAction from '../components/actions/DroneAction';

export default function PauseActionScreen(props) {
    const {
        myTeam,
        enemyTeam,
        pauseAction,
        sendMessage
    } = props;

    const {
        system,
        teamNbr,
    } = pauseAction;

    const width = 400;
    const height = 300;

    const isMyAction = teamNbr === myTeam.teamNbr;

    return (
        <div
            style={{
                position: 'absolute',
                left: '30%',
                width,
                height,
                backgroundColor: '#ddd',
                borderColor: '#111',
                borderWidth: 3,
                borderRadius: 20,
                borderStyle: 'solid',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'black',
            }}
        >
            <div style={{ margin: 10 }}>
                <span>{system} Deployed!</span>
            </div>
            { system === Systems.Sonar && <SonarAction isMyAction={isMyAction} myTeam={myTeam} enemyTeam={enemyTeam} sendMessage={sendMessage} /> }
            { system === Systems.Drone && <DroneAction isMyAction={isMyAction} myTeam={myTeam} enemyTeam={enemyTeam} sendMessage={sendMessage} /> }
        </div>
    )
}
import { useState } from 'react';
import {
    KeyboardArrowDown
} from '@mui/icons-material';
import {Systems} from '../components/systems';
import SonarAction from '../components/actions/SonarAction';
import DroneAction from '../components/actions/DroneAction';

export default function PauseActionScreen(props) {
    const {
        myTeam,
        enemyTeam,
        pauseAction,
        sendMessage,
    } = props;

    const {
        system,
        teamNbr,
    } = pauseAction;

    const [ expanded, setExpanded ] = useState(true);

    const width = 400;
    const height = 300;

    const barHeight = 20;

    const isMyAction = teamNbr === myTeam.teamNbr;

    return (
        <div
            style={{
                position: 'absolute',
                bottom: expanded ? 0 : -height + barHeight,
                right: '10%',
                width,
                height,
                backgroundColor: '#fff7fa',
                borderColor: '#111',
                borderWidth: 3,
                borderRadius: 20,
                borderStyle: 'solid',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderBottomStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'black',
            }}
        >
            <div style={{ marginTop: expanded ? 10 : 3, marginBottom: 5, fontSize: expanded ? 22 : barHeight * 0.6 }}>
                <KeyboardArrowDown
                    style={{
                        position: 'absolute',
                        left: 10,
                        top: expanded ? 11 : 0,
                        transform: expanded ? 'none': 'rotate(180deg)',
                        color: '#349',
                        cursor: 'pointer',
                    }}
                    onClick={() => setExpanded(!expanded)}
                    title={expanded ? 'Collapse' : 'Expand'}
                />
                <span
                    style={{
                        color: '#26c',
                        fontWeight: 'bold',
                    }}
                >
                    {!isMyAction && 'Enemy'} {system} Deployed!
                </span>
            </div>
            <div
                style={{
                    margin: 10,
                }}
            >
                { system === Systems.Sonar && <SonarAction isMyAction={isMyAction} myTeam={myTeam} enemyTeam={enemyTeam} sendMessage={sendMessage} /> }
                { system === Systems.Drone && <DroneAction isMyAction={isMyAction} myTeam={myTeam} enemyTeam={enemyTeam} sendMessage={sendMessage} /> }
            </div>
        </div>
    )
}
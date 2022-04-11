import { useState, useEffect } from 'react';
import {
    CheckRounded as Check,
    MoreHoriz as Waiting,
} from '@mui/icons-material';
import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    Jobs as ScreenNames,
    getTeams,
    getMyRole, Jobs,
} from '../constants';

import Captain from '../screens/Captain';
import Navigator from '../screens/Navigator';
import FirstMate from '../screens/FirstMate';
import Engineer from '../screens/Engineer';

export default function Gameplay(props) {
    const {
        sendMessage,
        gameData,
        myName,
    } = props;

    const {
        myTeam,
        enemyTeam,
    } = getTeams(gameData.team1, gameData.team2, myName);

    const myJob = getMyRole(myTeam, myName);

    const [activeScreen, setActiveScreen] = useState(myJob || ScreenNames.CAPTAIN);
    const [notes, setNotes] = useState({
        [Jobs.CAPTAIN]: '',
        [Jobs.FIRSTMATE]: '',
        [Jobs.NAVIGATOR]: '',
        [Jobs.ENGINEER]: ''
    });

    const setJobNotes = (job, newJobNote) => {
        const newNotes = {
            ...notes,
        };
        newNotes[job] = newJobNote;
        setNotes(newNotes);
    }

    useEffect(() => {
        if (!myTeam || !enemyTeam) return;
        if (myTeam.health === 0 && enemyTeam.health === 0) {
            alert('It\'s a draw!');
        } else if (myTeam.health === 0) {
            alert('You Sunk! Enemy victory.');
        } else if (enemyTeam.health === 0) {
            alert('Enemy Sunk! You win!');
        }
    }, [myTeam, enemyTeam]);

    if (!gameData) return null;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    transform: 'rotate(-90deg)',
                    width: 70,
                    height: 70,
                    fontSize: 18,
                }}
            >
                {
                    Object.values(ScreenNames).map(screen => (
                        <div
                            key={`swap-screen-${screen}`}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {
                                !!myTeam.pendingMove && !myTeam.pendingMove.confirmed[screen] && (
                                    <div
                                        style={{
                                            color: '#aaa',
                                            transform: 'rotate(90deg)',
                                        }}
                                    >
                                        <Waiting />
                                    </div>
                                )
                            }
                            {
                                !!myTeam.pendingMove && myTeam.pendingMove.confirmed[screen] && (
                                    <div
                                        style={{
                                            color: 'lime',
                                            transform: 'rotate(90deg)',
                                        }}
                                    >
                                        <Check />
                                    </div>
                                )
                            }
                            <div
                                style={{
                                    borderWidth: 3,
                                    borderStyle: activeScreen === screen ? 'solid' : 'dotted',
                                    cursor: activeScreen === screen ? undefined : 'pointer',
                                    borderColor: 'brown',
                                    borderRadius: 10,
                                    margin: 5,
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                }}
                                onClick={() => setActiveScreen(screen)}
                            >
                                <span>{screen}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                activeScreen === ScreenNames.CAPTAIN && <Captain pauseAction={gameData.pauseAction} mapNbr={gameData.map} sendMessage={sendMessage} myTeam={myTeam} enemyTeam={enemyTeam} boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} />
            }
            {
                activeScreen === ScreenNames.NAVIGATOR && <Navigator notes={notes} setJobNotes={setJobNotes} mapNbr={gameData.map} myTeam={myTeam} sendMessage={sendMessage} enemyTeam={enemyTeam} boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} />
            }
            {
                activeScreen === ScreenNames.FIRSTMATE && <FirstMate notes={notes} setJobNotes={setJobNotes} sendMessage={sendMessage} myTeam={myTeam} boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} />
            }
            {
                activeScreen === ScreenNames.ENGINEER && <Engineer notes={notes} setJobNotes={setJobNotes} sendMessage={sendMessage} myTeam={myTeam} boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} />
            }
        </div>
    );
}

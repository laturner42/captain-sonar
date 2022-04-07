import { useState, useEffect } from 'react';
import {
    CheckRounded as Check,
    MoreHoriz as Waiting,
} from '@mui/icons-material';
import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    MessageTypes,
    Jobs as ScreenNames,
} from './constants';

import Captain from './screens/Captain';
import Navigator from './screens/Navigator';
import FirstMate from './screens/FirstMate';
import Engineer from './screens/Engineer';

export default function App() {
    const [socket, setSocket] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [activeScreen, setActiveScreen] = useState(ScreenNames.CAPTAIN);

    const sendMessage = (type, data, forceSocket) => (forceSocket || socket).send(JSON.stringify({
        name: 'name',
        type,
        data,
    }))

    const join = () => {
        sendMessage(MessageTypes.JOIN)
    }

    useEffect(() => {
        if (socket) {
            join();
        }
    }, [socket])

    const connect = () => {
        console.log('Connecting');
        const ws = new WebSocket('ws://127.0.0.1:9898/');
        ws.onopen = () => {
            console.log('Connected');
            setSocket(ws);
        };
        ws.onmessage = (e) => {
            console.log('got new game data');
            setGameData(JSON.parse(e.data));
        }
        ws.onclose = (e) => {
            setSocket(null);
            console.error(e);
        }
    }

    useEffect(() => {
        connect();
    }, []);

    if (!gameData) return null;

    const {
        team1: myTeam,
        team2: enemyTeam,
    } = gameData;

    return (
        <div style={{
            backgroundColor: '#282c34',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'calc(10px + 2vmin)',
            color: 'white',
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
                                    borderStyle: activeScreen === screen ? 'solid' : 'dashed',
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
                activeScreen === ScreenNames.CAPTAIN && <Captain sendMessage={sendMessage} myTeam={myTeam} boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} />
            }
            {
                activeScreen === ScreenNames.NAVIGATOR && <Navigator sendMessage={sendMessage} enemyTeam={enemyTeam} boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} />
            }
            {
                activeScreen === ScreenNames.FIRSTMATE && <FirstMate sendMessage={sendMessage} myTeam={myTeam} boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} />
            }
            {
                activeScreen === ScreenNames.ENGINEER && <Engineer sendMessage={sendMessage} myTeam={myTeam} boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} />
            }
        </div>
    );
}

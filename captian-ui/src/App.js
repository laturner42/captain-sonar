import { useState, useEffect } from 'react';
import {

} from '@mui/icons-material';
import {
    MessageTypes,
} from './constants';

import Gameplay from './components/Gameplay';
import Join from './screens/Join';
import SetRoles from './screens/SetRoles';

export default function App() {
    const [socket, setSocket] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [myName, setMyName] = useState('');

    const sendMessage = (type, data, forceSocket) => (forceSocket || socket).send(JSON.stringify({
        name: myName,
        type,
        data,
    }))

    const join = () => {
        console.log('oh my god were joining');
        sendMessage(MessageTypes.JOIN)
    }

    useEffect(() => {
        if (!socket) {
            setTimeout(connect, 1000);
        }
    }, [socket])

    const connect = () => {
        console.log('Connecting');
        const ws = new WebSocket('ws://127.0.0.1:9898/');
        ws.onopen = () => {
            console.log('Connected');
            setSocket(ws);
            if (myName && gameData.players.map(p => p.name).includes(myName)) {
                join();
            }
        };
        ws.onmessage = (e) => {
            setGameData(JSON.parse(e.data));
        }
        ws.onclose = (e) => {
            setSocket(null);
            console.error(e);
        }
    }

    return (
        <div style={{
            backgroundColor: '#282c34',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'calc(8px + 2vmin)',
            color: 'white',
        }}>
            {
                !socket && (
                    <div
                        style={{
                            position: 'absolute',
                            left: 5,
                            top: 5,
                            color: '#fcc',
                            fontSize: 12,
                        }}
                        onClick={connect}
                    >
                        <span>Connecting...</span>
                    </div>
                )
            }
            {
                !gameData && (
                    <Join
                        myName={myName}
                        setMyName={setMyName}
                        join={join}
                        connected={!!socket}
                    />
                )
            }
            {
                !!gameData && !gameData.gameStarted && (
                    <SetRoles
                        sendMessage={sendMessage}
                        gameData={gameData}
                    />
                )
            }
            {
                !!gameData && gameData.gameStarted && (
                    <Gameplay
                        sendMessage={sendMessage}
                        gameData={gameData}
                        myName={myName}
                    />
                )
            }
        </div>
    );
}

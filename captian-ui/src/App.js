import { useState } from 'react';
import Path from './components/Path';
import {
    BOARD_WIDTH,
    BOARD_HEIGHT, Directions,
} from './constants';

import Captain from './screens/Captain';
import Navigator from './screens/Navigator';
import FirstMate from './screens/FirstMate';

const ScreenNames = {
    CAPTAIN: 'CAPTAIN',
    NAVIGATOR: 'NAVIGATOR',
    FIRSTMATE: 'FIRSTMATE',
}

export default function App() {
    const [activeScreen, setActiveScreen] = useState(ScreenNames.FIRSTMATE)

    const path = new Path(0, 0, true);
    path.move(Directions.East);
    path.move(Directions.South);
    path.move(Directions.South);
    path.move(Directions.West);
    path.move(Directions.West);
    path.move(Directions.West);
    path.move(Directions.South);
    path.move(Directions.West);

    return (
        <div style={{
            backgroundColor: '#282c34',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'calc(10px + 2vmin)',
            color: 'white',
        }}>
            {
                activeScreen === ScreenNames.CAPTAIN && <Captain boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} shipPath={path} />
            }
            {
                activeScreen === ScreenNames.NAVIGATOR && <Navigator boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} shipPath={path} />
            }
            {
                activeScreen === ScreenNames.FIRSTMATE && <FirstMate boardWidth={BOARD_WIDTH} boardHeight={BOARD_HEIGHT} />
            }
        </div>
    );
}

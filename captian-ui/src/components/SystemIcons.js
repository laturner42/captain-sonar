import {
    Rocket as Torpedo,
    SportsSoccer as Mines,
    ConnectingAirports as Drone,
    TrackChanges as Sonar,
    HearingDisabled as Silence,

    RocketLaunch as Weapons,
    TravelExplore as Search,
    HearingDisabled as Flee,
    NearbyError as Reactor, Navigation as Arrow,
} from '@mui/icons-material';

import { Systems, SubSystems } from './systems';
import {Directions} from '../constants';

const rotations = {
    [Directions.North]: 0,
    [Directions.South]: 180,
    [Directions.East]: 90,
    [Directions.West]: -90,
}

export const dirIcon = (direction, oStyle = {}) => (
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

export const SystemIcons = {
    [Systems.Torpedo]: <Torpedo fontSize="inherit" />,
    [Systems.Mines]: <Mines fontSize="inherit" />,
    [Systems.Drone]: <Drone fontSize="inherit" />,
    [Systems.Sonar]: <Sonar fontSize="inherit" />,
    [Systems.Silence]: <Silence fontSize="inherit" />,
};

export const SubSystemsIcons = {
    [SubSystems.Weapons]: <Weapons fontSize="inherit" />,
    [SubSystems.Search]: <Search fontSize="inherit" />,
    [SubSystems.Flee]: <Flee fontSize="inherit" />,
    [SubSystems.Reactor]: <Reactor fontSize="inherit" />,
}

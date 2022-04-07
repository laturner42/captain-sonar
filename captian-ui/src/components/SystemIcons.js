import {
    Rocket as Torpedo,
    SportsSoccer as Mines,
    ConnectingAirports as Drone,
    TrackChanges as Sonar,
    HearingDisabled as Silence,

    RocketLaunch as Weapons,
    TravelExplore as Search,
    HearingDisabled as Flee,
    NearbyError as Reactor,
} from '@mui/icons-material';

import { Systems, SubSystems } from './systems';

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

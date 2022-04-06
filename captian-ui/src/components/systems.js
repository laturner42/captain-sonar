import {
    Rocket as Torpedo,
    SportsSoccer as Mines,
    ConnectingAirports as Drone,
    TrackChanges as Sonar,
    HearingDisabled as Silence,
} from '@mui/icons-material';

export const Systems = {
    Torpedo: 'Torpedo',
    Mines: 'Mines',
    Drone: 'Drone',
    Sonar: 'Sonar',
    Silence: 'Silence',
}

export const SystemIcons = {
    [Systems.Torpedo]: <Torpedo fontSize="inherit" />,
    [Systems.Mines]: <Mines fontSize="inherit" />,
    [Systems.Drone]: <Drone fontSize="inherit" />,
    [Systems.Sonar]: <Sonar fontSize="inherit" />,
    [Systems.Silence]: <Silence fontSize="inherit" />,
};

export const SystemColors = {
    [Systems.Torpedo]: 'red',
    [Systems.Mines]: 'red',
    [Systems.Drone]: 'green',
    [Systems.Sonar]: 'green',
    [Systems.Silence]: 'gold',
}
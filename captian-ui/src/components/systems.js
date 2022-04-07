const Systems = {
    Torpedo: 'Torpedo',
    Mines: 'Mines',
    Drone: 'Drone',
    Sonar: 'Sonar',
    Silence: 'Silence',
}

const SystemColors = {
    [Systems.Torpedo]: 'red',
    [Systems.Mines]: 'red',
    [Systems.Drone]: 'green',
    [Systems.Sonar]: 'green',
    [Systems.Silence]: '#ddb600',
}


const SubSystems = {
    Weapons: 'Weapons',
    Search: 'Search',
    Flee: 'Flee',
    Reactor: 'Reactor',
}

const SubSystemsColors = {
    [SubSystems.Weapons]: SystemColors[Systems.Torpedo],
    [SubSystems.Search]: SystemColors[Systems.Sonar],
    [SubSystems.Flee]: SystemColors[Systems.Silence],
    [SubSystems.Reactor]: 'blue',
}

module.exports = {
    Systems,
    SystemColors,
    SubSystems,
    SubSystemsColors,
};

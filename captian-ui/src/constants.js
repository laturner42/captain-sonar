const MessageTypes = {
    JOIN: 1,
    HEAD: 2,
    SELECT_ENGINEER_SYSTEM: 3,
    SELECT_FIRSTMATE_SYSTEM: 4,
    CONFIRM_SELECTION: 5,
    SET_START: 6,
    ASSIGN_PLAYER: 7,
    REMOVE_PLAYER: 8,
    START_GAME: 9,
};

const Jobs = {
    ENGINEER: 'ENGINEER',
    NAVIGATOR: 'NAVIGATOR',
    FIRSTMATE: 'FIRSTMATE',
    CAPTAIN: 'CAPTAIN',
}

const Directions = {
    North: 'N',
    South: 'S',
    East: 'E',
    West: 'W',
}

const getMyRole = (team, name) => {
    if (!team || !name) return null;
    return Object.keys(Jobs).filter(job => team.roles[job] === name)[0];
}

const getTeams = (team1, team2, name) => {
    let myTeam;
    let enemyTeam;
    const team1Players = Object.values(team1.roles);
    const team2Players = Object.values(team2.roles);
    if (team1Players.includes(name)) {
        myTeam = team1;
        enemyTeam = team2;
    }
    else if (team2Players.includes(name)) {
        myTeam = team2;
        enemyTeam = team1;
    }
    return {
        myTeam,
        enemyTeam,
    }
};

module.exports = {
    Jobs,
    MessageTypes,
    Directions,
    getTeams,
    getMyRole,
    TOOL_BELT_WIDTH: 200,
    TILE_SIZE: 30,
    BOARD_WIDTH: 15,
    BOARD_HEIGHT: 15,
};

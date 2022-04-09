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
    DEPLOY_SYSTEM: 10,

    PLACE_MINE: 11,
    LAUNCH_TORPEDO: 12,
    SEND_DRONES: 13,
    SCAN_SONAR: 14,
    BE_QUIET: 15,

    SURFACE: 16,
    UNDO_HEAD: 17,
    TRIGGER_MINE: 18,
    SAVE_MAP_LOC: 19,
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

const TILE_SIZE = 30;
const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 15;

const getBadLocations = (team, map) => {
    const {
        startCol,
        startRow,
        path,
    } = team.currentShipPath;
    let currentCol = startCol;
    let currentRow = startRow;
    const badLocs = [...team.mines, ...map.islandLocs, [currentCol, currentRow]];

    const moves = {
        [Directions.North]: [0, -1],
        [Directions.South]: [0, 1],
        [Directions.East]: [1, 0],
        [Directions.West]: [-1, 0],
    };
    for (const direction of path) {
        const move = moves[direction]
        currentCol += move[0];
        currentRow += move[1];
        badLocs.push([ currentCol, currentRow ]);
    }
    return badLocs;
}

const getCurrentLoc = (currentPath) => {
    const {
        startCol,
        startRow,
        path,
    } = currentPath;
    const moves = {
        [Directions.North]: [0, -1],
        [Directions.South]: [0, 1],
        [Directions.East]: [1, 0],
        [Directions.West]: [-1, 0],
    }
    return path.reduce((currentLoc, direction) => {
        const move = moves[direction];
        return [
            currentLoc[0] + move[0],
            currentLoc[1] + move[1],
        ]
    }, [startCol, startRow]);
}

const calculateSector = (col, row) => {
    const sectors = [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
    ]
    const sectorCol = Math.floor(col / 5);
    const sectorRow = Math.floor(row / 5);
    return sectors[sectorCol][sectorRow];
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'O', 'P', 'Q'];

module.exports = {
    Jobs,
    MessageTypes,
    Directions,
    letters,
    getCurrentLoc,
    calculateSector,
    getBadLocations,
    getTeams,
    getMyRole,
    TOOL_BELT_WIDTH: 200,
    TILE_SIZE,
    BOARD_WIDTH,
    BOARD_HEIGHT,
    MAP_WIDTH: BOARD_WIDTH * TILE_SIZE,
    MAP_HEIGHT: BOARD_HEIGHT * TILE_SIZE,
};

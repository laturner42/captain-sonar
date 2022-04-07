const MessageTypes = {
    JOIN: 1,
    HEAD: 2,
    SELECT_ENGINEER_SYSTEM: 3,
    SELECT_FIRSTMATE_SYSTEM: 4,
    CONFIRM_SELECTION: 5,
    SET_START: 6,
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

module.exports = {
    Jobs,
    MessageTypes,
    Directions,
    TOOL_BELT_WIDTH: 200,
    TILE_SIZE: 30,
    BOARD_WIDTH: 15,
    BOARD_HEIGHT: 15,
};

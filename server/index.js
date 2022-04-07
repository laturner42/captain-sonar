const http = require('http');
const {
    server: WebSocketServer,
} = require('websocket');
const { MessageTypes, Jobs, getTeams } = require('../captian-ui/src/constants');
const { Systems } = require('../captian-ui/src/components/systems');

const connections = {};
const players = {};

const newTeam = (teamNbr) => {
    return {
        teamNbr,
        roles: {
            [Jobs.CAPTAIN]: null,
            [Jobs.FIRSTMATE]: null,
            [Jobs.NAVIGATOR]: null,
            [Jobs.ENGINEER]: null,
        },
        systems: {
            [Systems.Torpedo]: {
                max: 3,
                filled: 0,
            },
            [Systems.Mines]: {
                max: 3,
                filled: 0,
            },
            [Systems.Drone]: {
                max: 4,
                filled: 0,
            },
            [Systems.Sonar]: {
                max: 3,
                filled: 0,
            },
            [Systems.Silence]: {
                max: 6,
                filled: 0,
            },
        },
        currentShipPath: {
            startCol: 0,
            startRow: 0,
            path: [],
        },
        startSelected: false,
        offlineSystems: [],
        pendingMove: null,
        pastShipPaths: [],
    };
}

const generateNewGame = () => {
    const newGameState = {
        players,
        gameStarted: false,
        leader: null,
    };
    newGameState.team1 = newTeam(1);
    newGameState.team2 = newTeam(2);
    return newGameState;
}

let gameState = generateNewGame();

const updateEveryone = async () => {
    return Promise.all(
        Object.values(connections).map((connection) => {
            return connection.sendUTF(JSON.stringify(gameState));
        })
    );
};

const playerJoin = async (name) => {
    if (!players[name]) {
        players[name] = {
            name,
        }
    }
    if (!gameState.leader) gameState.leader = name;
}

const takeDownSystem = (team, system) => {
    team.offlineSystems.push(system);
    const counts = {};
    for (const system of team.offlineSystems) {
        if (!counts[system.subsystem]) {
            counts[system.subsystem] = 0;
        }
        counts[system.subsystem] += 1;
    }
    for (const subsystem of Object.keys(counts)) {
        if (counts[subsystem] === 4) {
            team.offlineSystems = team.offlineSystems.filter(system => system.subsystem !== subsystem);
        }
    }
}

const parseMessage = async (packet, connection) => {
    const { type, name, data } = packet;

    connections[name] = connection;

    if (!players[name]) {
        console.debug(name, 'has joined');
        await playerJoin(name);
    }

    const {
        myTeam
    } = getTeams(gameState.team1, gameState.team2, name);

    switch (type) {
        case MessageTypes.JOIN:
            break;
        case MessageTypes.ASSIGN_PLAYER:
            const {
                newJob,
                playerName,
                teamNbr: newTeamNbr,
            } = data;
            const newTeam = newTeamNbr === 1 ? gameState.team1 : gameState.team2;
            newTeam.roles[newJob] = playerName;
            break;
        case MessageTypes.REMOVE_PLAYER:
            const {
                oldJob,
                teamNbr: oldTeamNbr,
            } = data;
            const oldTeam = oldTeamNbr === 1 ? gameState.team1 : gameState.team2;
            oldTeam.roles[oldJob] = null;
            break;
        case MessageTypes.START_GAME:
            gameState.gameStarted = true;
            break;
        case MessageTypes.SET_START:
            const {
                startCol,
                startRow,
            } = data;
            myTeam.currentShipPath.startCol = startCol;
            myTeam.currentShipPath.startRow = startRow;
            break;
        case MessageTypes.HEAD:
            const { direction } = data;
            myTeam.pendingMove = {
                direction,
                confirmed: {
                    [Jobs.FIRSTMATE]: false,
                    [Jobs.ENGINEER]: false,
                    [Jobs.CAPTAIN]: true,
                    [Jobs.NAVIGATOR]: true,
                },
            };
            break;
        case MessageTypes.SELECT_ENGINEER_SYSTEM:
            if (!myTeam.pendingMove) break;
            const { engineerSelection } = data;
            myTeam.pendingMove.engineerSelection = engineerSelection;
            break;
        case MessageTypes.SELECT_FIRSTMATE_SYSTEM:
            if (!myTeam.pendingMove) break;
            const { firstmateSelection } = data;
            myTeam.pendingMove.firstmateSelection = firstmateSelection;
            break;
        case MessageTypes.CONFIRM_SELECTION:
            const { job } = data;
            if (job === Jobs.CAPTAIN && !myTeam.startSelected) {
                myTeam.startSelected = true;
                break;
            }
            if (!myTeam.pendingMove) break;
            myTeam.pendingMove.confirmed[job] = true;
            const {
                [Jobs.ENGINEER]: engineerConfirmed,
                [Jobs.FIRSTMATE]: firstMateConfirmed,
            } = myTeam.pendingMove.confirmed
            if (engineerConfirmed && firstMateConfirmed) {
                myTeam.currentShipPath.path.push(myTeam.pendingMove.direction);
                takeDownSystem(myTeam, myTeam.pendingMove.engineerSelection);
                myTeam.systems[myTeam.pendingMove.firstmateSelection].filled += 1;
                myTeam.pendingMove = null;
            }
            break;
        default:
            console.error('Unknown message type', type ,'received from user', name);
            console.debug(packet);
            break;
    }
    await updateEveryone();
};

const httpServer = http.createServer();
const WS_PORT = process.env.WS_PORT || 9898;
httpServer.listen(WS_PORT, () => console.debug(`Websocket listening on port ${WS_PORT}`));
const wsServer = new WebSocketServer({ httpServer });
wsServer.on('request', (request) => {
    console.debug('New connection');
    const connection = request.accept(null, request.origin);
    connection.on('message', (message) => {
        const packet = JSON.parse(message.utf8Data);
        return parseMessage(packet, connection);
    });
    connection.on('close', (reasonCode, desc) => {
        console.debug('Client lost.', reasonCode, desc);
    });
});

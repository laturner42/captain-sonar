const http = require('http');
const {
    server: WebSocketServer,
} = require('websocket');
const { MessageTypes, Jobs, getTeams, DependentSubSystem, calculateSector, getCurrentLoc } = require('../captian-ui/src/constants');
const { Systems } = require('../captian-ui/src/components/systems');

const connections = {};
const players = {};

const newTeam = (teamNbr) => {
    return {
        teamNbr,
        health: 4,
        surfaced: false,
        lastActionResult: null,
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
            startCol: 7,
            startRow: 7,
            path: [],
        },
        history: [],
        startSelected: false,
        offlineSystems: [],
        pendingMove: null,
        pastShipPaths: [],
    };
}

const generateNewGame = () => {
    const newGameState = {
        players,
        pauseAction: null,
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
    await updateEveryone();
}

const takeDamage = (team, amount) => {
    team.health -= amount;
    team.history.push(`Took ${amount} Damage`);
    if (team.health < 0) team.health = 0;
    // TODO: end game
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
        return await playerJoin(name);
    }

    const {
        myTeam,
        enemyTeam,
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
            myTeam.lastActionResult = null;
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
            } = myTeam.pendingMove.confirmed;
            if (engineerConfirmed && firstMateConfirmed) {
                const { firstmateSelection } = myTeam.pendingMove;
                myTeam.currentShipPath.path.push(myTeam.pendingMove.direction);
                takeDownSystem(myTeam, myTeam.pendingMove.engineerSelection);
                const filledSystem = myTeam.systems[firstmateSelection];
                filledSystem.filled += 1;
                myTeam.history.push(`Head ${myTeam.pendingMove.direction}`);
                if (filledSystem.filled === filledSystem.max) {
                    myTeam.history.push(`${firstmateSelection} Ready`);
                }
                myTeam.pendingMove = null;
            }
            break;
        case MessageTypes.DEPLOY_SYSTEM:
            const {
                system: deployedSystem,
            } = data;
            myTeam.history.push(`Deploying ${deployedSystem}`);
            const dependentSubsystem = DependentSubSystem[deployedSystem];
            let offline = false;
            for (const subsystem of myTeam.offlineSystems) {
                if (subsystem.system === dependentSubsystem) {
                    offline = true;
                    break;
                }
            }
            if (!offline) {
                gameState.pauseAction = {
                    teamNbr: myTeam.teamNbr,
                    system: deployedSystem,
                };
            } else {
                myTeam.systems[deployedSystem].filled -= 1;
                takeDamage(myTeam, 1);
            }
            break;
        case MessageTypes.SURFACE:
            const [ currentCol, currentRow ] = getCurrentLoc(myTeam.currentShipPath);
            myTeam.history.push(`Surfaced in Sector ${calculateSector(currentCol, currentRow)}`);
            myTeam.surfaced = true;
            myTeam.offlineSystems = [];
            // Dive 60s Later
            setTimeout(() => {
                myTeam.history.push('Dove');
                myTeam.pastShipPaths.push(myTeam.currentShipPath);
                myTeam.currentShipPath = {
                    startCol: myTeam.currentShipPath.startCol,
                    startRow: myTeam.currentShipPath.startRow,
                    path: [],
                };
                myTeam.surfaced = false;
            }, 60 * 1000);
            break;
        case MessageTypes.SCAN_SONAR:
            const {
                sector: chosenSector,
            } = data;
            const [ enemyCol, enemyRow ] = getCurrentLoc(enemyTeam.currentShipPath);
            const actualSector = calculateSector(enemyCol, enemyRow);
            myTeam.lastActionResult = `The Enemy is ${actualSector === chosenSector ? '' : 'not '}in Sector ${actualSector}`;
            myTeam.history.push(`Guessed Sector ${chosenSector}`);
            gameState.pauseAction = null;
            break;
        case MessageTypes.SEND_DRONES:
            const {
                message,
            } = data;
            enemyTeam.lastActionResult = message;
            gameState.pauseAction = null;
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

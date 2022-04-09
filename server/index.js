const http = require('http');
const {
    server: WebSocketServer,
} = require('websocket');
const { MessageTypes, Jobs, getTeams, calculateSector, getCurrentLoc, letters } = require('../captian-ui/src/constants');
const { Systems, SubSystems, DependentSubSystem } = require('../captian-ui/src/components/systems');

const connections = {};
const players = {};

const newTeam = (teamNbr) => {
    return {
        teamNbr,
        health: 4,
        surfaced: false,
        lastActionResult: null,
        hasFired: false,
        roles: {
            [Jobs.CAPTAIN]: null,
            [Jobs.FIRSTMATE]: null,
            [Jobs.NAVIGATOR]: null,
            [Jobs.ENGINEER]: null,
        },
        systems: {
            [Systems.Torpedo]: {
                max: 3,
                filled: 3,
            },
            [Systems.Mines]: {
                max: 3,
                filled: 3,
            },
            [Systems.Drone]: {
                max: 4,
                filled: 4,
            },
            [Systems.Sonar]: {
                max: 3,
                filled: 3,
            },
            [Systems.Silence]: {
                max: 6,
                filled: 6,
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
        mines: [],
    };
}

const generateNewGame = () => {
    const newGameState = {
        players,
        pauseAction: null,
        gameStarted: false,
        leader: null,
        map: 1,
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
    let reactorsOffline = 0;
    for (const system of team.offlineSystems) {
        if (!counts[system.subsystem]) {
            counts[system.subsystem] = 0;
        }
        counts[system.subsystem] += 1;
        if (system.system === SubSystems.Reactor) {
            reactorsOffline += 1;
        }
    }
    if (reactorsOffline === 6) {
        team.health -= 1;
        team.offlineSystems = [];
    } else {
        for (const subsystem of Object.keys(counts)) {
            if (subsystem !== 'R' && counts[subsystem] === 4) {
                team.offlineSystems = team.offlineSystems.filter(system => system.subsystem !== subsystem);
            }
        }
    }
}

const triggerAttack = (myTeam, enemyTeam, attackCol, attackRow, system) => {
    const [ currentSelfCol, currentSelfRow ] = getCurrentLoc(myTeam.currentShipPath);
    const [ currentEnemyCol, currentEnemyRow ] = getCurrentLoc(enemyTeam.currentShipPath);
    myTeam.history.push(`${system === Systems.Torpedo ? 'Fired' : 'Triggered'} ${system} at ${letters[attackCol]}${attackRow + 1}`);
    if (currentSelfCol === attackCol && currentSelfRow === attackRow) {
        takeDamage(myTeam, 2);
    } else if (Math.abs(currentSelfCol - attackCol) <= 1 && Math.abs(currentSelfRow - attackRow) <= 1) {
        takeDamage(myTeam, 1);
    }
    if (currentEnemyCol === attackCol && currentEnemyRow === attackRow) {
        takeDamage(enemyTeam, 2);
        myTeam.lastActionResult = 'The Enemy ship took 2 damage.';
    } else if (Math.abs(currentEnemyCol - attackCol) <= 1 && Math.abs(currentEnemyRow - attackRow) <= 1) {
        takeDamage(enemyTeam, 1);
        myTeam.lastActionResult = 'The Enemy ship took 1 damage.';
    } else {
        myTeam.lastActionResult = `The ${Systems.Mines} missed the Enemy ship.`;
    }
    if (system === Systems.Torpedo) {
        myTeam.systems[Systems.Torpedo].filled = 0;
    }
    gameState.pauseAction = null;
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
            if (gameState.gameStarted) break;
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
            if (myTeam.startSelected) break;
            const {
                startCol,
                startRow,
            } = data;
            myTeam.currentShipPath.startCol = startCol;
            myTeam.currentShipPath.startRow = startRow;
            break;
        case MessageTypes.HEAD:
            if (myTeam.pendingMove) break;
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
        case MessageTypes.UNDO_HEAD:
            myTeam.pendingMove = null;
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
            if (job === Jobs.CAPTAIN) {
                myTeam.pendingMove = null;
                break;
            }
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
                filledSystem.filled = Math.min(filledSystem.max, filledSystem.filled + 1);
                myTeam.history.push(`Head ${myTeam.pendingMove.direction}`);
                if (filledSystem.filled === filledSystem.max) {
                    myTeam.history.push(`${firstmateSelection} Ready`);
                }
                myTeam.hasFired = false;
                myTeam.lastActionResult = null;
                myTeam.pendingMove = null;
            }
            break;
        case MessageTypes.DEPLOY_SYSTEM:
            if (gameState.pauseAction) break;
            const {
                system: deployedSystem,
            } = data;
            if (myTeam.systems[deployedSystem].filled !== myTeam.systems[deployedSystem].max) break;
            myTeam.hasFired = true;
            const dependentSubsystem = DependentSubSystem[deployedSystem];
            let offline = false;
            for (const subsystem of myTeam.offlineSystems) {
                if (subsystem.system === dependentSubsystem) {
                    offline = true;
                    break;
                }
            }
            if (!offline) {
                myTeam.history.push(`Deployed ${deployedSystem}`);
                gameState.pauseAction = {
                    teamNbr: myTeam.teamNbr,
                    system: deployedSystem,
                };
            } else {
                myTeam.history.push(`Attempted to Deploy ${deployedSystem}`);
                myTeam.systems[deployedSystem].filled -= 1;
                takeDamage(myTeam, 1);
            }
            break;
        case MessageTypes.SURFACE:
            if (myTeam.surfaced) break;
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
                updateEveryone();
            }, 60 * 1000);
            break;
        case MessageTypes.SCAN_SONAR:
            if (!gameState.pauseAction || gameState.pauseAction.system !== Systems.Sonar) break;
            const {
                sector: chosenSector,
            } = data;
            const [ enemyCol, enemyRow ] = getCurrentLoc(enemyTeam.currentShipPath);
            const actualSector = calculateSector(enemyCol, enemyRow);
            myTeam.lastActionResult = `The Enemy is ${actualSector === chosenSector ? '' : 'not '}in Sector ${chosenSector}`;
            myTeam.history.push(`Guessed Sector ${chosenSector}`);
            myTeam.systems[Systems.Sonar].filled = 0;
            gameState.pauseAction = null;
            break;
        case MessageTypes.SEND_DRONES:
            if (!gameState.pauseAction || gameState.pauseAction.system !== Systems.Drone) break;
            const {
                message,
            } = data;
            enemyTeam.lastActionResult = message;
            enemyTeam.systems[Systems.Drone].filled = 0;
            gameState.pauseAction = null;
            break;
        case MessageTypes.PLACE_MINE:
            if (!gameState.pauseAction || gameState.pauseAction.system !== Systems.Mines) break;
            const {
                col: mineCol,
                row: mineRow,
            } = data;
            myTeam.lastActionResult = `Mine placed at ${letters[mineCol]}${mineRow + 1}.`;
            myTeam.mines.push([mineCol, mineRow]);
            myTeam.systems[Systems.Mines].filled = 0;
            myTeam.history.push('Placed Mine');
            gameState.pauseAction = null;
            break;
        case MessageTypes.LAUNCH_TORPEDO:
            if (!gameState.pauseAction || gameState.pauseAction.system !== Systems.Torpedo) break;
            const {
                col: torpedoCol,
                row: torpedoRow,
            } = data;
            triggerAttack(myTeam, enemyTeam, torpedoCol, torpedoRow, Systems.Torpedo)
            break;
        case MessageTypes.TRIGGER_MINE:
            const {
                col: triggerMineCol,
                row: triggerMineRow,
            } = data;
            let index = -1;
            for (let i=0; i<myTeam.mines.length; i++) {
                const mine = myTeam.mines[i];
                if (mine[0] === triggerMineCol && mine[1] === triggerMineRow) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                triggerAttack(myTeam, enemyTeam, triggerMineCol, triggerMineRow, Systems.Torpedo);
                const newMines = [...myTeam.mines];
                newMines.splice(index, 1);
                myTeam.mines = newMines;
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

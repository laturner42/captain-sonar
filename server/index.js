const http = require('http');
const {
    server: WebSocketServer,
} = require('websocket');
const { MessageTypes } = require('../captian-ui/src/constants');

const connections = {};
const players = {};

const gameState = {
    players,
    leader: null,
};

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

const parseMessage = async (packet, connection) => {
    const { type, name, data } = packet;

    if (!players[name]) {
        console.debug(name, 'has joined');
        connections[name] = connection;
        await playerJoin(name);
    }

    switch (type) {
        case MessageTypes.JOIN:
            break;
        default:
            console.error('Unknown message type', type ,'received from user', name);
            console.debug(packet);
            break;
    }
};

const httpServer = http.createServer();
const WS_PORT = process.env.WS_PORT || 9898;
httpServer.listen(WS_PORT, () => console.debug(`Websocket listening on port ${WS_PORT}`));
const wsServer = new WebSocketServer({ httpServer });
wsServer.on('request', (request) => {
    console.debug('New connection');
    const connection = request.accept(null, request.origin);
    console.log(connection);
    connection.on('message', (message) => {
        const packet = JSON.parse(message.utf8Data);
        return parseMessage(packet, connection);
    });
    connection.on('close', (reasonCode, desc) => {
        console.debug('Client lost.', reasonCode, desc);
    });
});

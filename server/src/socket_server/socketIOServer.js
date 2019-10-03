/**
 * User: abhijit.baldawa
 */

const
    SocketIO = require('socket.io'),
    logger = require('../logger/logger'),
    {chatSend, chatBroadcast} = require('../../../common/socketEvents');

let
    io,
    connectedSockets = new Set(),
    chatHistoryArr = [];

function socketConnected( socket ) {
    connectedSockets.add(socket);
    logger.info(`socket.id = ${socket.id} connected to server. No of connected sockets = ${connectedSockets.size}`);

    socket.on('disconnect', function(){
        connectedSockets.delete( socket );
        logger.info(`socket.id = ${socket.id} disconnected. No of connected sockets = ${connectedSockets.size}`);
    });

    socket.on( chatSend.eventName, ( chatObj ) => {
        chatHistoryArr.push(chatObj);
        emitToAll( [chatObj] );
    } );

    if( chatHistoryArr.length ) {
        // Send full chat history when first connected
        socket.emit(chatBroadcast.eventName, chatHistoryArr);
    }
}

function emitToAll( chatArr ) {
    if( connectedSockets.size ) {
        logger.info(`Broadcasting all connected users about latest message`);
        io.emit( chatBroadcast.eventName, chatArr );
    }
}

function init(httpServer) {
    io = SocketIO(httpServer);
    io.on('connection', socketConnected);
}

module.exports = {
    init
};